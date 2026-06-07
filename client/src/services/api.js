const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_BASE_URL = normalizeBaseUrl(RAW_API_BASE_URL)
const BACKEND_CONNECTION_ERROR = `无法连接到后端服务，请确认 ${API_BASE_URL} 已启动或配置正确`
const CLIENT_ID_STORAGE_KEY = 'phone_holder_analyzer_client_id'
const MAX_AI_REQUEST_MESSAGES = 6
const MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH = 700
const AI_CHAT_REQUEST_TIMEOUT_MS = 45000
const AI_PRODUCT_REPORT_REQUEST_TIMEOUT_MS = 60000
const AI_TEMPORARY_ERROR_MESSAGE = 'AI 服务暂时不可用，请稍后再试'

let memoryClientId = ''

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/+$/, '')
}

function buildApiUrl(path) {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`

  if (!API_BASE_URL) {
    return normalizedPath
  }

  return `${API_BASE_URL}${normalizedPath}`
}

function createClientId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function getClientId() {
  if (typeof window === 'undefined' || !window.localStorage) {
    if (!memoryClientId) {
      memoryClientId = createClientId()
    }

    return memoryClientId
  }

  const storedClientId = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY)

  if (storedClientId) {
    return storedClientId
  }

  const nextClientId = createClientId()
  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, nextClientId)

  return nextClientId
}

function createHeaders(options = {}, extraHeaders = {}) {
  const headers = new Headers(options.headers || {})

  Object.entries(extraHeaders).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      headers.set(key, value)
    }
  })

  return headers
}

function withClientIdHeader(options = {}) {
  const headers = createHeaders(options)
  headers.set('x-client-id', getClientId())

  return {
    ...options,
    headers,
  }
}

function getRequestErrorMessage(status, errorMessages, data) {
  if (errorMessages && typeof errorMessages[status] === 'string') {
    return errorMessages[status]
  }

  if (data && typeof data === 'object' && typeof data.message === 'string') {
    return data.message
  }

  if (errorMessages && typeof errorMessages.default === 'string') {
    return errorMessages.default
  }

  return '请求失败'
}

function isErrorResponseData(data) {
  return Boolean(
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    (data.success === false || data.status === 'error'),
  )
}

async function readResponseData(response) {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch (error) {
      throw new Error('接口返回的 JSON 数据格式不正确', { cause: error })
    }
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function requestJson(path, errorMessages, options = {}) {
  let response

  try {
    response = await fetch(buildApiUrl(path), options)
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error(BACKEND_CONNECTION_ERROR, { cause: error })
  }

  const data = await readResponseData(response)

  if (!response.ok) {
    throw new Error(getRequestErrorMessage(response.status, errorMessages, data))
  }

  if (isErrorResponseData(data)) {
    throw new Error(getRequestErrorMessage(response.status, errorMessages, data))
  }

  return data
}

export async function getProducts(filters = {}, options = {}) {
  const params = new URLSearchParams()
  const { keyword = '', category = '', minProfitRate = '', sort = '' } = filters || {}
  const normalizedKeyword = String(keyword || '').trim()
  const normalizedCategory = String(category || '').trim()
  const normalizedMinProfitRate = String(minProfitRate || '').trim()
  const normalizedSort = String(sort || '').trim()

  if (normalizedKeyword) {
    params.set('keyword', normalizedKeyword)
  }

  if (normalizedCategory) {
    params.set('category', normalizedCategory)
  }

  if (normalizedMinProfitRate) {
    params.set('minProfitRate', normalizedMinProfitRate)
  }

  if (normalizedSort) {
    params.set('sort', normalizedSort)
  }

  const queryString = params.toString()
  const path = queryString ? `/api/products?${queryString}` : '/api/products'
  const products = await requestJson(path, { default: '获取商品列表失败' }, options)

  if (!Array.isArray(products)) {
    throw new Error('商品列表数据格式不正确')
  }

  return products
}

export async function getProductById(id, options = {}) {
  const product = await requestJson(
    `/api/products/${id}`,
    {
      400: '商品 id 不合法',
      404: '商品不存在',
      default: '获取商品详情失败',
    },
    options,
  )

  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    throw new Error('商品详情数据格式不正确')
  }

  return product
}

export async function getDashboard(options = {}) {
  const dashboard = await requestJson(
    '/api/dashboard',
    { default: '获取 Dashboard 数据失败' },
    options,
  )

  if (!dashboard || typeof dashboard !== 'object' || Array.isArray(dashboard)) {
    throw new Error('Dashboard 数据格式不正确')
  }

  return dashboard
}

function normalizeAiMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('请输入要咨询的问题')
  }

  return messages.slice(-MAX_AI_REQUEST_MESSAGES).map((message) => {
    const role = message?.role
    let content = typeof message?.content === 'string' ? message.content.trim() : ''

    if (role !== 'user' && role !== 'assistant') {
      throw new Error('AI 消息角色格式不正确')
    }

    if (!content) {
      throw new Error('请输入要咨询的问题')
    }

    if (role === 'assistant' && content.length > MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH) {
      content = `${content.slice(0, MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH)}...`
    }

    return {
      role,
      content,
    }
  })
}

export async function chatWithAi(messages, options = {}) {
  const normalizedMessages = normalizeAiMessages(messages)
  const controller =
    !options.signal && typeof AbortController !== 'undefined' ? new AbortController() : null
  const timeout = controller
    ? setTimeout(() => controller.abort(), AI_CHAT_REQUEST_TIMEOUT_MS)
    : null

  if (!normalizedMessages.some((message) => message.role === 'user')) {
    throw new Error('请输入要咨询的问题')
  }

  let chatResult

  try {
    chatResult = await requestJson(
      '/api/ai/chat',
      {
        default: AI_TEMPORARY_ERROR_MESSAGE,
      },
      {
        ...options,
        method: 'POST',
        signal: options.signal || controller?.signal,
        headers: createHeaders(withClientIdHeader(options), {
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ messages: normalizedMessages }),
      },
    )
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(AI_TEMPORARY_ERROR_MESSAGE, { cause: error })
    }

    throw error
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  if (typeof chatResult === 'string') {
    return {
      reply: chatResult,
    }
  }

  if (typeof chatResult?.data?.reply === 'string') {
    return {
      reply: chatResult.data.reply,
      provider: chatResult.data.provider,
      model: chatResult.data.model,
    }
  }

  if (typeof chatResult?.reply === 'string') {
    return {
      reply: chatResult.reply,
      provider: chatResult.provider,
      model: chatResult.model,
    }
  }

  if (typeof chatResult?.data === 'string') {
    return {
      reply: chatResult.data,
    }
  }

  throw new Error('AI 回复数据格式不正确')
}

export async function generateAiProductReport(productId, options = {}) {
  const normalizedProductId = Number(productId)

  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
    throw new Error('商品 id 不合法，无法生成 AI 报告')
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  let removeAbortListener = null

  if (options.signal && controller) {
    if (options.signal.aborted) {
      controller.abort()
    } else {
      const handleAbort = () => controller.abort()
      options.signal.addEventListener('abort', handleAbort, { once: true })
      removeAbortListener = () => options.signal.removeEventListener('abort', handleAbort)
    }
  }

  const timeout = controller
    ? setTimeout(() => controller.abort(), AI_PRODUCT_REPORT_REQUEST_TIMEOUT_MS)
    : null

  try {
    const reportResult = await requestJson(
      '/api/ai/product-report',
      {
        400: '商品 id 不合法，无法生成 AI 报告',
        404: '商品不存在，无法生成 AI 报告',
        default: 'AI 深度报告暂时不可用',
      },
      {
        ...options,
        method: 'POST',
        signal: controller?.signal || options.signal,
        headers: createHeaders(withClientIdHeader(options), {
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ productId: normalizedProductId }),
      },
    )

    const report =
      typeof reportResult?.data?.report === 'string'
        ? reportResult.data.report
        : typeof reportResult?.report === 'string'
          ? reportResult.report
          : ''

    if (!report.trim()) {
      throw new Error('AI 深度报告返回数据格式不正确')
    }

    return {
      report,
      provider: reportResult?.data?.provider || reportResult?.provider,
      model: reportResult?.data?.model || reportResult?.model,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      if (options.signal?.aborted) {
        throw error
      }

      throw new Error('AI 深度报告暂时不可用', { cause: error })
    }

    throw error
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (removeAbortListener) {
      removeAbortListener()
    }
  }
}

export async function addFavorite(productId, options = {}) {
  const favoriteResult = await requestJson(
    '/api/favorites',
    {
      400: '商品 id 不合法，无法加入候选池',
      404: '商品不存在，无法加入候选池',
      409: '该商品已在候选池中。',
      default: '添加候选商品失败',
    },
    {
      ...options,
      method: 'POST',
      headers: createHeaders(withClientIdHeader(options), {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ productId }),
    },
  )

  if (!favoriteResult || typeof favoriteResult !== 'object' || Array.isArray(favoriteResult)) {
    throw new Error('添加候选商品返回数据格式不正确')
  }

  return favoriteResult
}

export async function getFavorites(options = {}) {
  const favorites = await requestJson(
    '/api/favorites',
    { default: '获取候选池商品失败' },
    withClientIdHeader(options),
  )

  if (!Array.isArray(favorites)) {
    throw new Error('候选池商品数据格式不正确')
  }

  return favorites
}

export async function removeFavorite(productId, options = {}) {
  const removeResult = await requestJson(
    `/api/favorites/${productId}`,
    {
      400: '商品 id 不合法，无法取消收藏',
      404: '该商品不在候选池中，无法取消收藏',
      default: '取消收藏失败',
    },
    {
      ...withClientIdHeader(options),
      method: 'DELETE',
    },
  )

  if (!removeResult || typeof removeResult !== 'object' || Array.isArray(removeResult)) {
    throw new Error('取消收藏返回数据格式不正确')
  }

  return removeResult
}
