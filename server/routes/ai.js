import express from 'express'
import {
  AiProviderServiceError,
  AI_SERVICE_LIMITS,
  generateSelectionAdvice,
} from '../services/aiProviderService.js'
import { buildProductContext } from '../services/productContextService.js'
import { buildProductReportMessages } from '../services/productReportService.js'
import { parsePositiveInteger } from '../utils/number.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'
import { readProductById } from '../utils/productStore.js'

const router = express.Router()
const activeAiClientRequests = new Map()
const ALLOWED_CHAT_ROLES = new Set(['user', 'assistant'])
const MAX_CHAT_MESSAGES = 6
const MAX_PROMPT_ASSISTANT_CONTENT_LENGTH = 700
const AI_TEMPORARY_FAILURE_MESSAGE = 'AI 服务暂时不可用，请稍后再试'
const GREETING_MESSAGES = new Set([
  'hello',
  'hi',
  'hey',
  '你好',
  '您好',
  '嗨',
  '哈喽',
  '哈罗',
])
const GREETING_REPLY =
  '你好，我是 AI 选品助手。你可以问我：哪些手机支架适合优先加入候选池、某个商品有哪些风险、利润率和竞争度应该怎么判断。'

function getClientId(req) {
  return req.get('x-client-id')?.trim() || ''
}

function getLatestUserMessage(messages) {
  const latestUserMessage = [...messages].reverse().find((message) => {
    return message.role === 'user'
  })

  return latestUserMessage?.content || ''
}

function isGreetingMessage(message) {
  const normalizedMessage = message
    .trim()
    .toLowerCase()
    .replace(/[!！.。?？,，、~～\s]/g, '')

  return GREETING_MESSAGES.has(normalizedMessage)
}

function sendAiError(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    message,
  })
}

function getAiClientKey(req) {
  const clientId = getClientId(req)

  if (clientId) {
    return `client:${clientId}`
  }

  const forwardedFor = req.get('x-forwarded-for')?.split(',')[0]?.trim()

  if (forwardedFor) {
    return `ip:${forwardedFor}`
  }

  return `ip:${req.ip || req.socket?.remoteAddress || 'anonymous'}`
}

function validateChatMessages(rawMessages) {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return {
      error: 'messages 必须是非空数组。',
    }
  }

  const messages = []

  for (const rawMessage of rawMessages) {
    if (!rawMessage || typeof rawMessage !== 'object' || Array.isArray(rawMessage)) {
      return {
        error: 'messages 中每条消息必须是对象。',
      }
    }

    if (!ALLOWED_CHAT_ROLES.has(rawMessage.role)) {
      return {
        error: 'messages 中每条消息的 role 只能是 user 或 assistant。',
      }
    }

    const content = typeof rawMessage.content === 'string' ? rawMessage.content.trim() : ''

    if (!content) {
      return {
        error: 'messages 中每条消息的 content 必须是非空字符串。',
      }
    }

    if (rawMessage.role === 'user' && content.length > AI_SERVICE_LIMITS.maxUserMessageLength) {
      return {
        error: `用户消息不能超过 ${AI_SERVICE_LIMITS.maxUserMessageLength} 个字符。`,
      }
    }

    messages.push({
      role: rawMessage.role,
      content,
    })
  }

  if (!messages.some((message) => message.role === 'user')) {
    return {
      error: 'messages 中至少需要包含一条 user 消息。',
    }
  }

  const recentMessages = messages.slice(-MAX_CHAT_MESSAGES)

  if (!recentMessages.some((message) => message.role === 'user')) {
    return {
      error: '最近的 messages 中至少需要包含一条 user 消息。',
    }
  }

  return {
    messages: recentMessages,
  }
}

function buildSystemPrompt(productContext) {
  return `
你是一位有经验的跨境电商手机支架选品分析师。回答要围绕利润率、销量、评分、竞争指数、物流成本、推荐评分、风险因素和新手卖家策略展开，尽量具体、清晰、可执行。
你可以使用 Markdown 排版；默认优先使用“结论 + 2-4 条要点 + 建议”的短段落和列表格式，只有在确实适合横向对比时才使用表格。

以下是当前平台中的商品数据，请你只能基于这些商品数据进行分析，不要编造不存在的商品。
如果商品数据不足以回答，请明确说明“当前商品数据不足以判断”，不要凭空补充。
回答时要优先给出推荐理由，例如利润率、销量、评分、竞争指数、物流成本、推荐评分等。

以下是当前用户候选池中的商品，请优先基于候选池商品回答与“我的候选池”“我收藏的商品”“刚才收藏的产品”相关的问题。
如果用户问的是全平台推荐，则可以结合平台商品上下文回答。
不要编造候选池中不存在的商品。
如果用户问候选池但候选池为空，请明确说明“当前候选池为空”。

${productContext.platformContextText}

${productContext.favoriteContextText}

除非用户要求详细分析，否则回答控制在 150 字以内。
`.trim()
}

