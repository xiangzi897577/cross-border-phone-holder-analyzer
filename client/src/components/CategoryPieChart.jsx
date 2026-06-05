import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { toNumberOrNull } from '../utils/number'

const pieColors = ['#14b8a6', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e']

function normalizeCategoryDistribution(categoryDistribution) {
  if (Array.isArray(categoryDistribution)) {
    return categoryDistribution
      .map((item) => {
        const name = item?.name || item?.category
        const value = item?.value ?? item?.count
        const numericValue = toNumberOrNull(value)

        if (!name || numericValue === null || numericValue <= 0) {
          return null
        }

        return {
          name,
          value: numericValue,
        }
      })
      .filter(Boolean)
  }

  if (categoryDistribution && typeof categoryDistribution === 'object') {
    return Object.entries(categoryDistribution)
      .map(([name, value]) => {
        const numericValue = toNumberOrNull(value)

        if (!name || numericValue === null || numericValue <= 0) {
          return null
        }

        return {
          name,
          value: numericValue,
        }
      })
      .filter(Boolean)
  }

  return []
}

function CategoryPieChart({ categoryDistribution }) {
  const chartData = normalizeCategoryDistribution(categoryDistribution)

  return (
    <section className="category-pie-chart">
      <div className="category-pie-chart__header">
        <h3 className="category-pie-chart__title">手机支架类型分布</h3>
        <p className="category-pie-chart__description">
          展示不同手机支架类型在商品池中的占比，帮助观察类目覆盖是否均衡。
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="category-pie-chart__empty">暂无手机支架类型分布数据。</p>
      ) : (
        <div className="category-pie-chart__chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(value, name) => [`${value} 个商品`, name]} />
              <Legend verticalAlign="bottom" height={36} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={46}
                outerRadius={92}
                paddingAngle={3}
              >
                {chartData.map((item, index) => (
                  <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default CategoryPieChart
