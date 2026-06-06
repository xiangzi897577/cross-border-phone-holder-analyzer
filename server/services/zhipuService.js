const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || 'glm-4.7-flash'
const ZHIPU_REQUEST_TIMEOUT_MS = 30000
const MAX_USER_MESSAGE_LENGTH = 1000
const MAX_PROMPT_MESSAGES = 12
const MAX_PROMPT_CONTENT_LENGTH = 8000
const MAX_REPLY_TOKENS = 1024

const SYSTEM_PROMPT = `
你是一位有经验的跨境电商选品分析师。你的回答要围绕跨境电商选品、利润率、销量、评分、竞争度、物流成本、重量体积、风险因素和新手卖家策略展开。回答要具体、清晰、可执行。不要编造具体商品数据；如果没有商品数据，请说明需要结合平台商品数据进一步判断。除非用户要求详细分析，否则回答控制在 150 字以内。
`.trim()

const ALLOWED_ROLES = new Set(['system', 'user', 'assistant'])

export class ZhipuServiceError extends Error {
  constructor(message, { code = 'zhipu_service_error', statusCode = 500, cause } = {}) {
    super(message, { cause })
    this.name = 'ZhipuServiceError'
    this.code = code
    this.statusCode = statusCode
  }
}

function getZhipuApiKey() {
  const apiKey = process.env.ZHIPU_API_KEY?.trim()

  if (!apiKey) {
    throw new ZhipuServiceError(
      'Missing ZHIPU_API_KEY. Please set it in server/.env or Vercel environment variables.',
      {
        code: 'missing_api_key',
        statusCode: 503,
      },
    )
  }

  return apiKey
}

function normalizeMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new ZhipuServiceError('AI message format is invalid.', {
      code: 'invalid_message_format',
      statusCode: 400,
    })
  }

  const role = ALLOWED_ROLES.has(message.role) ? message.role : 'user'
  const content = typeof message.content === 'string' ? message.content.trim() : ''

  if (!content) {
    throw new ZhipuServiceError('Message content cannot be empty.', {
      code: 'empty_message',
      statusCode: 400,
    })
  }

  if (role === 'user' && content.length > MAX_USER_MESSAGE_LENGTH) {
    throw new ZhipuServiceError(
      `Message is too long. Please keep it within ${MAX_USER_MESSAGE_LENGTH} characters.`,
      {
        code: 'message_too_long',
        statusCode: 400,
      },
    )
  }

  return {
    role,
    content,
  }
}

function buildPromptMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ZhipuServiceError('Messages must be a non-empty array.', {
      code: 'empty_messages',
      statusCode: 400,
    })
  }

  const normalizedMessages = messages
    .slice(-MAX_PROMPT_MESSAGES)
    .map((message) => normalizeMessage(message))
  const hasSystemMessage = normalizedMessages.some((message) => message.role === 'system')
  const promptMessages = hasSystemMessage
    ? normalizedMessages
    : [{ role: 'system', content: SYSTEM_PROMPT }, ...normalizedMessages]

  const totalPromptLength = promptMessages.reduce((sum, message) => {
    return sum + message.content.length
  }, 0)

  if (totalPromptLength > MAX_PROMPT_CONTENT_LENGTH) {
    throw new ZhipuServiceError(
      `Prompt is too long. Please keep it within ${MAX_PROMPT_CONTENT_LENGTH} characters.`,
      {
        code: 'prompt_too_long',
        statusCode: 400,
      },
    )
  }

  return promptMessages
}

async function readJsonSafely(response) {
  try {
    return await response.json()
  } catch (error) {
    throw new ZhipuServiceError('AI service returned invalid JSON.', {
      code: 'invalid_api_response',
      statusCode: 502,
      cause: error,
    })
  }
}

function getReplyContent(data) {
  const content = data?.choices?.[0]?.message?.content

  if (typeof content === 'string') {
    return content.trim()
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part
        }

        return typeof part?.text === 'string' ? part.text : ''
      })
      .join('')
      .trim()
  }

  return ''
}

function getApiErrorCode(data) {
  const errorCode = data?.error?.code || data?.code

  return typeof errorCode === 'string' ? errorCode : ''
}

function createApiRequestError(response, data) {
  const apiErrorCode = getApiErrorCode(data)
  const apiErrorMessage =
    typeof data?.error?.message === 'string' ? data.error.message : 'AI service request failed.'

  if (response.status === 429 || apiErrorCode === '1302') {
    return new ZhipuServiceError('AI 请求太频繁，请稍后再试。', {
      code: 'rate_limited',
      statusCode: 429,
      cause: new Error(apiErrorMessage),
    })
  }

  if (response.status === 401 || response.status === 403) {
    return new ZhipuServiceError('AI 服务鉴权失败，请检查 ZHIPU_API_KEY 是否正确。', {
      code: 'invalid_api_key',
      statusCode: 503,
      cause: new Error(apiErrorMessage),
    })
  }

  return new ZhipuServiceError('AI service request failed.', {
    code: 'api_request_failed',
    statusCode: 502,
    cause: new Error(`Zhipu API responded with HTTP ${response.status}: ${apiErrorCode}`),
  })
}

function getServiceErrorFromFetch(error) {
  if (error?.name === 'AbortError') {
    return new ZhipuServiceError('AI service request timed out.', {
      code: 'request_timeout',
      statusCode: 504,
      cause: error,
    })
  }

  if (error instanceof ZhipuServiceError) {
    return error
  }

  return new ZhipuServiceError('AI service request failed.', {
    code: 'request_failed',
    statusCode: 502,
    cause: error,
  })
}

export async function chatWithZhipu(messages) {
  const apiKey = getZhipuApiKey()
  const promptMessages = buildPromptMessages(messages)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ZHIPU_REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ZHIPU_MODEL,
        messages: promptMessages,
        thinking: {
          type: 'disabled',
        },
        temperature: 0.7,
        max_tokens: MAX_REPLY_TOKENS,
      }),
      signal: controller.signal,
    })

    const data = await readJsonSafely(response)

    if (!response.ok) {
      throw createApiRequestError(response, data)
    }

    const reply = getReplyContent(data)

    if (!reply) {
      throw new ZhipuServiceError('AI service returned empty content.', {
        code: 'empty_reply',
        statusCode: 502,
      })
    }

    return {
      reply,
      model: ZHIPU_MODEL,
    }
  } catch (error) {
    throw getServiceErrorFromFetch(error)
  } finally {
    clearTimeout(timeout)
  }
}

export async function generateSelectionAdvice(message) {
  return chatWithZhipu([
    {
      role: 'user',
      content: message,
    },
  ])
}

export const ZHIPU_SERVICE_LIMITS = {
  maxUserMessageLength: MAX_USER_MESSAGE_LENGTH,
  maxPromptContentLength: MAX_PROMPT_CONTENT_LENGTH,
}
