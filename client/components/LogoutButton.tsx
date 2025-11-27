import { useAuth0 } from '@auth0/auth0-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGuestAuth } from '../contexts/GuestAuthContext.tsx'
import GuestProfileModal from './GuestProfileModal.tsx'

export default function LogoutButton() {
  const { logout, user, isAuthenticated } = useAuth0()
  const { isGuest, guestUser } = useGuestAuth()
  const navigate = useNavigate()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleLogout = () => {
    if (isAuthenticated) {
      // Auth0 logout
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
    }
  }

  const displayName = isAuthenticated
    ? user?.name || user?.email
    : isGuest
    ? guestUser?.name || 'Guest'
    : null

  return (
    <>
      <div className="flex items-center gap-4">
        {displayName && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isGuest) {
                setShowProfileModal(true)
              }
            }}
            className={`text-sm font-medium transition-colors ${
              isGuest
                ? 'text-indigo-600 hover:text-indigo-700 cursor-pointer underline'
                : 'text-gray-700 cursor-default'
            }`}
            title={isGuest ? 'Click to open profile' : undefined}
          >
            {displayName}
            {isGuest && (
              <span className="ml-2 text-xs text-gray-500">(Guest)</span>
            )}
          </motion.button>
        )}
        {!isGuest && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            title="Logout"
          >
            Logout
          </motion.button>
        )}
      </div>

      {isGuest && (
        <GuestProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  )
}