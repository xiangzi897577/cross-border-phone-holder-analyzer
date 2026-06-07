import { safeNumber, toNumberOrNull } from './number'

function filterProductsByKeyword(products, keyword) {
  const normalizedKeyword = String(keyword || '').trim().toLowerCase()

  if (!normalizedKeyword) {
    return products
  }

  return products.filter((product) => {
    const productName = String(product?.productName || '').toLowerCase()
    const category = String(product?.category || '').toLowerCase()
    const tags = Array.isArray(product?.tags) ? product.tags : []

    return (
      productName.includes(normalizedKeyword) ||
      category.includes(normalizedKeyword) ||
      tags.some((tag) => String(tag || '').toLowerCase().includes(normalizedKeyword))
    )
  })
}

function filterProductsByCategory(products, category) {
  const normalizedCategory = String(category || '').trim()

  if (!normalizedCategory) {
    return products
  }

  return products.filter((product) => product?.category === normalizedCategory)
}

function filterProductsByMinProfitRate(products, minProfitRate) {
  const normalizedMinProfitRate = String(minProfitRate || '').trim()

  if (!normalizedMinProfitRate) {
    return products
  }

  const minProfitRateNumber = toNumberOrNull(normalizedMinProfitRate)

  if (minProfitRateNumber === null) {
    return products
  }

  return products.filter((product) => {
    const profitRatePercent = toNumberOrNull(product?.profitRatePercent)
    return profitRatePercent !== null && profitRatePercent >= minProfitRateNumber
  })
}

function sortProducts(products, sort) {
  const sortedProducts = [...products]

  switch (String(sort || '').trim()) {
    case 'profitRateDesc':
      return sortedProducts.sort((a, b) => safeNumber(b?.profitRate, 0) - safeNumber(a?.profitRate, 0))
    case 'monthlySalesDesc':
      return sortedProducts.sort(
        (a, b) => safeNumber(b?.estimatedMonthlySales, 0) - safeNumber(a?.estimatedMonthlySales, 0),
      )
    case 'ratingDesc':
      return sortedProducts.sort((a, b) => safeNumber(b?.rating, 0) - safeNumber(a?.rating, 0))
    case 'competitionScoreAsc':
      return sortedProducts.sort(
        (a, b) => safeNumber(a?.competitionScore, 0) - safeNumber(b?.competitionScore, 0),
      )
    case 'recommendationScoreDesc':
      return sortedProducts.sort(
        (a, b) => safeNumber(b?.recommendationScore, 0) - safeNumber(a?.recommendationScore, 0),
      )
    default:
      return products
  }
}

export function filterAndSortProducts(products, filters = {}) {
  if (!Array.isArray(products)) {
    return []
  }

  const keywordFilteredProducts = filterProductsByKeyword(products, filters.keyword)
  const categoryFilteredProducts = filterProductsByCategory(
    keywordFilteredProducts,
    filters.category,
  )
  const profitFilteredProducts = filterProductsByMinProfitRate(
    categoryFilteredProducts,
    filters.minProfitRate,
  )

  return sortProducts(profitFilteredProducts, filters.sort)
}
