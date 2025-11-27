import express from 'express'
import * as Path from 'node:path'
import cors from 'cors'


import trackerRoutes from './routes/trackers.ts'
import transactionRoutes from './routes/transactions.ts'
import categoryRoutes from './routes/categories.ts'

const server = express()

// Enable CORS
// In production, allow same-origin requests (served from same domain)
// In development, allow all origins for local testing
server.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN || true  // Use env var or allow all in production
      : true,  // Allow all origins in development
    credentials: true,
  })
)

server.use(express.json())

server.use('/api/v1/trackers', trackerRoutes)
server.use('/api/v1/transactions', transactionRoutes)
server.use('/api/v1/categories', categoryRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
