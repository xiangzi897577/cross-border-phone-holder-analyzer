import { supabase } from '../lib/supabase.js'
import { getValidNumber, roundTo } from '../utils/number.js'
import { enrichProductMetrics } from '../utils/productMetrics.js'
import { readProducts } from '../utils/productStore.js'

const PLATFORM_ALL_PRODUCT_THRESHOLD = 20
const MAX_PLATFORM_CONTEXT_PRODUCTS = 12
const FAVORITE_ALL_PRODUCT_THRESHOLD = 10
const MAX_FAVORITE_CONTEXT_PRODUCTS = 10
const UNKNOWN_VALUE = '未知'

const CATEGORY_KEYWORDS = ['车载', '桌面', '懒人', '折叠', '磁吸', '直播', '平板']

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function getMessageContextText(messages = []) {
  if (!Array.isArray(messages)) {
    return ''
  }

  return messages
    .filter((message) => message?.role === 'user')
    .slice(-4)
    .map((message) => message.content)
    .join(' ')
}

function getNumber(value, fallback = 0) {
  return getValidNumber(value) ?? fallback
}

function getProductText(product) {
  return normalizeText(
    [
      product?.productName,
      product?.category,
      product?.material,
      product?.supplier,
      ...(Array.isArray(product?.tags) ? product.tags : []),
    ].join(' '),
  )
}

function getShippingCostLevel(product) {
  const shippingCost = getValidNumber(product?.shippingCost)

  if (shippingCost === null) {
    return UNKNOWN_VALUE
  }

  if (shippingCost <= 5) {
    return '低'
  }

  if (shippingCost <= 10) {
    return '中'
  }

  return '高'
}

function formatNumber(value, digits = 0) {
  const number = getValidNumber(value)

  if (number === null) {
    return UNKNOWN_VALUE
  }

  return String(roundTo(number, digits))
}

function formatPercent(value, digits = 1) {
  const number = getValidNumber(value)

  if (number === null) {
    return UNKNOWN_VALUE
  }

  return `${roundTo(number, digits)}%`
}

function formatProductForPrompt(product, index) {
  return [
    `商品${index + 1}：`,
    `名称：${product?.productName || UNKNOWN_VALUE}`,
    `类目：${product?.category || UNKNOWN_VALUE}`,
    `利润率：${formatPercent(product?.profitRatePercent)}`,
    `月销量：${formatNumber(product?.estimatedMonthlySales)}`,
    `评分：${formatNumber(product?.rating, 1)}`,
    `竞争指数：${formatNumber(product?.competitionScore)}`,
    `物流成本：${getShippingCostLevel(product)}`,
    `推荐评分：${formatNumber(product?.recommendationScore)}`,
  ].join('\n')
}

function getBusinessScore(product) {
  const recommendationScore = getNumber(product?.recommendationScore)
  const profitRatePercent = getNumber(product?.profitRatePercent)
  const estimatedMonthlySales = getNumber(product?.estimatedMonthlySales)
  const rating = getNumber(product?.rating)
  const competitionScore = getNumber(product?.competitionScore, 100)
  const shippingCost = getNumber(product?.shippingCost, 15)

  return (
    recommendationScore * 4 +
    profitRatePercent * 0.8 +
    estimatedMonthlySales / 40 +
    rating * 12 +
    (100 - Math.min(Math.max(competitionScore, 0), 100)) * 1.2 +
    (15 - Math.min(Math.max(shippingCost, 0), 15)) * 2
  )
}

