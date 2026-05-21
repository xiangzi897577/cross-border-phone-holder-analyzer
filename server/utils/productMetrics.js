import { BUSINESS_CONFIG } from '../config/businessConfig.js'

function getValidNumber(value) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

function roundTo(value, digits) {
  return Number(value.toFixed(digits))
}

function calculateRevenueCNY(product) {
  const amazonPrice = getValidNumber(product?.amazonPrice) ?? 0//安全取值
  return roundTo(amazonPrice * BUSINESS_CONFIG.usdToCny, 2)
}

function calculateTotalCost(product) {
  const cost1688 = getValidNumber(product?.cost1688) ?? 0
  const shippingCost = getValidNumber(product?.shippingCost) ?? 0
  const platformFee = calculatePlatformFee(product)

  return roundTo(cost1688 + shippingCost + platformFee, 2)
}

export function calculatePlatformFee(product) {
  const amazonPrice = getValidNumber(product?.amazonPrice) ?? 0
  const platformFeeRate =
    getValidNumber(product?.platformFeeRate) ?? BUSINESS_CONFIG.defaultPlatformFeeRate

  return roundTo(amazonPrice * BUSINESS_CONFIG.usdToCny * platformFeeRate, 2)
}

export function calculateProfit(product) {
  // 单件利润 = 单件收入 - 单件总成本
  const revenueCNY = calculateRevenueCNY(product)
  const totalCost = calculateTotalCost(product)

  return roundTo(revenueCNY - totalCost, 2)
}

export function calculateProfitRate(product) {
  const totalCost = calculateTotalCost(product)

  if (totalCost <= 0) {
    return 0
  }

  const profit = calculateProfit(product)
  return roundTo(profit / totalCost, 4)
}

export function getCompetitionLevel(product) {
  const competitionScore = getValidNumber(product?.competitionScore)

  if (competitionScore === null || competitionScore < 0 || competitionScore > 100) {
    return 'unknown'
  }

  if (competitionScore <= 39) {
    return 'low'
  }

  if (competitionScore <= 69) {
    return 'medium'
  }

  return 'high'
}

export function getRiskLevel(product) {
  const profitRate = calculateProfitRate(product)
  const competitionScore = getValidNumber(product?.competitionScore)
  const rating = getValidNumber(product?.rating)
  const reviewCount = getValidNumber(product?.reviewCount)
  const shippingCost = getValidNumber(product?.shippingCost)
  const cost1688 = getValidNumber(product?.cost1688)
  const volumeLevel = product?.volumeLevel

  // 风险判断先看 high，再看 medium，避免高风险商品被提前归到中风险。
  if (
    profitRate < 0.15 ||
    (competitionScore !== null && competitionScore >= 80) ||
    (rating !== null && rating < 4.2) ||
    (shippingCost !== null && cost1688 !== null && shippingCost > cost1688) ||
    volumeLevel === 'large'
  ) {
    return 'high'
  }

  if (
    profitRate < 0.3 ||
    (competitionScore !== null && competitionScore >= 60) ||
    (rating !== null && rating < 4.5) ||
    (reviewCount !== null && reviewCount < 100)
  ) {
    return 'medium'
  }

  return 'low'
}

export function calculateRecommendationScore(product) {
  const profitRatePercent = calculateProfitRate(product) * 100
  const estimatedMonthlySales = getValidNumber(product?.estimatedMonthlySales) ?? 0
  const rating = getValidNumber(product?.rating) ?? 0
  const competitionScore = getValidNumber(product?.competitionScore) ?? 100

  const profitScore = (Math.min(profitRatePercent, 80) / 80) * 35
  const salesScore = (Math.min(estimatedMonthlySales, 1000) / 1000) * 25
  const ratingScore = (Math.min(Math.max(rating, 0), 5) / 5) * 20
  const lowCompetitionScore = ((100 - Math.min(Math.max(competitionScore, 0), 100)) / 100) * 20

  return roundTo(profitScore + salesScore + ratingScore + lowCompetitionScore, 1)
}

export function enrichProductMetrics(product) {
  const baseProduct = product && typeof product === 'object' ? product : {}
  const revenueCNY = calculateRevenueCNY(baseProduct)
  const platformFee = calculatePlatformFee(baseProduct)
  const totalCost = calculateTotalCost(baseProduct)
  const profit = calculateProfit(baseProduct)
  const profitRate = calculateProfitRate(baseProduct)

  return {
    ...baseProduct,
    revenueCNY,
    platformFee,
    totalCost,
    profit,
    profitRate,
    profitRatePercent: roundTo(profitRate * 100, 1),
    competitionLevel: getCompetitionLevel(baseProduct),
    riskLevel: getRiskLevel(baseProduct),
    recommendationScore: calculateRecommendationScore(baseProduct),
  }
}
