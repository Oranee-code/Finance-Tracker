import { Request } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export function getUserId(req: Request): { userId: string; isGuest: boolean } {
  // Check if it's a guest user (from headers)
  const isGuestHeader = req.headers['x-is-guest']
  const isGuest = isGuestHeader === 'true' || isGuestHeader === '1'
  const guestId = req.headers['x-guest-id'] as string

  if (isGuest && guestId) {
    return { userId: guestId, isGuest: true }
  }

  // Check for authenticated user (JWT token in cookie)
  const token = req.cookies?.authToken
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
      return { userId: String(decoded.userId), isGuest: false }
    } catch (err) {
      // Token is invalid, continue to check guest or throw error
    }
  }

  // For development: if no auth and no guest headers, throw a more helpful error
  if (process.env.NODE_ENV !== 'production') {
    console.warn('No user ID found. Headers:', {
      'x-is-guest': req.headers['x-is-guest'],
      'x-guest-id': req.headers['x-guest-id'],
      'has-token': !!token,
    })
  }

  // Fallback - this shouldn't happen in protected routes
  throw new Error('Unable to determine user ID. Please ensure you are logged in.')
}

