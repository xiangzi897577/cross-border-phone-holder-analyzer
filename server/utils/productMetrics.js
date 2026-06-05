import { BUSINESS_CONFIG } from '../config/businessConfig.js'
import { clamp, getValidNumber, roundTo } from './number.js'

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
  const riskFactors = calculateRiskFactors(product)

  if (riskFactors.length >= 3) {
    return 'high'
  }

  if (riskFactors.length >= 1) {
    return 'medium'
  }

  return 'low'
}

export function calculateRiskFactors(product) {
  const profitRatePercent = calculateProfitRate(product) * 100
  const competitionScore = getValidNumber(product?.competitionScore)
  const rating = getValidNumber(product?.rating)
  const reviewCount = getValidNumber(product?.reviewCount)
  const shippingCost = getValidNumber(product?.shippingCost)
  const weight = getValidNumber(product?.weight)
  const volumeLevel = product?.volumeLevel
  const riskFactors = []

  if (profitRatePercent < 20) {
    riskFactors.push('利润率过低')
  }

  if (competitionScore !== null && competitionScore >= 70) {
    riskFactors.push('竞争指数过高')
  }

  if (rating !== null && rating < 4.2) {
    riskFactors.push('评分过低')
  }

  if (reviewCount !== null && reviewCount < 50) {
    riskFactors.push('评论数过少')
  }

  if (shippingCost !== null && shippingCost > 10) {
    riskFactors.push('物流成本偏高')
  }

  if ((weight !== null && weight >= 0.5) || volumeLevel === 'large') {
    riskFactors.push('重量/体积不适合轻小件')
  }

  return riskFactors
}

export function calculateRecommendationScore(product) {
  const profitRatePercent = calculateProfitRate(product) * 100
  const estimatedMonthlySales = getValidNumber(product?.estimatedMonthlySales) ?? 0
  const rating = getValidNumber(product?.rating) ?? 0
  const competitionScore = getValidNumber(product?.competitionScore) ?? 100
  const shippingCost = getValidNumber(product?.shippingCost) ?? 15
  const weight = getValidNumber(product?.weight) ?? 1
  const volumeLevel = product?.volumeLevel

  const profitScore = (clamp(profitRatePercent, 0, 250) / 250) * 30
  const salesScore = (clamp(estimatedMonthlySales, 0, 1000) / 1000) * 20
  const ratingScore = (clamp(rating, 0, 5) / 5) * 20
  const lowCompetitionScore = ((100 - clamp(competitionScore, 0, 100)) / 100) * 15
  const lowShippingCostScore = ((15 - clamp(shippingCost, 0, 15)) / 15) * 10
  const lightWeightScore = ((1 - clamp(weight, 0, 1)) / 1) * 3
  const smallVolumeScore =
    volumeLevel === 'small' ? 2 : volumeLevel === 'medium' ? 1 : 0

  const totalScore =
    profitScore +
    salesScore +
    ratingScore +
    lowCompetitionScore +
    lowShippingCostScore +
    lightWeightScore +
    smallVolumeScore

  return Math.round(clamp(totalScore, 0, 100))
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
    riskFactors: calculateRiskFactors(baseProduct),
    recommendationScore: calculateRecommendationScore(baseProduct),
  }
}
