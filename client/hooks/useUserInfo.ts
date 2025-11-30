import { useAuth0 } from '@auth0/auth0-react'
import { useGuestAuth } from '../components/GuestAuthContext.tsx'

export function useUserInfo() {
  const { user, isAuthenticated } = useAuth0()
  const { guestUser, isGuest } = useGuestAuth()

  if (isAuthenticated && user) {
    return { userId: user.sub || '', isGuest: false, user }
  }

  if (isGuest && guestUser) {
    return { userId: guestUser.id, isGuest: true, user: guestUser }
  }

  return { userId: '', isGuest: false, user: null }
}

