const API_BASE_URL = 'http://localhost:3000'

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`)

  if (!response.ok) {
    throw new Error('获取商品列表失败')
  }

  const products = await response.json()

  if (!Array.isArray(products)) {
    throw new Error('商品列表数据格式不正确')
  }

  return products
}
