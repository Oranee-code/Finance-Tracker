import request from 'superagent'
import { useAuth0 } from '@auth0/auth0-react'

// Helper function to get Auth0 access token
export async function getAccessToken(): Promise<string | null> {
  try {
    // This will be called from components that have access to useAuth0
    // We'll need to pass the token from the component
    return null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

// Helper function to create a request with proper headers
export function createRequest(isGuest: boolean, userId: string, accessToken?: string | null) {
  const req = request
  
  if (isGuest) {
    return req
      .set('X-Guest-Id', userId)
      .set('X-Is-Guest', 'true')
  } else if (accessToken) {
    return req
      .set('Authorization', `Bearer ${accessToken}`)
  }
  
  return req
}

