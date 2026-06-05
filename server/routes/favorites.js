import express from 'express'
import { supabase } from '../lib/supabase.js'
import { parsePositiveInteger } from '../utils/number.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'
import { readProducts } from '../utils/productStore.js'
import { sendError, sendSuccess } from '../utils/response.js'

const router = express.Router()

function getClientId(req) {
  const rawClientId = req.headers['x-client-id']
  const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId

  return typeof clientId === 'string' ? clientId.trim() : ''
}

function isUniqueConstraintError(error) {
  return error?.code === '23505'
}

router.get('/', async (req, res) => {
  try {
    const clientId = getClientId(req)

    if (!clientId) {
      return sendError(res, 400, 'Missing client id')
    }

    const products = await readProducts()
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('product_id, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      return sendError(res, 500, 'Failed to query favorites from Supabase.', error)
    }

    // Create a map of products for efficient lookup  
    //eg:
    // 1 → { id: 1, productName: 'A 商品' }
    // 2 → { id: 2, productName: 'B 商品' }  
    const productMap = new Map(products.map((product) => [product.id, product]))

    const favoriteProducts = favorites
      // Get the product for each favorite ID 
      .map((favorite) => productMap.get(favorite.product_id))
      .filter(Boolean)
      .map((product) => enrichProductMetrics(product))

    return sendSuccess(res, favoriteProducts)
  } catch (error) {
    return sendError(res, 500, 'Failed to read favorites data.', error)
  }
})

router.post('/', async (req, res) => {
  try {
    const clientId = getClientId(req)
    const productId = parsePositiveInteger(req.body?.productId)

    if (!clientId) {
      return sendError(res, 400, 'Missing client id')
    }

    if (productId === null) {
      return sendError(
        res,
        400,
        'productId is invalid. Please provide a valid positive integer productId.',
      )
    }

    const products = await readProducts()
    const targetProduct = products.find((product) => product.id === productId)

    if (!targetProduct) {
      return sendError(res, 404, 'Product not found. Cannot add it to favorites.')
    }

    const { error } = await supabase
      .from('favorites')
      .insert({
        client_id: clientId,
        product_id: productId,
      })

    if (isUniqueConstraintError(error)) {
      return sendError(res, 409, 'Product already in favorites', null, {
        product: enrichProductMetrics(targetProduct),
      })
    }

    if (error) {
      return sendError(res, 500, 'Failed to add favorite product in Supabase.', error)
    }

    return sendSuccess(res, {
      status: 'success',
      message: '商品已成功添加到候选池。',
      product: enrichProductMetrics(targetProduct),
    }, 201)
  } catch (error) {
    return sendError(res, 500, 'Failed to add favorite product.', error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const clientId = getClientId(req)
    const productId = parsePositiveInteger(req.params.id)

    if (!clientId) {
      return sendError(res, 400, 'Missing client id')
    }

    if (productId === null) {
      return sendError(
        res,
        400,
        'productId is invalid. Please provide a valid positive integer productId.',
      )
    }

    const { data: deletedFavorites, error } = await supabase
      .from('favorites')
      .delete()
      .eq('client_id', clientId)
      .eq('product_id', productId)
      .select('product_id')

    if (error) {
      return sendError(res, 500, 'Failed to delete favorite product from Supabase.', error)
    }

    if (!Array.isArray(deletedFavorites) || deletedFavorites.length === 0) {
      return sendError(res, 404, '该商品不在候选池中，无法删除。')
    }

    return sendSuccess(res, {
      status: 'success',
      message: '商品已成功从候选池中删除。',
      productId,
    })
  } catch (error) {
    return sendError(res, 500, 'Failed to delete favorite product.', error)
  }
})

export default router
