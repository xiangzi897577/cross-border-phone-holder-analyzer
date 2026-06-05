import { getValidNumber } from './number.js'

function getProductSortValue(product, field, fallback = 0) {
  return getValidNumber(product?.[field]) ?? fallback
}

export function sortProducts(products, sort) {
  const normalizedSort = String(sort || '').trim()

  if (!normalizedSort) {
    return products
  }

  const sortedProducts = [...products]

  switch (normalizedSort) {
    case 'profitRateDesc':
      return sortedProducts.sort((a, b) => {
        return getProductSortValue(b, 'profitRate') - getProductSortValue(a, 'profitRate')
      })
    case 'monthlySalesDesc':
      return sortedProducts.sort((a, b) => {
        return (
          getProductSortValue(b, 'estimatedMonthlySales') -
          getProductSortValue(a, 'estimatedMonthlySales')
        )
      })
    case 'ratingDesc':
      return sortedProducts.sort((a, b) => {
        return getProductSortValue(b, 'rating') - getProductSortValue(a, 'rating')
      })
    case 'competitionScoreAsc':
      return sortedProducts.sort((a, b) => {
        return (
          getProductSortValue(a, 'competitionScore') -
          getProductSortValue(b, 'competitionScore')
        )
      })
    case 'recommendationScoreDesc':
      return sortedProducts.sort((a, b) => {
        return (
          getProductSortValue(b, 'recommendationScore') -
          getProductSortValue(a, 'recommendationScore')
        )
      })
    default:
      return products
  }
}
