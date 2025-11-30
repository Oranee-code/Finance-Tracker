import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuestAuth } from './GuestAuthContext.tsx'
import { User, Trash2, LogOut } from 'lucide-react'

interface GuestProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GuestProfileModal({
  isOpen,
  onClose,
}: GuestProfileModalProps) {
  const { guestUser, updateGuestName, signOutGuest, clearGuestData } = useGuestAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(guestUser?.name || 'Guest User')
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    if (guestUser) {
      setName(guestUser.name)
    }
  }, [guestUser])

  if (!isOpen) return null

  const handleSave = () => {
    if (name.trim()) {
      setIsSaving(true)
      updateGuestName(name.trim())
      setTimeout(() => {
        setIsSaving(false)
        onClose()
      }, 300)
    }
  }

  const handleCancel = () => {
    setName(guestUser?.name || 'Guest User')
    onClose()
  }

  const handleLogout = () => {
    signOutGuest()
    navigate('/login')
    onClose()
  }

  const handleDeleteData = () => {
    clearGuestData()
    navigate('/login')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Guest Profile</h2>
           
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              maxLength={50}
            />
            
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Guest ID</p>
            <p className="text-sm font-mono text-gray-500 break-all">
              {guestUser?.id}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 
            rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {showLogoutConfirm ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600 font-medium text-center">
                Are you sure you want to log out? You may lose your data.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Confirm Logout
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </motion.button>
          )}

          {showDeleteConfirm ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600 font-medium text-center">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-400 text-grey-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteData}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

