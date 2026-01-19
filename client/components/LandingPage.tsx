import { motion } from 'framer-motion'
import { Wallet, PieChart as PieChartIcon, TrendingUp, Sparkles } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts'

// Sample data - Display landing page preview
const SAMPLE_CHART_DATA = [
  { name: '35% Mortgage', value: 35, color: '#1e3a5f' },
  { name: '20% Groceries', value: 20, color: '#0d9488' },
  { name: '18% Utilities', value: 18, color: '#bae6fd' },
  { name: '10% Dining Out', value: 10, color: '#3b82f6' },
  { name: '12% Savings', value: 12, color: '#7dd3fc' },
]

interface LandingPageProps {
  onCreateTracker: () => void
}

export default function LandingPage({ onCreateTracker }: LandingPageProps) {
  return (
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
          <p className="text-lg text-luxury-navy/80 font-sans leading-relaxed max-w-lg">
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
              onClick={onCreateTracker}
              className="luxury-btn text-white font-semibold py-6 px-14 rounded-xl text-base flex items-center gap-4 relative z-10"
            >
              <motion.span
                animate={{ rotate: [0, 45, -45, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <Sparkles className="w-6 h-6 relative z-10" />
              </motion.span>
              
              <span className="relative z-10 text-base sm:text-lg">
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
                  Preview Dashboard
                </p>
                <h3 className="text-4xl font-serif font-semibold text-luxury-navy">
                  $980
                </h3>
                <p className="text-sm text-luxury-teal mb-2">
                  Your balance
                </p>
              </div>
              <div className="text-right">
                <div className="mb-1">
                  <p className="text-1xl text-green-600 font-medium">
                    +$2,300
                  </p>
                  <p className="text-xs text-green-600 font-medium">income</p>
                </div>
                <div>
                  <p className="text-1xl text-red-500 font-medium">
                    -$1,320
                  </p>
                  <p className="text-xs text-red-500 font-medium">expense</p>
                </div>
              </div>
            </div>

            {/* Donut Chart with percentage labels on Right */}
            <div className="donut-chart flex flex-col items-center">
              <p className="text-xl text-luxury-navy/50 font-medium uppercase tracking-wider mb-2 text-center">
                Spending by Category
              </p>
              <div className="flex items-center justify-center gap-6">
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
                    <div key={index} className="flex items-center gap-2">
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
          <div className="feature-icon w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-sky-light to-luxury-sky flex items-center justify-center mb-4">
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
          <div className="feature-icon w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-sky-light to-luxury-sky flex items-center justify-center mb-4">
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
  )
}

