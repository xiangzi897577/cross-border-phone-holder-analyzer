import {
  formatMoney,
  formatNumber,
  formatPercent,
  formatRating,
  formatScore,
  formatText,
} from '../utils/format'
import {
  getProductCategory,
  getProductName,
  getRiskFactors,
} from '../utils/product'
import { getSafeRecommendationText } from '../utils/productReport'

function formatRiskFactors(product) {
  const riskFactors = getRiskFactors(product)

  return riskFactors.length > 0 ? riskFactors.join('、') : '暂无明显风险'
}

const COMPARE_ROWS = [
  {
    label: '商品名称',
    getValue: (product) => getProductName(product),
  },
  {
    label: '类目',
    getValue: (product) => getProductCategory(product),
  },
  {
    label: '售价',
    getValue: (product) => formatMoney(product?.amazonPrice, '$'),
  },
  {
    label: '成本',
    getValue: (product) => formatMoney(product?.cost1688, '¥'),
  },
  {
    label: '利润率',
    getValue: (product) => formatPercent(product?.profitRatePercent),
    tone: 'profit',
  },
  {
    label: '月销量',
    getValue: (product) => formatNumber(product?.estimatedMonthlySales),
  },
  {
    label: '评分',
    getValue: (product) => formatRating(product?.rating),
  },
  {
    label: '评论数',
    getValue: (product) => formatNumber(product?.reviewCount),
  },
  {
    label: '竞争度',
    getValue: (product) => formatScore(product?.competitionScore),
    tone: 'competition',
  },
  {
    label: '推荐分',
    getValue: (product) => formatScore(product?.recommendationScore),
    tone: 'score',
  },
  {
    label: '风险因素',
    getValue: formatRiskFactors,
  },
  {
    label: '综合建议',
    getValue: (product) => formatText(getSafeRecommendationText(product)),
  },
]

function CandidateCompareTable({ products }) {
  if (!Array.isArray(products) || products.length < 2) {
    return (
      <p className="candidate-compare__hint">
        请选择至少 2 个候选商品进行对比。
      </p>
    )
  }

  return (
    <div className="candidate-compare__table-wrapper">
      <table className="candidate-compare__table">
        <thead>
          <tr>
            <th scope="col">对比项</th>
            {products.map((product) => (
              <th scope="col" key={product.id ?? product.productName}>
                {getProductName(product)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {products.map((product) => (
                <td
                  className={row.tone ? `candidate-compare__cell--${row.tone}` : undefined}
                  key={`${row.label}-${product.id ?? product.productName}`}
                >
                  {row.getValue(product)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CandidateCompareTable
