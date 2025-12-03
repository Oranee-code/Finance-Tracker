import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { PieChart as PieChartIcon, Wallet, CreditCard, PiggyBank, Briefcase, Home as HomeIcon, ShoppingBag, Car, Heart, Star, Target, Building2, DollarSign, Sparkles } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import * as transactionApi from '../apis/transactions.ts'

const CHART_COLORS = ['#1e3a5f', '#0d9488', '#7dd3fc', '#2d4a6f', '#14b8a6', '#bae6fd']

// Icon options for tracker selection
const TRACKER_ICONS = [
  { name: 'Wallet', component: Wallet },
  { name: 'CreditCard', component: CreditCard },
  { name: 'PiggyBank', component: PiggyBank },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Home', component: HomeIcon },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Car', component: Car },
  { name: 'Heart', component: Heart },
  { name: 'Star', component: Star },
  { name: 'Target', component: Target },
  { name: 'Building2', component: Building2 },
  { name: 'DollarSign', component: DollarSign },
]

// Helper function to get icon component by name
const getIconComponent = (iconName?: string) => {
  const icon = TRACKER_ICONS.find(i => i.name === (iconName || 'Wallet'))
  return icon ? icon.component : Wallet
}

interface TrackerCardProps {
  tracker: any
  index: number
  userId: string
  isGuest: boolean
  onClick: () => void
}

export default function TrackerCard({ 
  tracker, 
  index, 
  userId, 
  isGuest, 
  onClick 
}: TrackerCardProps) {
  // Fetch category spending for this tracker
  const { data: categorySpending = [] } = useQuery({
    queryKey: ['categorySpending', tracker.id, userId, isGuest],
    queryFn: () => transactionApi.getCategorySpending(tracker.id, userId, isGuest),
  })

  // Fetch summary for net balance
  const { data: summary } = useQuery({
    queryKey: ['summary', tracker.id, userId, isGuest],
    queryFn: () => transactionApi.getTransactionSummary(tracker.id, userId, isGuest),
  })

  // Prepare mini chart data
  const miniChartData = categorySpending.slice(0, 4).map((cat: any, i: number) => ({
    name: cat.category_name || 'Other',
    value: Number(cat.total),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))

  const hasSpendingData = miniChartData.length > 0
  const netBalance = summary?.balance || 0
  const IconComponent = getIconComponent(tracker.icon)
  const iconColor = tracker.color || '#3b82f6'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card glass-card-hover rounded-2xl p-6 sm:p-10 cursor-pointer touch-manipulation"
      onClick={onClick}
    >
      {/* Header with name and icon */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-serif font-semibold text-luxury-navy">
          {tracker.name}
        </h3>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: iconColor }}
        >
          <IconComponent className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Net Balance */}
      <div className="mb-3">
        <p className="text-xs text-luxury-navy/50 uppercase tracking-wider">Total Balance</p>
        <p className={`text-2xl font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {netBalance < 0 ? '-' : ''}${Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Mini Spending Chart Section */}
      <div className="flex items-center gap-4 mb-6 py-6 border-t border-luxury-beige">
        {hasSpendingData ? (
          <>
            {/* Mini Donut Chart */}
            <div className="w-12 h-12 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={miniChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={12}
                    outerRadius={22}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {miniChartData.map((entry: any, i: number) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            {/* Category Labels */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 flex-1">
              {miniChartData.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-luxury-navy/60 truncate max-w-[60px]">
                    {item.name}
                  </span>
                </div>
              ))}
              {miniChartData.length > 3 && (
                <span className="text-xs text-luxury-navy/40">+{miniChartData.length - 3}</span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-luxury-navy/40">
            <PieChartIcon className="w-8 h-8 text-luxury-navy" />
            <span className="text-xs">No spending data yet</span>
          </div>
        )}
      </div>

      {/* Add Transaction Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="w-full py-3 sm:py-2 text-sm font-medium text-luxury-teal hover:text-luxury-teal/80 border border-luxury-navy 
        hover:border-luxury-teal/30 rounded-lg transition-colors flex items-center justify-center gap-1 mb-3 touch-manipulation min-h-[44px]"
      >
        + Add Transaction
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Last Updated */}
      <p className="text-xs text-luxury-navy/50 mt-6">
        Last updated: {format(new Date(tracker.updated_at), 'MMM d, yyyy')}
      </p>
    </motion.div>
  )
  
}
