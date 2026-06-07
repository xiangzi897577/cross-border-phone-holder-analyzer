import {
  formatNumber,
  formatPercent,
  formatRating,
  formatScore,
  formatText,
} from './format'
import { safeNumber } from './number'
import {
  getProductCategory,
  getProductName,
  getProfitRatePercent,
  getRiskFactors,
} from './product'

function getProfitConclusion(profitRatePercent) {
  if (profitRatePercent >= 60) {
    return '利润空间较充足，可以优先进入候选跟进。'
  }

  if (profitRatePercent >= 35) {
    return '利润表现处于可观察区间，适合结合竞争和风险继续评估。'
  }

  return '利润空间偏紧，需要谨慎测算广告、退货和物流波动。'
}

function getDemandConclusion(monthlySales, rating) {
  if (monthlySales >= 500 && rating >= 4.3) {
    return '月销量和评分表现较好，说明当前商品具备较明确的市场需求。'
  }

  if (monthlySales >= 250) {
    return '销量具备一定基础，但仍需结合评论数和类目竞争继续验证。'
  }

  return '销量表现偏保守，建议先小批量验证市场反馈。'
}

function getCompetitionConclusion(competitionScore, recommendationScore, riskFactors) {
  if (competitionScore <= 45 && recommendationScore >= 70 && riskFactors.length <= 1) {
    return '竞争压力相对可控，推荐分较高，适合作为重点候选款。'
  }

  if (competitionScore <= 65) {
    return '竞争强度中等，需要通过差异化图片、标题和定价提高转化。'
  }

  return '竞争压力较高，不建议直接重仓投入。'
}

function getSellerType(product, riskFactors) {
  const profitRatePercent = getProfitRatePercent(product)
  const competitionScore = safeNumber(product?.competitionScore, 100)

  if (profitRatePercent >= 45 && competitionScore <= 60 && riskFactors.length <= 1) {
    return '适合新手卖家或轻量化测款卖家。'
  }

  if (riskFactors.length >= 3 || competitionScore >= 70) {
    return '更适合有运营经验、能控制广告和供应链风险的卖家。'
  }

  return '适合有一定选品经验、希望扩充候选池的卖家。'
}

function getListingAdvice(product, riskFactors) {
  const profitRatePercent = getProfitRatePercent(product)
  const recommendationScore = safeNumber(product?.recommendationScore, 0)
  const competitionScore = safeNumber(product?.competitionScore, 100)

  if (profitRatePercent >= 45 && recommendationScore >= 70 && competitionScore <= 60 && riskFactors.length <= 1) {
    return '建议进入候选池并做小批量上架测试。'
  }

  if (profitRatePercent >= 30 && recommendationScore >= 55 && riskFactors.length <= 2) {
    return '可以保留观察，建议先优化成本、物流或差异化卖点后再测试。'
  }

  return '暂不建议优先上架，应先排查利润、竞争或风险问题。'
}

export function buildBasicProductReport(product) {
  const riskFactors = getRiskFactors(product)
  const productName = getProductName(product)
  const category = getProductCategory(product)
  const profitRatePercent = getProfitRatePercent(product)
  const monthlySales = safeNumber(product?.estimatedMonthlySales, 0)
  const rating = safeNumber(product?.rating, 0)
  const competitionScore = safeNumber(product?.competitionScore, 100)
  const recommendationScore = safeNumber(product?.recommendationScore, 0)
  const riskText = riskFactors.length > 0 ? riskFactors.join('、') : '暂无明显风险因素'

  return `
## 基础规则选品报告

### 综合结论
${getListingAdvice(product, riskFactors)}

### 核心数据

| 指标 | 当前表现 |
| --- | --- |
| 商品名称 | ${productName} |
| 类目 | ${category} |
| 利润率 | ${formatPercent(profitRatePercent)} |
| 预估月销量 | ${formatNumber(monthlySales)} |
| 评分 | ${formatRating(rating)} |
| 评论数 | ${formatNumber(product?.reviewCount)} |
| 竞争度 | ${formatScore(competitionScore)} |
| 推荐分 | ${formatScore(recommendationScore)} |

### 利润表现分析
${getProfitConclusion(profitRatePercent)}

### 市场需求分析
${getDemandConclusion(monthlySales, rating)}

### 竞争风险分析
${getCompetitionConclusion(competitionScore, recommendationScore, riskFactors)}

### 风险因素总结
${riskText}

### 适合卖家类型
${getSellerType(product, riskFactors)}

### 下一步操作建议
- 复核 1688 采购价、起批量和供货稳定性。
- 对比同类商品主图、卖点和评价痛点。
- 小批量测试前，优先确认物流成本和退货风险。

> 当前报告基于平台商品数据和规则计算生成，不依赖大模型。
`.trim()
}

export function getReportSourceLabel(source) {
  if (source === 'ai') {
    return 'AI 深度报告'
  }

  return '基础规则报告'
}

export function getSafeRecommendationText(product) {
  return formatText(product?.recommendationReason, '暂无明确推荐说明')
}
