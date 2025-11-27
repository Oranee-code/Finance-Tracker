import { Request } from 'express'
import { JwtRequest } from './auth0.ts'

export function getUserId(req: Request): { userId: string; isGuest: boolean } {
  // Check if it's a guest user (from headers)
  const isGuestHeader = req.headers['x-is-guest']
  const isGuest = isGuestHeader === 'true' || isGuestHeader === '1'
  const guestId = req.headers['x-guest-id'] as string

  if (isGuest && guestId) {
    return { userId: guestId, isGuest: true }
  }

  // Check for Auth0 user (if JWT is present)
  const authReq = req as JwtRequest
  if (authReq.auth?.sub) {
    return { userId: authReq.auth.sub, isGuest: false }
  }

  // For development: if no auth and no guest headers, throw a more helpful error
  if (process.env.NODE_ENV !== 'production') {
    console.warn('No user ID found. Headers:', {
      'x-is-guest': req.headers['x-is-guest'],
      'x-guest-id': req.headers['x-guest-id'],
      'auth': authReq.auth,
    })
  }

  // Fallback - this shouldn't happen in protected routes
  throw new Error('Unable to determine user ID. Please ensure you are logged in.')
}

