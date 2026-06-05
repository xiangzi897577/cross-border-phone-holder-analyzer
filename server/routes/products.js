import express from 'express'
import { filterProductsByCategory, filterProductsByKeyword, filterProductsByMinProfitRate } from '../utils/productFilters.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'
import { sortProducts } from '../utils/productSort.js'
import { readProducts } from '../utils/productStore.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { parsePositiveInteger } from '../utils/number.js'

const router = express.Router()

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

    return sendSuccess(res, sortedProducts)
  } catch (error) {
    return sendError(res, 500, 'Failed to read products data.', error)
  }
})

router.get('/:id', async (req, res) => {
  const productId = parsePositiveInteger(req.params.id)

  if (productId === null) {
    return sendError(res, 400, 'Product id must be a valid number.')
  }

  try {
    const products = await readProducts()
    const product = products.find((item) => item.id === productId)

    if (!product) {
      return sendError(res, 404, 'Product not found.')
    }

    return sendSuccess(res, enrichProductMetrics(product))
  } catch (error) {
    return sendError(res, 500, 'Failed to read products data.', error)
  }
})

export default router
