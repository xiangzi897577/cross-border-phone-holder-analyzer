import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber, formatScore, formatText } from '../utils/format'
import { toNumberOrNull } from '../utils/number'
import { getProductCategory, getProductName, getRiskLevelText } from '../utils/product'

const RISK_COLORS = {
  low: '#16a34a',
  medium: '#f97316',
  high: '#dc2626',
  unknown: '#64748b',
}

function getChartData(products) {
  if (!Array.isArray(products)) {
    return []
  }

  return products
    .map((product) => {
      const competitionScore = toNumberOrNull(product?.competitionScore)
      const recommendationScore = toNumberOrNull(product?.recommendationScore)

      if (competitionScore === null || recommendationScore === null) {
        return null
      }

      const riskLevel = product?.riskLevel || 'unknown'

      return {
        id: product.id,
        productName: getProductName(product, '未命名商品'),
        category: getProductCategory(product, '暂无类目'),
        competitionScore,
        recommendationScore,
        riskLevel,
        riskText: getRiskLevelText(riskLevel),
      }
    })
    .filter(Boolean)
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const product = payload[0].payload

  return (
    <div className="recommendation-competition-chart__tooltip">
      <strong>{formatText(product.productName, '商品')}</strong>
      <span>{product.category}</span>
      <span>推荐分：{formatScore(product.recommendationScore)}</span>
      <span>竞争度：{formatScore(product.competitionScore)}</span>
      <span>风险等级：{product.riskText}</span>
    </div>
  )
}

function RecommendationCompetitionChart({ products }) {
  const chartData = getChartData(products)
  const lowRiskProducts = chartData.filter((product) => product.riskLevel === 'low')
  const mediumRiskProducts = chartData.filter((product) => product.riskLevel === 'medium')
  const highRiskProducts = chartData.filter((product) => product.riskLevel === 'high')
  const unknownRiskProducts = chartData.filter((product) => product.riskLevel === 'unknown')

  return (
    <section className="recommendation-competition-chart">
      <div className="recommendation-competition-chart__header">
        <div>
          <h3 className="recommendation-competition-chart__title">推荐分 vs 竞争度</h3>
          <p className="recommendation-competition-chart__description">
            观察商品在“推荐价值”和“竞争压力”之间的位置，优先关注高推荐、低竞争的机会款。
          </p>
        </div>
        <span className="recommendation-competition-chart__count">
          {formatNumber(chartData.length)} 个商品
        </span>
      </div>

      {chartData.length === 0 ? (
        <p className="recommendation-competition-chart__empty">暂无推荐分与竞争度数据。</p>
      ) : (
        <>
          <div className="recommendation-competition-chart__chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="competitionScore"
                  domain={[0, 100]}
                  name="竞争度"
                  tick={{ fill: '#475569', fontSize: 12 }}
                  type="number"
                />
                <YAxis
                  dataKey="recommendationScore"
                  domain={[0, 100]}
                  name="推荐分"
                  tick={{ fill: '#475569', fontSize: 12 }}
                  type="number"
                />
                <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={lowRiskProducts} fill={RISK_COLORS.low} name="低风险" />
                <Scatter data={mediumRiskProducts} fill={RISK_COLORS.medium} name="中风险" />
                <Scatter data={highRiskProducts} fill={RISK_COLORS.high} name="高风险" />
                <Scatter data={unknownRiskProducts} fill={RISK_COLORS.unknown} name="风险未知" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="recommendation-competition-chart__legend">
            <span><i className="recommendation-competition-chart__dot recommendation-competition-chart__dot--low" />低风险</span>
            <span><i className="recommendation-competition-chart__dot recommendation-competition-chart__dot--medium" />中风险</span>
            <span><i className="recommendation-competition-chart__dot recommendation-competition-chart__dot--high" />高风险</span>
          </div>
        </>
      )}
    </section>
  )
}

export default RecommendationCompetitionChart
