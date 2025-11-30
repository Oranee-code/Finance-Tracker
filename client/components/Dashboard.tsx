import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, PieChart as PieChartIcon, Wallet } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import * as transactionApi from '../apis/transactions.ts'
import TrackerCard from './TrackerCard.tsx'

interface DashboardProps {
  trackers: any[]
  userId: string
  isGuest: boolean
  accessToken: string | null
  onAddTracker: () => void
}

export default function Dashboard({ trackers, userId, isGuest, accessToken, onAddTracker }: DashboardProps) {
  const navigate = useNavigate()

  return (
    <>
      {/* Header with Add Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-4xl font-sans font-bold text-blue-500 ml-8 -mt-10">
          Your Dashboard
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTracker}
          className="flex items-center gap-2 luxury-btn text-white font-semibold py-4 px-6 rounded-xl relative z-10"
        >
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Add Tracker</span>
        </motion.button>
      </motion.div>

      {/* Tracker Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {trackers.map((tracker: any, index: number) => (
          <TrackerCard
            key={tracker.id}
            tracker={tracker}
            index={index}
            userId={userId}
            isGuest={isGuest}
            accessToken={accessToken}
            onClick={() => navigate(`/tracker/${tracker.id}`)}
          />
        ))}
      </motion.div>
    </>
  )
}

