function ProfitFilter({ value, onChange }) {
  return (
    <label className="profit-filter">
      <span className="profit-filter__label">利润率筛选</span>
      <select
        className="profit-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">全部</option>
        <option value="20">利润率大于 20%</option>
        <option value="30">利润率大于 30%</option>
        <option value="40">利润率大于 40%</option>
      </select>
    </label>
  )
}

export default ProfitFilter
