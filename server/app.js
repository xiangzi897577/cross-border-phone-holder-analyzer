import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cross-border phone holder analyzer backend is running',
    availableRoutes: ['GET /api/health'],
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cross-border phone holder analyzer API is running',
  })
})

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} was not found`,
    availableRoutes: ['GET /', 'GET /api/health'],
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
