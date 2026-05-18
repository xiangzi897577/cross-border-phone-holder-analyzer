function CategoryFilter({ value, onChange, categories }) {
  return (
    <label className="category-filter">
      <span className="category-filter__label">商品类目</span>
      <select
        className="category-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">全部类目</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CategoryFilter
