import express from 'express'
import { roundTo } from '../utils/number.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'
import { sortProducts } from '../utils/productSort.js'
import { INVALID_PRODUCTS_FORMAT_MESSAGE, readProducts } from '../utils/productStore.js'
import { sendError, sendSuccess } from '../utils/response.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await readProducts()
    const enrichedProducts = products.map((product) => enrichProductMetrics(product))
    const totalProducts = enrichedProducts.length

    const averageProfitRate =
      totalProducts === 0
        ? 0
        : roundTo(
          enrichedProducts.reduce((sum, product) => sum + product.profitRate, 0) / totalProducts,
          4
        )

    const averageProfitRatePercent = roundTo(averageProfitRate * 100, 1)

    // High-potential products need strong profit rate, manageable competition, and solid rating.
    const highPotentialCount = enrichedProducts.filter((product) => {
      return product.profitRate >= 0.3 && product.competitionScore < 70 && product.rating >= 4.4
    }).length

    const riskProductCount = enrichedProducts.filter((product) => {
      return product.riskLevel === 'high'
    }).length

    const topProfitProducts = sortProducts(enrichedProducts, 'profitRateDesc')
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        productName: product.productName,
        category: product.category,
        profit: product.profit,
        profitRate: product.profitRate,
        profitRatePercent: product.profitRatePercent,
        competitionScore: product.competitionScore,
        riskLevel: product.riskLevel,
        riskFactors: product.riskFactors,
        recommendationScore: product.recommendationScore,
      }))

    // Count each category with reduce first, then convert the summary object into an array.

    //Object.entries把对象转为二维数组，再遍历解构为category和count，最后转为对象数组
    const categoryDistribution = Object.entries(
      enrichedProducts.reduce((distributionMap, product) => {
        const category = product.category || 'Unknown'
        //动态键名，统计每个类别的数量
        distributionMap[category] = (distributionMap[category] || 0) + 1
        return distributionMap

      }, {})
    ).map(([category, count]) => ({
      category,
      count,
    }))

    const averageCompetitionScore =
      totalProducts === 0
        ? 0
        : roundTo(
          enrichedProducts.reduce((sum, product) => sum + product.competitionScore, 0) /
          totalProducts,
          1
        )

    const lowCompetitionHighProfitCount = enrichedProducts.filter((product) => {
      return product.profitRate >= 0.3 && product.competitionScore < 50
    }).length

    return sendSuccess(res, {
      totalProducts,
      averageProfitRate,
      averageProfitRatePercent,
      highPotentialCount,
      riskProductCount,
      topProfitProducts,
      categoryDistribution,
      averageCompetitionScore,
      lowCompetitionHighProfitCount,
    })
  } catch (error) {
    if (error.message === INVALID_PRODUCTS_FORMAT_MESSAGE) {
      return sendError(res, 500, INVALID_PRODUCTS_FORMAT_MESSAGE)
    }

    return sendError(res, 500, 'Failed to read dashboard data.', error)
  }
})

export default router
