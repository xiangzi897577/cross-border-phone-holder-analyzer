import { useEffect, useMemo, useRef, useState } from 'react'
import EmptyState from '../components/common/EmptyState.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import ProductFilters from '../components/ProductFilters.jsx'
import ProductStrategyFilter from '../components/ProductStrategyFilter.jsx'
import { getCachedProducts, getProducts } from '../services/api'
import { filterAndSortProducts } from '../utils/productListFilters'
import { filterProductsByStrategy, getProductStrategy } from '../utils/productStrategies'

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
  const cachedProducts = useMemo(() => getCachedProducts(), [])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [products, setProducts] = useState(cachedProducts)
  const [loading, setLoading] = useState(cachedProducts.length === 0)
  const [error, setError] = useState('')
  const [activeStrategyId, setActiveStrategyId] = useState('')
  const latestRequestId = useRef(0)

  async function fetchProducts(options = {}, hasExistingProducts = products.length > 0) {
    const requestId = latestRequestId.current + 1
    latestRequestId.current = requestId

    setLoading(true)
    setError('')

    try {
      const productsData = await getProducts(DEFAULT_FILTERS, options)
      if (requestId === latestRequestId.current) {
        setProducts(productsData)
      }
    } catch (requestError) {
      if (requestError.name !== 'AbortError' && requestId === latestRequestId.current) {
        if (!hasExistingProducts) {
          setError(requestError.message || '获取商品列表失败')
        }
      }
    } finally {
      if (!options.signal?.aborted && requestId === latestRequestId.current) {
        setLoading(false)
      }
    }
  }

  function handleApplyFilters(nextFilters) {
    setFilters(nextFilters)

    if (!products.length && !loading) {
      fetchProducts()
    }
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS)
    setActiveStrategyId('')
  }

  function handleStrategyChange(nextStrategyId) {
    setActiveStrategyId((currentStrategyId) =>
      currentStrategyId === nextStrategyId ? '' : nextStrategyId,
    )
  }

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchInitialProducts() {
      const hasExistingProducts = cachedProducts.length > 0
      const requestId = latestRequestId.current + 1
      latestRequestId.current = requestId

      setLoading(true)
      setError('')

      try {
        const productsData = await getProducts(DEFAULT_FILTERS, {
          signal: abortController.signal,
        })
        if (requestId === latestRequestId.current) {
          setProducts(productsData)
        }
      } catch (requestError) {
        if (requestError.name !== 'AbortError' && requestId === latestRequestId.current) {
          if (!hasExistingProducts) {
            setError(requestError.message || '获取商品列表失败')
          }
        }
      } finally {
        if (!abortController.signal.aborted && requestId === latestRequestId.current) {
          setLoading(false)
        }
      }
    }

    fetchInitialProducts()

    return () => {
      abortController.abort()
    }
  }, [cachedProducts.length])

  const hasActiveFilters = Boolean(
    filters.keyword || filters.category || filters.minProfitRate || filters.sort,
  )
  const currentSortLabel = SORT_LABELS[filters.sort] || '默认排序'
  const activeStrategy = getProductStrategy(activeStrategyId)
  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  )
  const displayProducts = useMemo(
    () => filterProductsByStrategy(filteredProducts, activeStrategyId),
    [filteredProducts, activeStrategyId],
  )
  const hasProducts = products.length > 0

  return (
    <section className="page products-page">
      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <ProductStrategyFilter
        activeStrategyId={activeStrategyId}
        onStrategyChange={handleStrategyChange}
        onClear={() => setActiveStrategyId('')}
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
        <p className="page-note page-note--info">当前展示完整商品池，可通过上方条件进一步筛选。</p>
      )}

      {activeStrategy ? (
        <p className="page-note page-note--info">
          当前策略：<strong>{activeStrategy.name}</strong>，{activeStrategy.description}
          策略筛选基于当前商品列表结果继续过滤。
        </p>
      ) : null}

      {loading && !hasProducts ? <LoadingState>商品列表加载中...</LoadingState> : null}

      {loading && hasProducts ? (
        <p className="page-note page-note--info">正在同步最新商品数据，当前列表可继续浏览。</p>
      ) : null}

      {!loading && error ? <ErrorState>{error}</ErrorState> : null}

      {!loading && !error && displayProducts.length === 0 ? (
        <EmptyState>
          {activeStrategy
            ? '当前策略下没有找到符合条件的商品，请清除策略或调整关键词、类目、利润率等筛选条件。'
            : '没有找到符合条件的商品，请尝试更换关键词、类目、利润率或排序条件。'}
        </EmptyState>
      ) : null}

      {!error && displayProducts.length > 0 ? (
        <ProductGrid products={displayProducts} />
      ) : null}
    </section>
  )
}

export default ProductsPage
