import express from 'express'
import {
  AiProviderServiceError,
  AI_SERVICE_LIMITS,
  generateSelectionAdvice,
} from '../services/aiProviderService.js'

const router = express.Router()
const activeAiClientRequests = new Map()
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

function getTrimmedMessage(req) {
  const message = req.body?.message

  return typeof message === 'string' ? message.trim() : ''
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
  const clientId = req.get('x-client-id')?.trim()

  if (clientId) {
    return `client:${clientId}`
  }

  const forwardedFor = req.get('x-forwarded-for')?.split(',')[0]?.trim()

  if (forwardedFor) {
    return `ip:${forwardedFor}`
  }

  return `ip:${req.ip || req.socket?.remoteAddress || 'anonymous'}`
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

  if (error.code === 'request_timeout') {
    return 'AI 响应超时，请稍后再试。'
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

  if (error.code === 'all_models_failed') {
    return '所有备用 NVIDIA 模型暂时不可用，请稍后再试。'
  }

  if (error.statusCode >= 500 && error.statusCode <= 504) {
    return 'AI 服务暂时异常，请稍后再试。'
  }

  return error.message || 'AI 选品助手请求失败'
}

router.post('/chat', async (req, res) => {
  const message = getTrimmedMessage(req)

  if (!message) {
    return sendAiError(res, 400, 'message 必须是非空字符串。')
  }

  if (isGreetingMessage(message)) {
    return res.json({
      success: true,
      data: {
        reply: GREETING_REPLY,
      },
    })
  }

  if (message.length > AI_SERVICE_LIMITS.maxUserMessageLength) {
    return sendAiError(
      res,
      400,
      `message 不能超过 ${AI_SERVICE_LIMITS.maxUserMessageLength} 个字符。`,
    )
  }

  const clientKey = getAiClientKey(req)

  if (!acquireAiRequest(clientKey)) {
    return sendAiError(res, 429, '当前已有 AI 请求处理中，请等待上一次回复完成后再发送。')
  }

  try {
    const result = await generateSelectionAdvice(message)
    console.info('AI chat completed:', {
      provider: result.provider,
      model: result.model,
    })

    return res.json({
      success: true,
      data: {
        reply: result.reply,
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

    return sendAiError(res, 502, 'AI 服务暂时不可用，请稍后再试。')
  } finally {
    releaseAiRequest(clientKey)
  }
})

export default router
