const DEFAULT_NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const DEFAULT_NVIDIA_MODELS = [
  'deepseek-ai/deepseek-v4-flash',
  'nvidia/nemotron-3-ultra-550b-a55b',
  'nvidia/nemotron-3-super-120b-a12b',
  'meta/llama-3.3-70b-instruct',
  'openai/gpt-oss-120b',
  'qwen/qwen3-coder-480b-a35b-instruct',
  'mistralai/mistral-medium-3.5-128b',
  'microsoft/phi-4-mini-instruct',
]
const NVIDIA_MODEL_REPLACEMENTS = new Map([
  ['deepseek-ai/deepseek-v4-pro', 'nvidia/nemotron-3-ultra-550b-a55b'],
  ['mistralai/mixtral-8x22b-instruct', 'mistralai/mistral-medium-3.5-128b'],
  ['mistralai/mixtral-8x22b-instruct-v0.1', 'mistralai/mistral-medium-3.5-128b'],
  ['microsoft/phi-4', 'microsoft/phi-4-mini-instruct'],
])
const DEFAULT_NVIDIA_REQUEST_TIMEOUT_MS = 25000
const NVIDIA_MODEL_COOLDOWN_MS = 60000
const MAX_USER_MESSAGE_LENGTH = 1000
const MAX_PROMPT_MESSAGES = 12
const MAX_PROMPT_CONTENT_LENGTH = 8000
const MAX_REPLY_TOKENS = 1024
const FALLBACK_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])

const SYSTEM_PROMPT = `
你是一位有经验的跨境电商选品分析师。你的回答要围绕跨境电商选品、利润率、销量、评分、竞争度、物流成本、重量体积、风险因素和新手卖家策略展开。回答要具体、清晰、可执行。不要编造具体商品数据；如果没有商品数据，请说明需要结合平台商品数据进一步判断。除非用户要求详细分析，否则回答控制在 150 字以内。
`.trim()

const ALLOWED_ROLES = new Set(['system', 'user', 'assistant'])
const modelCooldownUntilMap = new Map()
let hasLoggedModelReplacements = false

export class NvidiaServiceError extends Error {
  constructor(
    message,
    {
      code = 'nvidia_service_error',
      statusCode = 500,
      cause,
      model = '',
      attempts = [],
    } = {},
  ) {
    super(message, { cause })
    this.name = 'NvidiaServiceError'
    this.code = code
    this.statusCode = statusCode
    this.model = model
    this.attempts = attempts
  }
}

function getNvidiaApiKey() {
  const apiKey = process.env.NVIDIA_API_KEY?.trim()

  if (!apiKey) {
    throw new NvidiaServiceError(
      'Missing NVIDIA_API_KEY. Please set it in server/.env or deployment environment variables.',
      {
        code: 'missing_api_key',
        statusCode: 401,
      },
    )
  }

  return apiKey
}

function getNvidiaBaseUrl() {
  return String(process.env.NVIDIA_BASE_URL || DEFAULT_NVIDIA_BASE_URL)
    .trim()
    .replace(/\/+$/, '')
}

function getNvidiaModels() {
  const rawModels = String(process.env.NVIDIA_MODELS || DEFAULT_NVIDIA_MODELS.join(','))
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)
  const models = []
  const replacements = []

  rawModels.forEach((rawModel) => {
    const replacementModel = NVIDIA_MODEL_REPLACEMENTS.get(rawModel)
    const model = replacementModel || rawModel

    if (replacementModel) {
      replacements.push(`${rawModel} -> ${replacementModel}`)
    }

    if (!models.includes(model)) {
      models.push(model)
    }
  })

  if (!models.length) {
    throw new NvidiaServiceError('NVIDIA_MODELS must include at least one model id.', {
      code: 'invalid_model_config',
      statusCode: 400,
    })
  }

  if (replacements.length && !hasLoggedModelReplacements) {
    console.warn('[AI][NVIDIA] replaced unavailable or deprecated configured models:', replacements)
    hasLoggedModelReplacements = true
  }

  return models
}

