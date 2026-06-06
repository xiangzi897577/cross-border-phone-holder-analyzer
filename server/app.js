import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import dashboardRouter from './routes/dashboard.js'
import favoritesRouter from './routes/favorites.js'
import aiRouter from './routes/ai.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cross-border phone holder analyzer backend is running',
    availableRoutes: [
      'GET /api/health',
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/dashboard',
      'GET /api/favorites',
      'POST /api/favorites',
      'DELETE /api/favorites/:id',
      'POST /api/ai/chat',
    ],
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cross-border phone holder analyzer API is running,  gogogo!',
  })
})

app.use('/api/products', productsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/ai', aiRouter)

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} was not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/dashboard',
      'GET /api/favorites',
      'POST /api/favorites',
      'DELETE /api/favorites/:id',
      'POST /api/ai/chat',
    ],
  })
})

// Before Vercel Serverless deployment, app.js also called app.listen(...) directly.
// Keep the old shape here for learning reference, but local startup now lives in index.js.
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })

export default app