function getKeywordScore(product, questionText) {
  const normalizedQuestion = normalizeText(questionText)
  const productText = getProductText(product)
  const profitRatePercent = getNumber(product?.profitRatePercent)
  const estimatedMonthlySales = getNumber(product?.estimatedMonthlySales)
  const rating = getNumber(product?.rating)
  const competitionScore = getNumber(product?.competitionScore, 100)
  const shippingCost = getNumber(product?.shippingCost, 15)
  let score = 0

  if (!normalizedQuestion) {
    return score
  }

  if (/新手|入门|小白/.test(normalizedQuestion)) {
    score += competitionScore <= 55 ? 30 : competitionScore <= 70 ? 12 : 0
    score += shippingCost <= 5 ? 20 : shippingCost <= 10 ? 8 : 0
    score += rating >= 4.4 ? 12 : 0
    score += product?.riskLevel === 'low' ? 10 : 0
    score += product?.volumeLevel === 'small' ? 8 : 0
  }

  if (/物流|运费|轻小件|成本低/.test(normalizedQuestion)) {
    score += shippingCost <= 5 ? 30 : shippingCost <= 10 ? 12 : 0
    score += product?.volumeLevel === 'small' ? 10 : 0
  }

  if (/利润|利润率|毛利/.test(normalizedQuestion)) {
    score += Math.min(profitRatePercent, 250) / 5
  }

  if (/竞争|低竞争|红海|蓝海/.test(normalizedQuestion)) {
    score += competitionScore <= 55 ? 30 : competitionScore <= 70 ? 12 : 0
  }

  if (/销量|月销|热销|销售/.test(normalizedQuestion)) {
    score += Math.min(estimatedMonthlySales, 1000) / 25
  }

  if (/评分|评价|口碑/.test(normalizedQuestion)) {
    score += rating * 8
  }

  CATEGORY_KEYWORDS.forEach((keyword) => {
    if (normalizedQuestion.includes(keyword) && productText.includes(keyword)) {
      score += 35
    }
  })

  return score
}

function rankProducts(products, questionText) {
  return [...products].sort((firstProduct, secondProduct) => {
    const firstScore = getBusinessScore(firstProduct) + getKeywordScore(firstProduct, questionText)
    const secondScore =
      getBusinessScore(secondProduct) + getKeywordScore(secondProduct, questionText)

    if (secondScore !== firstScore) {
      return secondScore - firstScore
    }

    return getNumber(firstProduct?.id) - getNumber(secondProduct?.id)
  })
}

function formatProductList(title, products, emptyText) {
  if (!Array.isArray(products) || products.length === 0) {
    return `${title}\n${emptyText}`
  }

  return `${title}\n${products.map((product, index) => formatProductForPrompt(product, index)).join('\n\n')}`
}

async function readFavoriteProducts(clientId, products) {
  const normalizedClientId = String(clientId || '').trim()

  if (!normalizedClientId) {
    return []
  }

  const { data: favorites, error } = await supabase
    .from('favorites')
    .select('product_id, created_at')
    .eq('client_id', normalizedClientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to read favorite products from Supabase. ${error.message}`)
  }

  if (!Array.isArray(favorites) || favorites.length === 0) {
    return []
  }

  const productMap = new Map(products.map((product) => [product.id, product]))

  return favorites
    .map((favorite) => productMap.get(favorite.product_id))
    .filter(Boolean)
}

export async function buildProductContext({ messages = [], clientId = '' } = {}) {
  const products = await readProducts()
  const enrichedProducts = products.map((product) => enrichProductMetrics(product))
  const questionText = getMessageContextText(messages)
  const platformProducts =
    enrichedProducts.length <= PLATFORM_ALL_PRODUCT_THRESHOLD
      ? enrichedProducts
      : rankProducts(enrichedProducts, questionText).slice(0, MAX_PLATFORM_CONTEXT_PRODUCTS)
  const favoriteProducts = await readFavoriteProducts(clientId, enrichedProducts)
  const contextFavoriteProducts =
    favoriteProducts.length <= FAVORITE_ALL_PRODUCT_THRESHOLD
      ? favoriteProducts
      : rankProducts(favoriteProducts, questionText).slice(0, MAX_FAVORITE_CONTEXT_PRODUCTS)

  return {
    platformProductCount: enrichedProducts.length,
    platformContextProductCount: platformProducts.length,
    favoriteProductCount: favoriteProducts.length,
    favoriteContextProductCount: contextFavoriteProducts.length,
    platformContextText: formatProductList(
      '当前平台商品列表：',
      platformProducts,
      '当前平台商品数据为空。',
    ),
    favoriteContextText: formatProductList(
      '当前用户候选池商品列表：',
      contextFavoriteProducts,
      '当前候选池为空。',
    ),
  }
}