function getNvidiaRequestTimeoutMs() {
  const timeoutMs = Number(process.env.NVIDIA_REQUEST_TIMEOUT_MS)

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return DEFAULT_NVIDIA_REQUEST_TIMEOUT_MS
  }

  return Math.min(Math.max(timeoutMs, 5000), 30000)
}

function normalizeMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new NvidiaServiceError('AI message format is invalid.', {
      code: 'invalid_message_format',
      statusCode: 400,
    })
  }

  const role = ALLOWED_ROLES.has(message.role) ? message.role : 'user'
  const content = typeof message.content === 'string' ? message.content.trim() : ''

  if (!content) {
    throw new NvidiaServiceError('Message content cannot be empty.', {
      code: 'empty_message',
      statusCode: 400,
    })
  }

  if (role === 'user' && content.length > MAX_USER_MESSAGE_LENGTH) {
    throw new NvidiaServiceError(
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
    throw new NvidiaServiceError('Messages must be a non-empty array.', {
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
    throw new NvidiaServiceError(
      `Prompt is too long. Please keep it within ${MAX_PROMPT_CONTENT_LENGTH} characters.`,
      {
        code: 'prompt_too_long',
        statusCode: 400,
      },
    )
  }

  return promptMessages
}

async function readResponseData(response, model) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    if (!response.ok) {
      return {
        error: {
          message: text.slice(0, 300),
        },
      }
    }

    throw new NvidiaServiceError('AI service returned invalid JSON.', {
      code: 'invalid_api_response',
      statusCode: 502,
      model,
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

function getApiErrorMessage(data) {
  if (typeof data?.error?.message === 'string') {
    return data.error.message
  }

  if (typeof data?.message === 'string') {
    return data.message
  }

  return 'NVIDIA API request failed.'
}

function createApiRequestError(response, data, model) {
  const apiErrorMessage = getApiErrorMessage(data)

  if (response.status === 400) {
    return new NvidiaServiceError('AI 请求参数错误，请检查 NVIDIA 模型 ID 和请求参数。', {
      code: 'invalid_request',
      statusCode: 400,
      model,
      cause: new Error(apiErrorMessage),
    })
  }

  if (response.status === 401) {
    return new NvidiaServiceError('AI API Key 未配置、无效或无权限。', {
      code: 'invalid_api_key',
      statusCode: 401,
      model,
      cause: new Error(apiErrorMessage),
    })
  }

  if (response.status === 403) {
    return new NvidiaServiceError('AI API Key 无权限访问当前模型。', {
      code: 'permission_denied',
      statusCode: 403,
      model,
      cause: new Error(apiErrorMessage),
    })
  }

  if (response.status === 429) {
    return new NvidiaServiceError('AI 模型当前限流，请稍后再试。', {
      code: 'rate_limited',
      statusCode: 429,
      model,
      cause: new Error(apiErrorMessage),
    })
  }

  if (response.status === 408) {
    return new NvidiaServiceError('AI 响应超时，请稍后再试。', {
      code: 'request_timeout',
      statusCode: 408,
      model,
      cause: new Error(apiErrorMessage),
    })
  }

  if (response.status >= 500) {
    return new NvidiaServiceError('AI 服务暂时异常，请稍后再试。', {
      code: 'service_unavailable',
      statusCode: response.status,
      model,
      cause: new Error(apiErrorMessage),
    })
  }

  return new NvidiaServiceError('NVIDIA API request failed.', {
    code: 'api_request_failed',
    statusCode: response.status,
    model,
    cause: new Error(apiErrorMessage),
  })
}

function getServiceErrorFromFetch(error, model) {
  if (error?.name === 'AbortError') {
    return new NvidiaServiceError('AI service request timed out.', {
      code: 'request_timeout',
      statusCode: 504,
      model,
      cause: error,
    })
  }

  if (error instanceof NvidiaServiceError) {
    return error
  }

  return new NvidiaServiceError('AI service request failed.', {
    code: 'request_failed',
    statusCode: 502,
    model,
    cause: error,
  })
}

function isModelCoolingDown(model) {
  const cooldownUntil = modelCooldownUntilMap.get(model) || 0

  return cooldownUntil > Date.now()
}

function setModelCooldown(model) {
  const cooldownUntil = Date.now() + NVIDIA_MODEL_COOLDOWN_MS
  modelCooldownUntilMap.set(model, cooldownUntil)
  console.warn('[AI][NVIDIA] model entered cooldown:', {
    model,
    cooldownSeconds: NVIDIA_MODEL_COOLDOWN_MS / 1000,
  })
}

function shouldFallback(error) {
  return error?.code === 'request_timeout' || FALLBACK_STATUS_CODES.has(error?.statusCode)
}

async function requestNvidiaModel({ apiKey, baseUrl, model, messages }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), getNvidiaRequestTimeoutMs())

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: MAX_REPLY_TOKENS,
        stream: false,
      }),
      signal: controller.signal,
    })
    const data = await readResponseData(response, model)

    if (!response.ok) {
      throw createApiRequestError(response, data, model)
    }

    const reply = getReplyContent(data)

    if (!reply) {
      throw new NvidiaServiceError('AI service returned empty content.', {
        code: 'empty_reply',
        statusCode: 502,
        model,
      })
    }

    return {
      reply,
      model,
    }
  } catch (error) {
    throw getServiceErrorFromFetch(error, model)
  } finally {
    clearTimeout(timeout)
  }
}

