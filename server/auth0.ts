import { expressjwt as jwt, GetVerificationKey } from 'express-jwt'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import jwks from 'jwks-rsa'

// Auth0 JWT verification for Finance Tracker
// For basic authentication, audience is optional
// Server-side code must use process.env (not import.meta.env which is Vite client-side only)
const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN
const audience = process.env.AUTH0_AUDIENCE || process.env.VITE_AUTH0_AUDIENCE

// Build JWT config - only include audience if it's set
const jwtConfig: Parameters<typeof jwt>[0] = {
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  issuer: `${domain}/`,
  algorithms: ['RS256'],
}

// Only add audience if it's provided and not the Management API
if (audience && audience.trim() !== '' && !audience.includes('/api/v2/')) {
  jwtConfig.audience = audience
}

const checkJwt = jwt(jwtConfig)

export default checkJwt

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JwtRequest<TReq = any, TRes = any>
  extends Request<ParamsDictionary, TRes, TReq> {
  auth?: JwtPayload
}
