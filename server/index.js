import './config/env.js'
import app from './app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Products API: http://localhost:${PORT}/api/products`)
  console.log(`Product detail API: http://localhost:${PORT}/api/products/1`)
  console.log(`Dashboard API: http://localhost:${PORT}/api/dashboard`)
  console.log(`Favorites API: http://localhost:${PORT}/api/favorites`)
  console.log(`Add favorite API: POST http://localhost:${PORT}/api/favorites`)
  console.log(`Delete favorite API: DELETE http://localhost:${PORT}/api/favorites/1`)
})
