import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as db from '../db/users.ts'
import jwt from 'jsonwebtoken'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d' // Token expires in 7 days

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: 'Email, password, and name are required' 
      })
      return
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      res.status(StatusCodes.CONFLICT).json({ 
        message: 'User with this email already exists' 
      })
      return
    }

    // Create user
    const user = await db.createUser({ email, password, name })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Set httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(StatusCodes.CREATED).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (err: any) {
    console.error('Registration error:', err)
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message?.includes('UNIQUE constraint')) {
      res.status(StatusCodes.CONFLICT).json({ 
        message: 'User with this email already exists' 
      })
      return
    }
    next(err)
  }
})

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: 'Email and password are required' 
      })
      return
    }

    // Find user by email
    const user = await db.getUserByEmail(email)
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Invalid email or password' 
      })
      return
    }

    // Verify password
    const isValid = await db.verifyPassword(password, user.password_hash)
    if (!isValid) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Invalid email or password' 
      })
      return
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Set httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (err) {
    next(err)
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('authToken')
  res.json({ message: 'Logged out successfully' })
})

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const token = req.cookies?.authToken

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Not authenticated' 
      })
      return
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
      const user = await db.getUserById(decoded.userId)

      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ 
          message: 'User not found' 
        })
        return
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } catch (err) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Invalid token' 
      })
    }
  } catch (err) {
    next(err)
  }
})

export default router

