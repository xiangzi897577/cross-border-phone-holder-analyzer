import { getValidNumber } from './number.js'

export function filterProductsByKeyword(products, keyword) {
  const normalizedKeyword = String(keyword || '').trim().toLowerCase()

  if (!normalizedKeyword) {
    return products
  }

  return products.filter((product) => {
    const productName = String(product.productName || '').toLowerCase()
    const category = String(product.category || '').toLowerCase()
    const tags = Array.isArray(product.tags) ? product.tags : []

    return (
      productName.includes(normalizedKeyword) ||
      category.includes(normalizedKeyword) ||
      tags.some((tag) => String(tag).toLowerCase().includes(normalizedKeyword))
    )
  })
}

export function filterProductsByCategory(products, category) {
  const normalizedCategory = String(category || '').trim()

  if (!normalizedCategory) {
    return products
  }

  return products.filter((product) => product.category === normalizedCategory)
}

export function filterProductsByMinProfitRate(products, minProfitRate) {
  const normalizedMinProfitRate = String(minProfitRate || '').trim()

  if (!normalizedMinProfitRate) {
    return products
  }

  const minProfitRateNumber = getValidNumber(normalizedMinProfitRate)

  if (minProfitRateNumber === null) {
    return products
  }

  return products.filter((product) => {
    const profitRatePercent = getValidNumber(product?.profitRatePercent)
    return profitRatePercent !== null && profitRatePercent >= minProfitRateNumber
  })
}

export function filterProducts(products, filters = {}) {
  const keywordFilteredProducts = filterProductsByKeyword(products, filters.keyword)
  const categoryFilteredProducts = filterProductsByCategory(
    keywordFilteredProducts,
    filters.category,
  )

  return filterProductsByMinProfitRate(categoryFilteredProducts, filters.minProfitRate)
}
