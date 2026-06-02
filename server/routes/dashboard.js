import express from 'express'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { enrichProductMetrics } from '../utils/productMetrics.js'

const router = express.Router()

const INVALID_PRODUCTS_FORMAT_MESSAGE =
  'Products data format is invalid. Expected an array.'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')

function roundTo(value, digits) {
  return Number(value.toFixed(digits))
}

async function readProducts() {
  const fileContent = await readFile(productsFilePath, 'utf-8')
  const products = JSON.parse(fileContent)

  if (!Array.isArray(products)) {
    throw new Error(INVALID_PRODUCTS_FORMAT_MESSAGE)
  }

  return products
}

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

    const topProfitProducts = [...enrichedProducts]
      .sort((firstProduct, secondProduct) => secondProduct.profitRate - firstProduct.profitRate)
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

    return res.json({
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
      return res.status(500).json({
        status: 'error',
        message: INVALID_PRODUCTS_FORMAT_MESSAGE,
      })
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to read dashboard data.',
      error: error.message,
    })
  }
})

export default router