function getPromptContentLength(systemPrompt, messages) {
  return messages.reduce((sum, message) => sum + message.content.length, systemPrompt.length)
}

function getTrimmedPromptMessage(message) {
  if (
    message.role === 'assistant' &&
    message.content.length > MAX_PROMPT_ASSISTANT_CONTENT_LENGTH
  ) {
    return {
      ...message,
      content: `${message.content.slice(0, MAX_PROMPT_ASSISTANT_CONTENT_LENGTH)}...`,
    }
  }

  return message
}

function fitMessagesToPromptBudget(systemPrompt, messages) {
  const maxPromptLength = AI_SERVICE_LIMITS.maxPromptContentLength
  const fittedMessages = messages.map((message) => getTrimmedPromptMessage(message))
  let latestUserMessageIndex = fittedMessages
    .map((message) => message.role)
    .lastIndexOf('user')

  while (
    getPromptContentLength(systemPrompt, fittedMessages) > maxPromptLength &&
    fittedMessages.length > 1
  ) {
    const removableMessageIndex = fittedMessages.findIndex((_, index) => {
      return index !== latestUserMessageIndex
    })

    if (removableMessageIndex === -1) {
      break
    }

    fittedMessages.splice(removableMessageIndex, 1)

    if (removableMessageIndex < latestUserMessageIndex) {
      latestUserMessageIndex -= 1
    }
  }

  const totalPromptLength = getPromptContentLength(systemPrompt, fittedMessages)

  if (totalPromptLength <= maxPromptLength || latestUserMessageIndex === -1) {
    return fittedMessages
  }

  const nonLatestUserLength = fittedMessages.reduce((sum, message, index) => {
    return index === latestUserMessageIndex ? sum : sum + message.content.length
  }, systemPrompt.length)
  const remainingUserContentLength = Math.max(0, maxPromptLength - nonLatestUserLength)
  const latestUserMessage = fittedMessages[latestUserMessageIndex]

  if (latestUserMessage.content.length <= remainingUserContentLength) {
    return fittedMessages
  }

  fittedMessages[latestUserMessageIndex] = {
    ...latestUserMessage,
    content:
      remainingUserContentLength > 3
        ? `${latestUserMessage.content.slice(0, remainingUserContentLength - 3)}...`
        : latestUserMessage.content.slice(0, remainingUserContentLength),
  }

  return fittedMessages
}

function acquireAiRequest(clientKey) {
  if (activeAiClientRequests.has(clientKey)) {
    return false
  }

  activeAiClientRequests.set(clientKey, Date.now())

  return true
}

function releaseAiRequest(clientKey) {
  activeAiClientRequests.delete(clientKey)
}

function getAiErrorStatusCode(error) {
  if (error.code === 'missing_api_key' || error.code === 'invalid_api_key') {
    return 401
  }

  if (error.code === 'permission_denied') {
    return 403
  }

  if (error.code === 'rate_limited') {
    return 429
  }

  if (error.code === 'request_timeout') {
    return 504
  }

  if (
    error.code === 'all_models_failed' ||
    error.code === 'service_unavailable' ||
    error.statusCode === 503
  ) {
    return 503
  }

  if (
    error.code === 'invalid_provider' ||
    error.code === 'invalid_model_config' ||
    error.code === 'invalid_request' ||
    error.code === 'invalid_message_format' ||
    error.code === 'empty_message' ||
    error.code === 'empty_messages' ||
    error.code === 'message_too_long' ||
    error.code === 'prompt_too_long' ||
    error.statusCode === 400
  ) {
    return 400
  }

  if (error.statusCode >= 500 && error.statusCode <= 504) {
    return error.statusCode
  }

  return 502
}

