import express from 'express'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { enrichProductMetrics } from '../utils/productMetrics.js'

const router = express.Router()

//定义数据文件的路径
//计算当前文件的绝对路径，URL-> path
const currentFilePath = fileURLToPath(import.meta.url)
// __dirname在ES模块中不可用，需要通过fileURLToPath和path.dirname来获取当前目录路径
const currentDirPath = path.dirname(currentFilePath)
//构建数据文件的绝对路径
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')


//抽离读文件+解析JSON+校验数据格式
async function readProducts() {
  const fileContent = await readFile(productsFilePath, 'utf-8')
  const products = JSON.parse(fileContent)

  if (!Array.isArray(products)) {
    throw new Error('Products data format is invalid. Expected an array.')
  }

  return products
}

function filterProductsByKeyword(products, keyword) {
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

function filterProductsByCategory(products, category) {
  const normalizedCategory = String(category || '').trim()

  if (!normalizedCategory) {
    return products
  }

  return products.filter((product) => product.category === normalizedCategory)
}

function filterProductsByMinProfitRate(products, minProfitRate) {
  const normalizedMinProfitRate = String(minProfitRate || '').trim()

  if (!normalizedMinProfitRate) {
    return products
  }

  const minProfitRateNumber = Number(normalizedMinProfitRate)

  if (!Number.isFinite(minProfitRateNumber)) {
    return products
  }

  return products.filter((product) => product.profitRatePercent >= minProfitRateNumber)
}

function sortProducts(products, sort) {
  const normalizedSort = String(sort || '').trim()

  if (!normalizedSort) {
    return products
  }

  const sortedProducts = [...products]

  switch (normalizedSort) {
    case 'profitRateDesc':
      return sortedProducts.sort((a, b) => b.profitRate - a.profitRate)
    case 'monthlySalesDesc':
      return sortedProducts.sort((a, b) => b.estimatedMonthlySales - a.estimatedMonthlySales)
    case 'ratingDesc':
      return sortedProducts.sort((a, b) => b.rating - a.rating)
    case 'competitionScoreAsc':
      return sortedProducts.sort((a, b) => a.competitionScore - b.competitionScore)
    case 'recommendationScoreDesc':
      return sortedProducts.sort((a, b) => b.recommendationScore - a.recommendationScore)
    default:
      return products
  }
}

router.get('/', async (req, res) => {
  try {
    const products = await readProducts()
    const keywordFilteredProducts = filterProductsByKeyword(products, req.query.keyword)
    const categoryFilteredProducts = filterProductsByCategory(keywordFilteredProducts, req.query.category)
    const enrichedProducts = categoryFilteredProducts.map((product) => enrichProductMetrics(product))
    const filteredProducts = filterProductsByMinProfitRate(
      enrichedProducts,
      req.query.minProfitRate,
    )
    const sortedProducts = sortProducts(filteredProducts, req.query.sort)

    return res.json(sortedProducts)
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to read products data.',
      error: error.message,
    })
  }
})

router.get('/:id', async (req, res) => {
  const productId = Number(req.params.id)

  if (!Number.isInteger(productId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Product id must be a valid number.',
    })
  }

  try {
    const products = await readProducts()
    const product = products.find((item) => item.id === productId)

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.',
      })
    }

    return res.json(enrichProductMetrics(product))
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to read products data.',
      error: error.message,
    })
  }
})

export default router
