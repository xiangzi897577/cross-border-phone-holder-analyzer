import express from 'express'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

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

router.get('/', async (req, res) => {
  try {
    const products = await readProducts()
    return res.json(products)
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

    return res.json(product)
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to read products data.',
      error: error.message,
    })
  }
})

export default router
