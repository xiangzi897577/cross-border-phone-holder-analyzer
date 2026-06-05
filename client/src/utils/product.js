import { formatText } from './format'
import { toNumberOrNull, roundTo } from './number'

export const DEFAULT_PRODUCT_IMAGE = '/images/products/placeholder.png'

const RISK_LEVEL_LABELS = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
  unknown: '风险未知',
}

const SHORT_RISK_LEVEL_LABELS = {
  low: '低',
  medium: '中',
  high: '高',
  unknown: '未知',
}

export function getProductName(product, emptyText = '暂无') {
  return formatText(product?.productName, emptyText)
}

export function getProductCategory(product, emptyText = '暂无') {
  return formatText(product?.category, emptyText)
}

export function getRiskLevelText(riskLevel, options = {}) {
  const { short = false, emptyText, unknownText } = options
  const labels = short ? SHORT_RISK_LEVEL_LABELS : RISK_LEVEL_LABELS
  const fallbackText = emptyText ?? (short ? '未知' : '风险未知')

  if (typeof riskLevel !== 'string' || riskLevel.trim() === '') {
    return fallbackText
  }

  if (riskLevel === 'unknown' && unknownText) {
    return unknownText
  }

  return labels[riskLevel] || riskLevel
}

export function getProductTags(product) {
  return Array.isArray(product?.tags) ? product.tags.filter(Boolean) : []
}

export function getRiskFactors(product) {
  return Array.isArray(product?.riskFactors) ? product.riskFactors.filter(Boolean) : []
}

export function getProductImage(product, imageLoadError = false) {
  if (imageLoadError) {
    return DEFAULT_PRODUCT_IMAGE
  }

  return formatText(product?.image, DEFAULT_PRODUCT_IMAGE)
}

export function getProfitRatePercent(product) {
  const directProfitRatePercent = toNumberOrNull(product?.profitRatePercent)

  if (directProfitRatePercent !== null) {
    return directProfitRatePercent
  }

  const profitRate = toNumberOrNull(product?.profitRate)

  if (profitRate !== null) {
    return roundTo(profitRate * 100, 1)
  }

  return null
}
