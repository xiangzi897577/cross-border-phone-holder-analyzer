function SortSelect({ value, onChange }) {
  return (
    <label className="sort-select">
      <span className="sort-select__label">商品排序</span>
      <select
        className="sort-select__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">默认排序</option>
        <option value="profitRateDesc">利润率从高到低</option>
        <option value="monthlySalesDesc">月销量从高到低</option>
        <option value="ratingDesc">评分从高到低</option>
        <option value="competitionScoreAsc">竞争指数从低到高</option>
        <option value="recommendationScoreDesc">推荐评分从高到低</option>
      </select>
    </label>
  )
}

export default SortSelect
