import { useAuth0 } from '@auth0/auth0-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuestAuth } from '../contexts/GuestAuthContext.tsx'

export default function Login() {
  const { loginWithRedirect, isLoading, error, isAuthenticated } = useAuth0()
  const { signInAsGuest, hasPreviousGuestData } = useGuestAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (error) {
      console.error('Auth0 Error:', error)
      setErrorMessage(error.message || 'An error occurred during authentication')
    }
  }, [error])

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate]) 

  const handleLogin = () => {
    setErrorMessage('')
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname || '/',
      },
    }).catch((err) => {
      console.error('Login error:', err)
      setErrorMessage(err.message || 'Failed to redirect to login')
    })
  }

  const handleGuestLogin = (restorePrevious = true) => {
    signInAsGuest(restorePrevious)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Finance Tracker
          </h1>
          <p className="text-gray-600">
            Sign in to manage your finances
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Loading...
            </>
          ) : (
            'Sign In with Auth0'
          )}
        </motion.button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {hasPreviousGuestData ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGuestLogin(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-2"
            >
              Continue as Guest (Restore Data)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGuestLogin(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Start New Guest Session
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuestLogin(false)}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign In as Guest
          </motion.button>
        )}

        <p className="text-sm text-gray-500 text-center mt-6">
          {hasPreviousGuestData
            ? 'Your previous guest data will be restored when you continue'
            : 'Guest mode allows you to use the app without creating an account'}
        </p>
        
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>For secure authentication, use Auth0</p>
          <p className="mt-1 text-gray-300">Callback URL: {window.location.origin}</p>
        </div>
      </motion.div>
    </div>
  )
}

