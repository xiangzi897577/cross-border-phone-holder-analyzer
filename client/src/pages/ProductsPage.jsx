import { useEffect, useRef, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'
import ProductFilters from '../components/ProductFilters.jsx'
import { getProducts } from '../services/api'

const DEFAULT_FILTERS = {
  keyword: '',
  category: '',
  minProfitRate: '',
  sort: '',
}

const SORT_LABELS = {
  profitRateDesc: '利润率从高到低',
  monthlySalesDesc: '月销量从高到低',
  ratingDesc: '评分从高到低',
  competitionScoreAsc: '竞争指数从低到高',
  recommendationScoreDesc: '推荐评分从高到低',
}

function ProductsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const latestRequestId = useRef(0)

  async function loadProducts(nextFilters, options = {}) {
    const requestId = latestRequestId.current + 1
    latestRequestId.current = requestId

    setLoading(true)
    setError('')
    setProducts([])

    try {
      const productsData = await getProducts(nextFilters, options)
      if (requestId === latestRequestId.current) {
        setProducts(productsData)
      }
    } catch (requestError) {
      if (requestError.name !== 'AbortError' && requestId === latestRequestId.current) {
        setError(requestError.message || '获取商品列表失败')
      }
    } finally {
      if (!options.signal?.aborted && requestId === latestRequestId.current) {
        setLoading(false)
      }
    }
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS)
    loadProducts(DEFAULT_FILTERS)
  }

  useEffect(() => {
    const abortController = new AbortController()

    // async function fetchInitialProducts() {
    //   const requestId = latestRequestId.current + 1
    //   latestRequestId.current = requestId

    //   setLoading(true)
    //   setError('')
    //   setProducts([])

    //   try {
    //     const productsData = await getProducts(DEFAULT_FILTERS, {
    //       signal: abortController.signal,
    //     })
    //     if (requestId === latestRequestId.current) {
    //       setProducts(productsData)
    //     }
    //   } catch (requestError) {
    //     if (requestError.name !== 'AbortError' && requestId === latestRequestId.current) {
    //       setError(requestError.message || '获取商品列表失败')
    //     }
    //   } finally {
    //     if (!abortController.signal.aborted && requestId === latestRequestId.current) {
    //       setLoading(false)
    //     }
    //   }
    // }
    // fetchInitialProducts()

    loadProducts(DEFAULT_FILTERS, {
      signal: abortController.signal,
    })
    return () => {
      abortController.abort()
    }
  }, [])

  const hasActiveFilters = Boolean(
    filters.keyword || filters.category || filters.minProfitRate || filters.sort,
  )
  const currentSortLabel = SORT_LABELS[filters.sort] || '默认排序'

  return (
    <section className="page">
      <h2 className="page-title">商品列表</h2>
      <p className="page-description">
        当前页面会把关键词、类目、利润率和排序条件传给 Node 后端的 <code>/api/products</code>{' '}
        接口，由后端完成组合筛选和排序后再返回结果。
      </p>

      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={loadProducts}
        onReset={handleResetFilters}
      />

      {hasActiveFilters ? (
        <p className="page-note page-note--info">
          当前筛选：
          {filters.keyword ? (
            <>
              关键词 <strong>{filters.keyword}</strong>
            </>
          ) : (
            '未设置关键词'
          )}
          ，类目 <strong>{filters.category || '全部类目'}</strong>
          ，利润率 <strong>{filters.minProfitRate ? `大于 ${filters.minProfitRate}%` : '全部'}</strong>
          ，排序 <strong>{currentSortLabel}</strong>
        </p>
      ) : (
        <p className="page-note page-note--info">当前显示全部商品。</p>
      )}

      {loading ? <p className="page-note page-note--loading">商品列表加载中...</p> : null}

      {!loading && error ? <p className="page-note page-note--error">请求失败：{error}</p> : null}

      {!loading && !error && products.length === 0 ? (
        <p className="page-note page-note--empty">
          没有找到符合条件的商品，请尝试更换关键词、类目、利润率或排序条件。
        </p>
      ) : null}

      {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
    </section>
  )
}

export default ProductsPage
