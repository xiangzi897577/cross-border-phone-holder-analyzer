import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatPercent, formatText } from '../utils/format'
import { getProfitRatePercent } from '../utils/product'

function getShortProductName(productName) {
  const name = formatText(productName, '未命名商品')

  if (name.length <= 10) {
    return name
  }

  return `${name.slice(0, 10)}...`
}

function getChartData(products) {
  if (!Array.isArray(products)) {
    return []
  }

  return products
    .map((product) => {
      const profitRatePercent = getProfitRatePercent(product)

      if (profitRatePercent === null) {
        return null
      }

      return {
        id: product.id,
        productName: formatText(product.productName, '未命名商品'),
        displayName: getShortProductName(product.productName),
        profitRatePercent,
        profit: product.profit,
      }
    })
    .filter(Boolean)
    .sort((firstProduct, secondProduct) => {
      return secondProduct.profitRatePercent - firstProduct.profitRatePercent
    })
    .slice(0, 5)
}

function ProfitRankingChart({ products, topProfitProducts }) {
  const chartProducts = topProfitProducts || products
  const chartData = getChartData(chartProducts)

  return (
    <section className="profit-ranking-chart">
      <div className="profit-ranking-chart__header">
        <h3 className="profit-ranking-chart__title">利润率排行</h3>
        <p className="profit-ranking-chart__description">
          对比当前商品池中利润率最高的候选款，辅助判断优先跟进顺序。
        </p>
      </div>

      {chartData.length === 0 ? (
        <p className="profit-ranking-chart__empty">暂无利润率排行数据。</p>
      ) : (
        <div className="profit-ranking-chart__chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fill: '#475569', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                width={150}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [formatPercent(value), '利润率']}
                labelFormatter={(_, payload) => {
                  return payload?.[0]?.payload?.productName || '商品'
                }}
              />
              <Bar
                dataKey="profitRatePercent"
                name="利润率"
                fill="#14b8a6"
                radius={[0, 8, 8, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default ProfitRankingChart
