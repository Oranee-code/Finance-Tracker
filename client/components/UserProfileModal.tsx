import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.tsx'
import { User, LogOut } from 'lucide-react'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfileModal({
  isOpen,
  onClose,
}: UserProfileModalProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!isOpen || !user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Profile</h2>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-4">
              Display Name
            </label>
            <div className="w-full px-3 sm:px-2 py-2.5 sm:py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-800 break-words">
              {user.name}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-4">
              Email
            </label>
            <div className="w-full px-3 sm:px-2 py-2.5 sm:py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-800 break-all">
              {user.email}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600 mb-1">User ID</p>
            <p className="text-xs sm:text-sm font-mono text-gray-500 break-all">
              {user.id}
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base touch-manipulation min-h-[44px]"
          >
            Close
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 sm:my-6 border-t border-gray-200"></div>

        {/* Logout Button */}
        <div className="space-y-3">
          {showLogoutConfirm ? (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm text-red-600 font-medium text-center px-2">
                Are you sure you want to log out? You may lose your data.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base touch-manipulation min-h-[44px]"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base touch-manipulation min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Confirm Logout</span>
                  <span className="sm:hidden">Confirm</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base touch-manipulation min-h-[44px]"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Log Out
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

