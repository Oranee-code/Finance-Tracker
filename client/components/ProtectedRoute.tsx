import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'
import Login from './Login'
import { useGuestAuth } from './GuestAuthContext.tsx'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0()
  const { isGuest } = useGuestAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access if authenticated via Auth0 OR signed in as guest
  if (!isAuthenticated && !isGuest) {
    return <Login />
  }

  return <>{children}</>
}

