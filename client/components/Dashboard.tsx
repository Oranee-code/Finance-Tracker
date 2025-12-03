import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, PieChart as PieChartIcon, Wallet } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import * as transactionApi from '../apis/transactions.ts'
import TrackerCard from './TrackerCard.tsx'
import { useAIInsights } from '../hooks/useAIInsights.ts'
import AIInsightsNotification from './AIInsightsNotification.tsx'
import { Insight } from '../utils/aiInsights.ts'
import { slugify } from '../utils/slugify.ts'

interface DashboardProps {
  trackers: any[]
  userId: string
  isGuest: boolean
  onAddTracker: () => void
}

export default function Dashboard({ trackers, userId, isGuest, onAddTracker }: DashboardProps) {
  const navigate = useNavigate()
  const { insights, isLoading } = useAIInsights(userId, isGuest)
  const [currentNotification, setCurrentNotification] = useState<Insight | null>(null)
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set())
  const [notificationIndex, setNotificationIndex] = useState(0)

  // Show notifications one at a time for general insights across all trackers
  useEffect(() => {
    if (insights.length === 0) return

    const visibleInsights = insights.filter(
      (insight) => !dismissedInsights.has(insight.id)
    )

    if (visibleInsights.length > 0 && notificationIndex < visibleInsights.length) {
      setCurrentNotification(visibleInsights[notificationIndex])
    } else {
      setCurrentNotification(null)
    }
  }, [insights, dismissedInsights, notificationIndex])

  const handleCloseNotification = () => {
    setCurrentNotification(null)
    // Don't automatically show next notification - user can view them in individual trackers
  }

  const handleDismissInsight = (insightId: string) => {
    setDismissedInsights((prev) => new Set([...prev, insightId]))
    handleCloseNotification()
  }

  return (
    <>
      {/* AI Insights Notification - General suggestions based on all trackers */}
      <AIInsightsNotification
        insight={currentNotification}
        onClose={handleCloseNotification}
        onDismiss={() => currentNotification && handleDismissInsight(currentNotification.id)}
      />

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
            onClick={() => navigate(`/tracker/${slugify(tracker.name)}`)}
          />
        ))}
      </motion.div>
    </>
  )
}