function getAiErrorMessage(error) {
  if (error.code === 'missing_api_key') {
    return error.provider === 'nvidia'
      ? 'AI 服务未配置 NVIDIA_API_KEY，请先配置后端环境变量。'
      : 'AI 服务未配置 ZHIPU_API_KEY，请先配置后端环境变量。'
  }

  if (error.code === 'invalid_api_key') {
    return 'AI API Key 未配置、无效或无权限，请检查后端环境变量。'
  }

  if (error.code === 'permission_denied') {
    return 'AI API Key 无权限访问当前模型，请检查权限或更换模型。'
  }

  if (error.code === 'rate_limited') {
    return 'AI 模型当前限流，请稍后再试。'
  }

  if (
    error.code === 'request_timeout' ||
    error.code === 'empty_reply' ||
    error.code === 'all_models_failed' ||
    error.code === 'service_unavailable' ||
    error.code === 'request_failed'
  ) {
    return AI_TEMPORARY_FAILURE_MESSAGE
  }

  if (error.code === 'invalid_provider') {
    return 'AI_PROVIDER 配置错误，只支持 nvidia 或 zhipu。'
  }

  if (error.code === 'invalid_model_config') {
    return 'NVIDIA_MODELS 配置错误，请至少配置一个可用文本聊天模型。'
  }

  if (error.code === 'invalid_request') {
    return 'AI 请求参数错误，请检查模型 ID 和请求参数。'
  }

  if (error.statusCode >= 500 && error.statusCode <= 504) {
    return AI_TEMPORARY_FAILURE_MESSAGE
  }

  return error.message || 'AI 选品助手请求失败'
}

router.post('/chat', async (req, res) => {
  const validationResult = validateChatMessages(req.body?.messages)

  if (validationResult.error) {
    return sendAiError(res, 400, validationResult.error)
  }

  const messages = validationResult.messages
  const latestUserMessage = getLatestUserMessage(messages)

  if (isGreetingMessage(latestUserMessage)) {
    return res.json({
      success: true,
      data: {
        reply: GREETING_REPLY,
        provider: 'local',
        model: 'greeting',
      },
    })
  }

  const clientKey = getAiClientKey(req)

  if (!acquireAiRequest(clientKey)) {
    return sendAiError(res, 429, '当前已有 AI 请求处理中，请等待上一次回复完成后再发送。')
  }

  try {
    const productContext = await buildProductContext({
      messages,
      clientId: getClientId(req),
    })
    const systemPrompt = buildSystemPrompt(productContext)
    const promptMessages = fitMessagesToPromptBudget(systemPrompt, messages)
    const result = await generateSelectionAdvice([
      {
        role: 'system',
        content: systemPrompt,
      },
      ...promptMessages,
    ])
    console.info('AI chat completed:', {
      provider: result.provider,
      model: result.model,
      platformContextProductCount: productContext.platformContextProductCount,
      favoriteContextProductCount: productContext.favoriteContextProductCount,
    })

    return res.json({
      success: true,
      data: {
        reply: result.reply,
        provider: result.provider,
        model: result.model,
      },
    })
  } catch (error) {
    if (error instanceof AiProviderServiceError) {
      const statusCode = getAiErrorStatusCode(error)
      console.error('AI service error:', {
        provider: error.provider,
        model: error.model,
        code: error.code,
        statusCode,
        attempts: error.attempts,
      })

      return sendAiError(res, statusCode, getAiErrorMessage(error))
    }

    console.error('AI service error:', {
      code: error?.code || 'unknown_error',
      statusCode: error?.statusCode || 500,
    })

    return sendAiError(res, 502, AI_TEMPORARY_FAILURE_MESSAGE)
  } finally {
    releaseAiRequest(clientKey)
  }
})

router.post('/product-report', async (req, res) => {
  const productId = parsePositiveInteger(req.body?.productId)

  if (productId === null) {
    return sendAiError(res, 400, 'productId 必须是有效的正整数。')
  }

  const clientKey = `${getAiClientKey(req)}:product-report`

  if (!acquireAiRequest(clientKey)) {
    return sendAiError(res, 429, '当前已有 AI 报告生成中，请等待上一次请求完成。')
  }

  try {
    const product = await readProductById(productId)

    if (!product) {
      return sendAiError(res, 404, '商品不存在，无法生成 AI 选品报告。')
    }

    const enrichedProduct = enrichProductMetrics(product)
    const result = await generateSelectionAdvice(buildProductReportMessages(enrichedProduct))
    console.info('AI product report completed:', {
      productId,
      provider: result.provider,
      model: result.model,
    })

    return res.json({
      success: true,
      data: {
        report: result.reply,
        provider: result.provider,
        model: result.model,
      },
    })
  } catch (error) {
    if (error instanceof AiProviderServiceError) {
      const statusCode = getAiErrorStatusCode(error)
      console.error('AI product report service error:', {
        productId,
        provider: error.provider,
        model: error.model,
        code: error.code,
        statusCode,
        attempts: error.attempts,
      })

      return sendAiError(res, statusCode, getAiErrorMessage(error))
    }

    console.error('AI product report error:', {
      productId,
      code: error?.code || 'unknown_error',
      statusCode: error?.statusCode || 500,
    })

    return sendAiError(res, 502, AI_TEMPORARY_FAILURE_MESSAGE)
  } finally {
    releaseAiRequest(clientKey)
  }
})

export default router
