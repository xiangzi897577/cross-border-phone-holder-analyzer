import {
  generateSelectionAdvice as generateNvidiaSelectionAdvice,
  NVIDIA_SERVICE_LIMITS,
  NvidiaServiceError,
} from './nvidiaService.js'
import {
  generateSelectionAdvice as generateZhipuSelectionAdvice,
  ZHIPU_SERVICE_LIMITS,
  ZhipuServiceError,
} from './zhipuService.js'

const DEFAULT_AI_PROVIDER = 'nvidia'
const SUPPORTED_AI_PROVIDERS = new Set(['nvidia', 'zhipu'])

export class AiProviderServiceError extends Error {
  constructor(
    message,
    {
      code = 'ai_provider_service_error',
      statusCode = 500,
      provider = '',
      model = '',
      attempts = [],
      cause,
    } = {},
  ) {
    super(message, { cause })
    this.name = 'AiProviderServiceError'
    this.code = code
    this.statusCode = statusCode
    this.provider = provider
    this.model = model
    this.attempts = attempts
  }
}

function getConfiguredProvider() {
  const provider = String(process.env.AI_PROVIDER || DEFAULT_AI_PROVIDER)
    .trim()
    .toLowerCase()

  if (!SUPPORTED_AI_PROVIDERS.has(provider)) {
    throw new AiProviderServiceError('AI_PROVIDER only supports nvidia or zhipu.', {
      code: 'invalid_provider',
      statusCode: 400,
      provider,
    })
  }

  return provider
}

function wrapProviderError(error, provider) {
  if (error instanceof AiProviderServiceError) {
    return error
  }

  if (error instanceof NvidiaServiceError || error instanceof ZhipuServiceError) {
    return new AiProviderServiceError(error.message, {
      code: error.code,
      statusCode: error.statusCode,
      provider,
      model: error.model,
      attempts: error.attempts,
      cause: error,
    })
  }

  return new AiProviderServiceError('AI service request failed.', {
    code: 'request_failed',
    statusCode: 502,
    provider,
    cause: error,
  })
}

export async function generateSelectionAdvice(message) {
  const provider = getConfiguredProvider()

  try {
    const result =
      provider === 'nvidia'
        ? await generateNvidiaSelectionAdvice(message)
        : await generateZhipuSelectionAdvice(message)

    return {
      ...result,
      provider,
    }
  } catch (error) {
    throw wrapProviderError(error, provider)
  }
}

export const AI_SERVICE_LIMITS = {
  maxUserMessageLength: Math.min(
    ZHIPU_SERVICE_LIMITS.maxUserMessageLength,
    NVIDIA_SERVICE_LIMITS.maxUserMessageLength,
  ),
  maxPromptContentLength: Math.min(
    ZHIPU_SERVICE_LIMITS.maxPromptContentLength,
    NVIDIA_SERVICE_LIMITS.maxPromptContentLength,
  ),
}
