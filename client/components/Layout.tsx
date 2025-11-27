import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LogoutButton from './LogoutButton.tsx'
import logo from '../../Image/MoneyTrackerLogo.png'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <>
      <header className="bg-blue-50 shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-3"
            >
              <img
                src={logo}
                alt="Money Tracker Logo"
                className="h-12 w-auto cursor-pointer"
              />
            </motion.button>
            <h3 className="text-sm text-gray-500"> Smart Money Management Simple Tracking</h3>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t border-luxury-beige py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <img
              src={logo}
              alt="Money Tracker Logo"
              className="h-6 w-auto"
            />
            <span className="text-sm text-luxury-navy/60">@ 2025 Money Tracker. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
