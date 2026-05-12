import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cross-border phone holder analyzer backend is running',
    availableRoutes: ['GET /api/health', 'GET /api/products'],
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cross-border phone holder analyzer API is running,  gogogo!',
  })
})

app.use('/api/products', productsRouter)

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} was not found`,
    availableRoutes: ['GET /', 'GET /api/health', 'GET /api/products'],
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Products API: http://localhost:${PORT}/api/products`)
})
