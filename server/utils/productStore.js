import path from 'path'
import { fileURLToPath } from 'url'
import { readJsonFile } from './fileStore.js'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const productsFilePath = path.join(currentDirPath, '..', 'data', 'products.json')

export const INVALID_PRODUCTS_FORMAT_MESSAGE =
  'Products data format is invalid. Expected an array.'

export async function readProducts() {
  const products = await readJsonFile(productsFilePath)

  if (!Array.isArray(products)) {
    throw new Error(INVALID_PRODUCTS_FORMAT_MESSAGE)
  }

  return products
}
