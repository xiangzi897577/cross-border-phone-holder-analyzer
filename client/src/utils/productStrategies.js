import { safeNumber } from './number'
import { getProfitRatePercent, getRiskFactors } from './product'

export const PRODUCT_STRATEGIES = [
  {
    id: 'highProfitLowCompetition',
    name: '高利润低竞争',
    description: '优先筛选利润率较高、竞争指数较低的商品，适合寻找更有利润空间的机会款。',
    match(product) {
      return getProfitRatePercent(product) >= 55 && safeNumber(product?.competitionScore, 100) <= 45
    },
  },
  {
    id: 'beginnerFriendly',
    name: '新手卖家推荐',
    description: '筛选利润率中等以上、竞争不高、评分较好且风险因素较少的稳妥候选款。',
    match(product) {
      return (
        getProfitRatePercent(product) >= 35 &&
        safeNumber(product?.competitionScore, 100) <= 60 &&
        safeNumber(product?.rating, 0) >= 4.3 &&
        getRiskFactors(product).length <= 1
      )
    },
  },
  {
    id: 'lowRiskStable',
    name: '低风险稳定款',
    description: '关注评分较高、销量稳定、风险因素较少的商品，适合保守跟进和稳定测试。',
    match(product) {
      return (
        safeNumber(product?.rating, 0) >= 4.4 &&
        safeNumber(product?.estimatedMonthlySales, 0) >= 250 &&
        getRiskFactors(product).length <= 1
      )
    },
  },
  {
    id: 'lightLogistics',
    name: '轻小件物流友好',
    description: '筛选重量轻、体积小或中等、物流成本较低的商品，降低跨境履约压力。',
    match(product) {
      const volumeLevel = String(product?.volumeLevel || '').toLowerCase()

      return (
        safeNumber(product?.weight, 1) <= 0.35 &&
        safeNumber(product?.shippingCost, 99) <= 8 &&
        (volumeLevel === 'small' || volumeLevel === 'medium')
      )
    },
  },
  {
    id: 'highSalesPotential',
    name: '高销量潜力款',
    description: '优先筛选月销量、评分和推荐分都较高的商品，适合寻找市场需求更明确的候选款。',
    match(product) {
      return (
        safeNumber(product?.estimatedMonthlySales, 0) >= 500 &&
        safeNumber(product?.rating, 0) >= 4.3 &&
        safeNumber(product?.recommendationScore, 0) >= 70
      )
    },
  },
]

export function getProductStrategy(strategyId) {
  return PRODUCT_STRATEGIES.find((strategy) => strategy.id === strategyId) || null
}

export function filterProductsByStrategy(products, strategyId) {
  const strategy = getProductStrategy(strategyId)

  if (!strategy || !Array.isArray(products)) {
    return Array.isArray(products) ? products : []
  }

  return products.filter((product) => strategy.match(product))
}
