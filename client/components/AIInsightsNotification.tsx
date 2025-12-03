import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Lightbulb, Info, CheckCircle, Sparkles } from 'lucide-react'
import { Insight } from '../utils/aiInsights.ts'

interface AIInsightsNotificationProps {
  insight: Insight | null
  onClose: () => void
}

export default function AIInsightsNotification({
  insight,
  onClose,
}: AIInsightsNotificationProps) {
  const getIcon = () => {
    if (!insight) return null
    // Use priority for color: high=red, medium=yellow, low=green
    switch (insight.priority) {
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-red-500" />
      case 'medium':
        return insight.type === 'suggestion' 
          ? <Lightbulb className="w-6 h-6 text-yellow-500" />
          : <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      default:
        return <Info className="w-6 h-6 text-gray-500" />
    }
  }

  const getBgColor = () => {
    if (!insight) return 'bg-gray-50 border-gray-200'
    // Use priority for color: high=red, medium=yellow, low=green
    switch (insight.priority) {
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'low':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    if (!insight) return 'text-gray-800'
    // Use priority for color: high=red, medium=yellow, low=green
    switch (insight.priority) {
      case 'high':
        return 'text-red-800'
      case 'medium':
        return 'text-yellow-800'
      case 'low':
        return 'text-green-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <AnimatePresence mode="wait">
      {insight && (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 w-auto sm:w-full ${getBgColor()} border-2 rounded-xl shadow-2xl p-4 touch-manipulation`}
        >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-bold text-lg ${getTextColor()}`}>
                {insight.title}
              </h3>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-sm ${getTextColor()} opacity-90 leading-relaxed`}>
              {insight.message}
            </p>
            {insight.percentage !== undefined && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(insight.percentage, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${
                      insight.priority === 'high'
                        ? 'bg-red-500'
                        : insight.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
                <span className={`text-xs font-semibold ${getTextColor()}`}>
                  {insight.percentage.toFixed(1)}%
                </span>
              </div>
            )}
            {insight.trackerName && (
              <p className={`text-xs mt-2 ${getTextColor()} opacity-75`}>
                Tracker: {insight.trackerName}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}

