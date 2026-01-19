import { useAuth } from '../components/AuthContext.tsx'
import { useGuestAuth } from '../components/GuestAuthContext.tsx'

export function useUserInfo() {
  const { user, isAuthenticated } = useAuth()
  const { guestUser, isGuest } = useGuestAuth()

  if (isAuthenticated && user) {
    return { userId: String(user.id), isGuest: false, user }
  }

  if (isGuest && guestUser) {
    return { userId: guestUser.id, isGuest: true, user: guestUser }
  }

  return { userId: '', isGuest: false, user: null }
}

