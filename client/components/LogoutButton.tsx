import { motion } from 'framer-motion'
import { useState } from 'react'
import { CircleUserRound } from 'lucide-react'
import { useAuth } from './AuthContext.tsx'
import { useGuestAuth } from './GuestAuthContext.tsx'
import GuestProfileModal from './GuestProfileModal.tsx'
import UserProfileModal from './UserProfileModal.tsx'

export default function LogoutButton() {
  const { user, isAuthenticated } = useAuth()
  const { isGuest, guestUser } = useGuestAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)

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
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 text-sm font-medium transition-colors text-black hover:text-gray-600 cursor-pointer"
            title="Click to open profile"
          >
            <CircleUserRound className="w-8 h-8" />
            {displayName}
            {isGuest && (
              <span className="ml-2 text-xs text-gray-500">(Guest)</span>
            )}
          </motion.button>
        )}
      </div>

      {isGuest && (
        <GuestProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {isAuthenticated && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  )
}