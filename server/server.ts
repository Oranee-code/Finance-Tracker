import express from 'express'
import * as Path from 'node:path'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import trackerRoutes from './routes/trackers.ts'
import transactionRoutes from './routes/transactions.ts'
import categoryRoutes from './routes/categories.ts'
import authRoutes from './routes/auth.ts'

const server = express()

server.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN || true  
      : true,  
    credentials: true,
  })
)

server.use(cookieParser())
server.use(express.json())

server.use('/api/v1/auth', authRoutes)
server.use('/api/v1/trackers', trackerRoutes)
server.use('/api/v1/transactions', transactionRoutes)
server.use('/api/v1/categories', categoryRoutes)

// Error handling middleware
server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