export async function chatWithNvidia(messages) {
  const apiKey = getNvidiaApiKey()
  const baseUrl = getNvidiaBaseUrl()
  const promptMessages = buildPromptMessages(messages)
  const models = getNvidiaModels()
  const attempts = []

  for (const model of models) {
    if (isModelCoolingDown(model)) {
      console.warn('[AI][NVIDIA] skip model in cooldown:', { model })
      attempts.push({
        model,
        code: 'model_in_cooldown',
        statusCode: 429,
      })
      continue
    }

    console.info('[AI][NVIDIA] trying model:', { model })

    try {
      const result = await requestNvidiaModel({
        apiKey,
        baseUrl,
        model,
        messages: promptMessages,
      })

      console.info('[AI][NVIDIA] final model used:', { model: result.model })

      return {
        reply: result.reply,
        model: result.model,
      }
    } catch (error) {
      const serviceError = getServiceErrorFromFetch(error, model)
      attempts.push({
        model,
        code: serviceError.code,
        statusCode: serviceError.statusCode,
      })

      if (
        serviceError.code !== 'empty_reply' &&
        (serviceError.statusCode === 429 ||
          serviceError.statusCode >= 500 ||
          serviceError.code === 'request_timeout')
      ) {
        setModelCooldown(model)
      }

      console.warn('[AI][NVIDIA] model failed:', {
        model,
        code: serviceError.code,
        statusCode: serviceError.statusCode,
        fallback: shouldFallback(serviceError),
      })

      if (!shouldFallback(serviceError)) {
        console.error('[AI][NVIDIA] fallback stopped because of configuration/request error:', {
          model,
          code: serviceError.code,
          statusCode: serviceError.statusCode,
        })
        throw serviceError
      }
    }
  }

  console.error('[AI][NVIDIA] all models failed:', { attempts })

  throw new NvidiaServiceError('所有备用 NVIDIA 模型暂时不可用，请稍后再试。', {
    code: 'all_models_failed',
    statusCode: 503,
    attempts,
  })
}

export async function generateSelectionAdvice(message) {
  return chatWithNvidia([
    {
      role: 'user',
      content: message,
    },
  ])
}

export const NVIDIA_SERVICE_LIMITS = {
  maxUserMessageLength: MAX_USER_MESSAGE_LENGTH,
  maxPromptContentLength: MAX_PROMPT_CONTENT_LENGTH,
}
