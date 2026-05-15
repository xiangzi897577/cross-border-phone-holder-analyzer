const API_BASE_URL = 'http://localhost:3000'
const BACKEND_CONNECTION_ERROR = '无法连接到后端服务，请确认 http://localhost:3000 已启动'

function getRequestErrorMessage(status, errorMessages) {
  if (errorMessages && typeof errorMessages[status] === 'string') {
    return errorMessages[status]
  }

  if (errorMessages && typeof errorMessages.default === 'string') {
    return errorMessages.default
  }

  return '请求失败'
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
    response = await fetch(`${API_BASE_URL}${path}`, options)
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error(BACKEND_CONNECTION_ERROR, { cause: error })
  }

  const data = await readResponseData(response)

  if (!response.ok) {
    throw new Error(getRequestErrorMessage(response.status, errorMessages))
  }

  return data
}

export async function getProducts(options = {}) {
  const products = await requestJson('/api/products', { default: '获取商品列表失败' }, options)

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
