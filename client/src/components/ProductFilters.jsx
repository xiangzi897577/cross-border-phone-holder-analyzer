import CategoryFilter from './CategoryFilter.jsx'
import ProfitFilter from './ProfitFilter.jsx'
import SearchInput from './SearchInput.jsx'
import SortSelect from './SortSelect.jsx'

const PRODUCT_CATEGORIES = [
  '桌面支架',
  '车载支架',
  '折叠支架',
  '磁吸支架',
  '懒人支架',
  '直播支架',
]

function ProductFilters({ filters, onFiltersChange, onSearch, onReset }) {
  const { keyword = '', category = '', minProfitRate = '', sort = '' } = filters

  function handleKeywordChange(nextKeyword) {
    const nextFilters = {
      ...filters,
      keyword: nextKeyword,
    }

    onFiltersChange(nextFilters)
  }

  function handleSearch() {
    const nextFilters = {
      ...filters,
      keyword: keyword.trim(),
    }

    onFiltersChange(nextFilters)
    onSearch(nextFilters)
  }

  function handleClearKeyword() {
    const nextFilters = {
      ...filters,
      keyword: '',
    }

    onFiltersChange(nextFilters)
    onSearch(nextFilters)
  }

  function handleCategoryChange(nextCategory) {
    const nextFilters = {
      ...filters,
      keyword: keyword.trim(),
      category: nextCategory,
    }

    onFiltersChange(nextFilters)
    onSearch(nextFilters)
  }

  function handleMinProfitRateChange(nextMinProfitRate) {
    const nextFilters = {
      ...filters,
      keyword: keyword.trim(),
      minProfitRate: nextMinProfitRate,
    }

    onFiltersChange(nextFilters)
    onSearch(nextFilters)
  }

  function handleSortChange(nextSort) {
    const nextFilters = {
      ...filters,
      keyword: keyword.trim(),
      sort: nextSort,
    }

    onFiltersChange(nextFilters)
    onSearch(nextFilters)
  }

  return (
    <div className="product-filters">
      <SearchInput
        value={keyword}
        onChange={handleKeywordChange}
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

      <SortSelect value={sort} onChange={handleSortChange} />

      <button className="product-filters__reset-button" type="button" onClick={onReset}>
        清空筛选
      </button>
    </div>
  )
}

export default ProductFilters
