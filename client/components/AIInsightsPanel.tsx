import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle, Lightbulb, Info, CheckCircle, X } from 'lucide-react'
import { Insight } from '../utils/aiInsights.ts'

interface AIInsightsPanelProps {
  insights: Insight[]
  onClose?: () => void
  onInsightClick?: (insight: Insight) => void
}

export default function AIInsightsPanel({
  insights,
  onClose,
  onInsightClick,
}: AIInsightsPanelProps) {
  if (insights.length === 0) {
    return null
  }

  const getIcon = (insight: Insight) => {
    // Use priority for color: high=red, medium=yellow, low=green
    switch (insight.priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'medium':
        return insight.type === 'suggestion' 
          ? <Lightbulb className="w-5 h-5 text-yellow-500" />
          : <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getBgColor = (priority: Insight['priority']) => {
    // Use priority for color: high=red, medium=yellow, low=green
    switch (priority) {
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

  const getTextColor = (priority: Insight['priority']) => {
    // Use priority for color: high=red, medium=yellow, low=green
    switch (priority) {
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

  const getPriorityBadge = (priority: Insight['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[priority]}`}
      >
        {priority.toUpperCase()}
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-serif font-semibold text-luxury-navy-light">
            Budget Intelligence
          </h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            {insights.length}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onInsightClick?.(insight)}
            className={`${getBgColor(insight.priority)} border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{getIcon(insight)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-bold text-base ${getTextColor(insight.priority)}`}>
                    {insight.title}
                  </h3>
                  {getPriorityBadge(insight.priority)}
                </div>
                <p className={`text-sm ${getTextColor(insight.priority)} opacity-90 leading-relaxed mb-2`}>
                  {insight.message}
                </p>
                {insight.percentage !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
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
                    <span className={`text-xs font-semibold ${getTextColor(insight.priority)}`}>
                      {insight.percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
                {insight.trackerName && (
                  <p className={`text-xs mt-2 ${getTextColor(insight.priority)} opacity-75`}>
                    📊 Tracker: {insight.trackerName}
                    {insight.category && ` • Category: ${insight.category}`}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

