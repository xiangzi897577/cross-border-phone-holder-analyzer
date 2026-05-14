import { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'
import { getProducts } from '../services/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError('')

      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (requestError) {
        setError(requestError.message || '获取商品列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="page">
      <h2 className="page-title">商品列表</h2>
      <p className="page-description">
        当前页面继续直接请求 Node 后端的 <code>/api/products</code> 接口，不使用前端 mock
        数据，并把商品列表升级为卡片网格展示。
      </p>

      {loading ? <p className="page-note">商品列表加载中...</p> : null}

      {!loading && error ? <p className="page-note">请求失败：{error}</p> : null}

      {!loading && !error && products.length === 0 ? (
        <p className="page-note">暂无商品数据。</p>
      ) : null}

      {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
    </section>
  )
}

export default ProductsPage
