import express from 'express'
import {
  generateSelectionAdvice,
  ZHIPU_SERVICE_LIMITS,
  ZhipuServiceError,
} from '../services/zhipuService.js'

const router = express.Router()
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

  if (message.length > ZHIPU_SERVICE_LIMITS.maxUserMessageLength) {
    return sendAiError(
      res,
      400,
      `message 不能超过 ${ZHIPU_SERVICE_LIMITS.maxUserMessageLength} 个字符。`,
    )
  }

  try {
    const result = await generateSelectionAdvice(message)

    return res.json({
      success: true,
      data: {
        reply: result.reply,
      },
    })
  } catch (error) {
    if (error instanceof ZhipuServiceError && error.code === 'missing_api_key') {
      return sendAiError(res, 503, 'AI 服务未配置 ZHIPU_API_KEY，请先配置后端环境变量。')
    }

    if (error instanceof ZhipuServiceError && error.code === 'invalid_api_key') {
      return sendAiError(res, 503, 'AI 服务鉴权失败，请检查 ZHIPU_API_KEY 是否正确。')
    }

    if (error instanceof ZhipuServiceError && error.code === 'rate_limited') {
      return sendAiError(res, 429, 'AI 请求太频繁，请稍后再试。')
    }

    if (error instanceof ZhipuServiceError && error.code === 'request_timeout') {
      return sendAiError(res, 504, 'AI 服务响应超时，请稍后再试。')
    }

    if (error instanceof ZhipuServiceError && error.statusCode === 400) {
      return sendAiError(res, 400, error.message)
    }

    console.error('AI service error:', {
      code: error?.code || 'unknown_error',
      statusCode: error?.statusCode || 500,
    })

    return sendAiError(res, 502, 'AI 服务暂时不可用，请稍后再试。')
  }
})

export default router
