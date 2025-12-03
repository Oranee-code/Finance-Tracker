import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, CreditCard, PiggyBank, Briefcase, Home as HomeIcon, ShoppingBag, Car, Heart, Star, Target, Building2, DollarSign } from 'lucide-react'

// Icon options for tracker selection
export const TRACKER_ICONS = [
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

// Color options for tracker icon background 
export const TRACKER_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Sky Blue', value: '#7dd3fc' },
  { name: 'Yellow', value: '#ffd700' },
  { name: 'Orange', value: '#ff8c00' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Dark Green', value: '#166534' },
  { name: 'Light Green', value: '#10b981' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#ffb6c1' },
  { name: 'Gray', value: '#a9a9a9' },
]

interface AddTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, icon: string, color: string) => void
  isLoading?: boolean
}

export default function AddTrackerModal({ isOpen, onClose, onSubmit, isLoading = false }: AddTrackerModalProps) {
  const [trackerName, setTrackerName] = React.useState('')
  const [selectedIcon, setSelectedIcon] = React.useState('Wallet')
  const [selectedColor, setSelectedColor] = React.useState('#7dd3fc')

  React.useEffect(() => {
    if (isOpen) {
      setTrackerName('')
      setSelectedIcon('Wallet')
      setSelectedColor('#7dd3fc')
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackerName.trim()) {
      onSubmit(trackerName.trim(), selectedIcon, selectedColor)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-luxury-navy/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-luxury-navy mb-4 sm:mb-6">
          Create New Tracker
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={trackerName}
            onChange={(e) => setTrackerName(e.target.value)}
            placeholder="e.g., Personal, Business, Savings..."
            className="w-full px-4 py-3 border border-luxury-beige rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-luxury-teal/50 focus:border-luxury-teal bg-white/80 text-luxury-navy placeholder:text-luxury-navy/40 text-base"
            autoFocus
          />
          
          {/* Icon Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-luxury-navy mb-3">
              Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TRACKER_ICONS.map((icon) => {
                const IconComponent = icon.component
                const isSelected = selectedIcon === icon.name
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedIcon(icon.name)
                    }}
                    className={`p-2 sm:p-3 rounded-xl border-2 transition-all cursor-pointer relative z-10 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center touch-manipulation ${
                      isSelected
                        ? 'border-luxury-teal bg-luxury-teal/20 shadow-md'
                        : 'border-luxury-beige hover:border-luxury-teal/50 hover:bg-luxury-beige/50'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${
                      isSelected ? 'text-luxury-teal' : 'text-luxury-navy/60'
                    }`} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-luxury-navy mb-3">
              Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TRACKER_COLORS.map((color) => {
                const isSelected = selectedColor === color.value
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedColor(color.value)
                    }}
                    className={`w-10 h-10 rounded-lg border-2 transition-all cursor-pointer relative z-10 touch-manipulation min-w-[44px] min-h-[44px] ${
                      isSelected
                        ? 'border-luxury-navy shadow-lg scale-110'
                        : 'border-luxury-beige hover:border-luxury-navy/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                )
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!trackerName.trim() || isLoading}
              className="flex-1 luxury-btn text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 relative z-10"
            >
              <span className="relative z-10">
                {isLoading ? 'Creating...' : 'Create Tracker'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-luxury-beige hover:bg-luxury-beige/80 text-luxury-navy font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

