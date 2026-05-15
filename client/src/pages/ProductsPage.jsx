import { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'
import { getProducts } from '../services/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchProducts() {
      setLoading(true)
      setError('')
      setProducts([])

      try {
        const productsData = await getProducts({ signal: abortController.signal })
        setProducts(productsData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || '获取商品列表失败')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <section className="page">
      <h2 className="page-title">商品列表</h2>
      <p className="page-description">
        当前页面直接请求 Node 后端的 <code>/api/products</code>{' '}
        接口，不使用前端 mock 数据，并以卡片形式展示商品基础信息。
      </p>

      {loading ? <p className="page-note page-note--loading">商品列表加载中...</p> : null}

      {!loading && error ? <p className="page-note page-note--error">请求失败：{error}</p> : null}

      {!loading && !error && products.length === 0 ? (
        <p className="page-note page-note--empty">暂无商品数据。</p>
      ) : null}

      {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
    </section>
  )
}

export default ProductsPage
