import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Wallet, PieChart as PieChartIcon, TrendingUp, Sparkles, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts'
import * as trackerApi from '../apis/trackers.ts'
import * as transactionApi from '../apis/transactions.ts'
import { useUserInfo } from '../hooks/useUserInfo.ts'
import { format } from 'date-fns'
import moneyBg from '../../Image/Money BG2.jpg'

// Sample data for preview - Display landing page preview
const SAMPLE_CHART_DATA = [
  { name: '35% Mortgage', value: 35, color: '#1e3a5f' },
  { name: '20% Groceries', value: 20, color: '#0d9488' },
  { name: '18% Utilities', value: 18, color: '#bae6fd' },
  { name: '10% Dining Out', value: 10, color: '#3b82f6' },
  { name: '5% Entertainment', value: 5, color: '#2d4a6f' },
  { name: '12% Savings', value: 12, color: '#7dd3fc' },
]

export default function Home() {
  const { userId, isGuest } = useUserInfo()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [trackerName, setTrackerName] = useState('')

  const { data: trackers = [], isLoading } = useQuery({
    queryKey: ['trackers', userId, isGuest],
    queryFn: () => trackerApi.getTrackers(userId, isGuest),
  })

  // Fetch real category spending data if user has trackers
  const firstTrackerId = trackers.length > 0 ? trackers[0].id : null
  const { data: realCategorySpending = [] } = useQuery({
    queryKey: ['categorySpending', firstTrackerId, userId, isGuest],
    queryFn: () => transactionApi.getCategorySpending(firstTrackerId!, userId, isGuest),
    enabled: !!firstTrackerId,
  })

  const { data: realSummary } = useQuery({
    queryKey: ['summary', firstTrackerId, userId, isGuest],
    queryFn: () => transactionApi.getTransactionSummary(firstTrackerId!, userId, isGuest),
    enabled: !!firstTrackerId,
  })

  const addMutation = useMutation({
    mutationFn: (name: string) => trackerApi.addTracker(name, userId, isGuest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers', userId, isGuest] })
      setShowAddModal(false)
      setTrackerName('')
    },
  })

  const handleAddTracker = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackerName.trim()) {
      addMutation.mutate(trackerName.trim())
    }
  }

  // Prepare chart data - use real data if available, otherwise sample
  const hasRealData = realCategorySpending.length > 0
  const chartColors = ['#1e3a5f', '#0d9488', '#7dd3fc', '#2d4a6f', '#14b8a6', '#bae6fd']
  
  const pieChartData = hasRealData
    ? realCategorySpending.map((cat: any, index: number) => ({
        name: cat.category_name || 'Other',
        value: Number(cat.total),
        color: chartColors[index % chartColors.length],
      }))
    : SAMPLE_CHART_DATA

  const displaySummary = hasRealData && realSummary
    ? {
        income: realSummary.totalIncome || 0,
        expenses: realSummary.totalExpenses || 0,
        balance: realSummary.balance || 0,
      }
    : {
        income: 2300,
        expenses: 1320,
        balance: 980,
      }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen luxury-gradient-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-teal"></div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={trackers.length > 0 ? {
        backgroundImage: `linear-gradient(rgba(235, 239, 248, 0.85), rgba(245, 240, 232, 0.9)), url(${moneyBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
     
      {trackers.length === 0 && <div className="absolute inset-0 luxury-gradient-bg"></div>}
      
      {/* Floating decorative orbs */}
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        {/* Header with Add Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className={`${trackers.length > 0 ? 'text-4xl font-sans font-bold text-indigo-700 ml-8 -mt-10' : 'text-3xl font-serif font-semibold text-luxury-navy'}`}>
            {trackers.length > 0 ? 'Your Dashboard' : ''}
          </h1>
          {trackers.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 luxury-btn text-white font-semibold py-4 px-6 rounded-xl relative z-10"
            >
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Add Tracker </span>
            </motion.button>
          )}
        </motion.div>

        {trackers.length === 0 ? (
          /* Landing Page  */
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-2 items-center">
              {/* Left Landing Page Text */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-12"
              >
                <h1 className="text-5xl lg:text-6xl font-serif font-semibold text-luxury-navy leading-tight">
                  Where Does 
                  <br></br>Your Money 
                  <span className="block text-luxury-teal">Really Go?</span>
                </h1>
                <p className="text-lg text-luxury-navy/70 font-sans leading-relaxed max-w-lg">
                  Track Everything. Understand Anything.<br></br> Take Control Of Your Finances.
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(true)}
                    className="luxury-btn text-white font-semibold py-5 px-10 rounded-xl text-base flex items-center gap-4 relative z-10"
                  >
                    <motion.span
                      animate={{ rotate: [0, 45, -45, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
                    >
                      <Sparkles className="w-6 h-6 relative z-10" />
                    </motion.span>
                    

                    <span className="relative z-10 text-lg">
                      Create Your First Tracker
                    </span>
                    <motion.span
                      animate={{ rotate: [0, 45, -45, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Sparkles className="w-6 h-6 relative z-10" />
                    </motion.span>
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Landing Page Preview Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="relative"
              >
                <div className="preview-chart-container p-10 shadow-2xl">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="text-sm text-luxury-navy/50 font-medium uppercase tracking-wider">
                        {hasRealData ? trackers[0]?.name : 'Preview Dashboard'}
                      </p>
                      <h3 className="text-4xl font-serif font-semibold text-luxury-navy">
                        ${displaySummary.balance.toLocaleString()}
                      </h3>
                      <p className="text-sm text-luxury-teal mb-10">
                        {hasRealData ? 'Current Balance' : 'Your balance'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="mb-1">
                        <p className="text-xl text-green-600 font-medium">
                          +${displaySummary.income.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 font-medium -mt-0.1">income</p>
                      </div>
                      <div>
                        <p className="text-xl text-red-500 font-medium">
                          -${displaySummary.expenses.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-500 font-medium -mt-0.1">expense</p>
                      </div>
                    </div>
                  </div>

                  {/* Donut Chart with percentage labels on Right */}
                  <div className="donut-chart flex flex-col items-center">
                    <p className="text-1sm text-luxury-navy/50 font-medium uppercase tracking-wider mb-4 text-center">
                      Spending by Category
                    </p>
                    <div className="flex items-center justify-center gap-16">
                      {/* Donut Chart */}
                      <div className="h-28 w-28 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={SAMPLE_CHART_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={45}
                              paddingAngle={0}
                              dataKey="value"
                            >
                              {SAMPLE_CHART_DATA.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                      {/* percentage labels - Right side */}
                      <div className="flex flex-col gap-2">
                        {SAMPLE_CHART_DATA.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-6">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium text-luxury-navy/70">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Feature 1 */}
              <div className="feature-card glass-card glass-card-hover rounded-2xl p-6">
                <div className="feature-icon w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-navy to-luxury-navy-light flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-luxury-navy" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-luxury-navy mb-2">
                  Multiple Trackers
                </h3>
                <p className="text-luxury-navy/60 text-sm leading-relaxed">
                  Create separate trackers for your personal, business, or saving goals.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="feature-card glass-card glass-card-hover rounded-2xl p-6">
                <div className="feature-icon w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-teal to-luxury-teal-light flex items-center justify-center mb-4">
                  <PieChartIcon className="w-8 h-8 text-luxury-navy" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-luxury-navy mb-2">
                  Smart Categories
                </h3>
                <p className="text-luxury-navy/60 text-sm leading-relaxed">
                  Organize your spending with custom categories so you know where your money goes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="feature-card glass-card glass-card-hover rounded-2xl p-6">
                <div className="feature-icon w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-sky to-luxury-sky-light flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-luxury-navy" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-luxury-navy mb-2">
                  Visual Insights
                </h3>
                <p className="text-luxury-navy/60 text-sm leading-relaxed">
                  Beautiful charts give you a clear picture of your spending habits.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Tracker Grid - When user has trackers */
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
                onClick={() => navigate(`/tracker/${tracker.id}`)}
              />
            ))}
          </motion.div>
        )}

        {/* Add Tracker Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-luxury-navy/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <h2 className="text-2xl font-serif font-semibold text-luxury-navy mb-6">
                Create New Tracker
              </h2>
              <form onSubmit={handleAddTracker}>
                <input
                  type="text"
                  value={trackerName}
                  onChange={(e) => setTrackerName(e.target.value)}
                  placeholder="e.g., Personal, Business, Savings..."
                  className="w-full px-4 py-3 border border-luxury-beige rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-luxury-teal/50 focus:border-luxury-teal bg-white/80 text-luxury-navy placeholder:text-luxury-navy/40"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!trackerName.trim() || addMutation.isPending}
                    className="flex-1 luxury-btn text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 relative z-10"
                  >
                    <span className="relative z-10">
                      {addMutation.isPending ? 'Creating...' : 'Create Tracker'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setTrackerName('')
                    }}
                    className="flex-1 bg-luxury-beige hover:bg-luxury-beige/80 text-luxury-navy font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

// Tracker Card Component with mini spending chart
const CHART_COLORS = ['#1e3a5f', '#0d9488', '#7dd3fc', '#2d4a6f', '#14b8a6', '#bae6fd']

function TrackerCard({ 
  tracker, 
  index, 
  userId, 
  isGuest, 
  onClick 
}: { 
  tracker: any
  index: number
  userId: string
  isGuest: boolean
  onClick: () => void 
}) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card glass-card-hover rounded-2xl p-10 cursor-pointer"
      onClick={onClick}
    >
      {/* Header with name and icon */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-serif font-semibold text-luxury-navy">
          {tracker.name}
        </h3>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-luxury-teal to-luxury-teal-light flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-black" />
          
        </div>
      </div>

      {/* Net Balance */}
      <div className="mb-3">
        <p className="text-xs text-luxury-navy/50 uppercase tracking-wider">Total Balance</p>
<p className={`text-2xl font-semibold ${netBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {netBalance < 0 ? '-' : ''}${Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
      </div>

      {/* Mini Spending Chart Section on home page*/}
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

      {/* Last Updated */}
      <p className="text-xs text-luxury-navy/50 mb-10">
        Last updated: {format(new Date(tracker.updated_at), 'MMM d, yyyy')}
      </p>

      {/* Show More Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="w-full py-2 text-sm font-medium text-luxury-navy/70 hover:text-luxury-teal border border-luxury-beige hover:border-luxury-teal/30 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        Show More
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  )
}
