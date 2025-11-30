import { useAuth0 } from '@auth0/auth0-react'
import { useGuestAuth } from '../contexts/GuestAuthContext.tsx'
import { useEffect, useState } from 'react'

export function useUserInfo() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const { guestUser, isGuest } = useGuestAuth()
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Get Auth0 access token when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => setAccessToken(token))
        .catch((err) => {
          console.error('Error getting access token:', err)
          setAccessToken(null)
        })
    } else {
      setAccessToken(null)
    }
  }, [isAuthenticated, getAccessTokenSilently])

  if (isAuthenticated && user) {
    return { userId: user.sub || '', isGuest: false, user, accessToken }
  }

  if (isGuest && guestUser) {
    return { userId: guestUser.id, isGuest: true, user: guestUser, accessToken: null }
  }

  return { userId: '', isGuest: false, user: null, accessToken: null }
}
