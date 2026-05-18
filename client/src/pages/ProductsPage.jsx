import { useEffect, useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import ProfitFilter from '../components/ProfitFilter.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import SearchInput from '../components/SearchInput.jsx'
import { getProducts } from '../services/api'

const PRODUCT_CATEGORIES = [
  '桌面支架',
  '车载支架',
  '折叠支架',
  '磁吸支架',
  '懒人支架',
  '直播支架',
]

function ProductsPage() {
  const [keyword, setKeyword] = useState('')
  const [searchedKeyword, setSearchedKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [minProfitRate, setMinProfitRate] = useState('')
  const [searchRequestId, setSearchRequestId] = useState(0)
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
        const productsData = await getProducts(
          {
            keyword: searchedKeyword,
            category,
            minProfitRate,
          },
          {
            signal: abortController.signal,
          },
        )
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
  }, [searchedKeyword, category, minProfitRate, searchRequestId])

  function handleSearch() {
    setSearchedKeyword(keyword.trim())
    setSearchRequestId((currentRequestId) => currentRequestId + 1)
  }

  function handleClearKeyword() {
    setKeyword('')
    setSearchedKeyword('')
    setSearchRequestId((currentRequestId) => currentRequestId + 1)
  }

  function handleCategoryChange(nextCategory) {
    setSearchedKeyword(keyword.trim())
    setCategory(nextCategory)
  }

  function handleMinProfitRateChange(nextMinProfitRate) {
    setSearchedKeyword(keyword.trim())
    setMinProfitRate(nextMinProfitRate)
  }

  function handleResetFilters() {
    setKeyword('')
    setSearchedKeyword('')
    setCategory('')
    setMinProfitRate('')
    setSearchRequestId((currentRequestId) => currentRequestId + 1)
  }

  const hasActiveFilters = Boolean(searchedKeyword || category || minProfitRate)

  return (
    <section className="page">
      <h2 className="page-title">商品列表</h2>
      <p className="page-description">
        当前页面会把关键词、类目和利润率条件传给 Node 后端的 <code>/api/products</code> 接口，
        由后端完成组合筛选后再返回结果。
      </p>

      <div className="product-toolbar">
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          onClear={handleClearKeyword}
          placeholder="请输入商品名、类型或标签，例如：车载、磁吸、折叠、直播"
        />

        <CategoryFilter
          value={category}
          onChange={handleCategoryChange}
          categories={PRODUCT_CATEGORIES}
        />

        <ProfitFilter value={minProfitRate} onChange={handleMinProfitRateChange} />

        <button className="product-toolbar__reset-button" type="button" onClick={handleResetFilters}>
          重置筛选
        </button>
      </div>

      {hasActiveFilters ? (
        <p className="page-note page-note--info">
          当前筛选：
          {searchedKeyword ? (
            <>
              关键词 <strong>{searchedKeyword}</strong>
            </>
          ) : (
            '未设置关键词'
          )}
          ，类目 <strong>{category || '全部类目'}</strong>
          ，利润率 <strong>{minProfitRate ? `大于 ${minProfitRate}%` : '全部'}</strong>
        </p>
      ) : (
        <p className="page-note page-note--info">当前显示全部商品。</p>
      )}

      {loading ? <p className="page-note page-note--loading">商品列表加载中...</p> : null}

      {!loading && error ? <p className="page-note page-note--error">请求失败：{error}</p> : null}

      {!loading && !error && products.length === 0 ? (
        <p className="page-note page-note--empty">
          没有找到符合条件的商品，请尝试更换关键词、类目或利润率条件。
        </p>
      ) : null}

      {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
    </section>
  )
}

export default ProductsPage
