import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Edit2, Trash2, TrendingUp, TrendingDown, Landmark, CalendarHeart, Wallet, CreditCard, PiggyBank, Briefcase, Home, ShoppingBag, Car, Heart, Star, Target, Building2, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import * as trackerApi from '../apis/trackers.ts'
import * as transactionApi from '../apis/transactions.ts'
import * as categoryApi from '../apis/categories.ts'
import { useUserInfo } from '../hooks/useUserInfo.ts'
import { format } from 'date-fns'
import moneyBg from '../../Image/Money BG2.jpg'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6']

// Icon options for tracker selection
const TRACKER_ICONS = [
  { name: 'Wallet', component: Wallet },
  { name: 'CreditCard', component: CreditCard },
  { name: 'PiggyBank', component: PiggyBank },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Home', component: Home },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Car', component: Car },
  { name: 'Heart', component: Heart },
  { name: 'Star', component: Star },
  { name: 'Target', component: Target },
  { name: 'Building2', component: Building2 },
  { name: 'DollarSign', component: DollarSign },
]

// Color options for tracker icon background

const TRACKER_COLORS = [
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

export default function TrackerDashboard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId, isGuest } = useUserInfo()
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('Wallet')
  const [editColor, setEditColor] = useState('#7dd3fc')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const trackerId = Number(id)

  const { data: tracker } = useQuery({
    queryKey: ['tracker', trackerId, userId, isGuest],
    queryFn: () => trackerApi.getTracker(trackerId, userId, isGuest),
  })

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', trackerId, userId, isGuest],
    queryFn: () => transactionApi.getTransactions(trackerId, userId, isGuest),
  })

  const { data: summary } = useQuery({
    queryKey: ['summary', trackerId, userId, isGuest],
    queryFn: () => transactionApi.getTransactionSummary(trackerId, userId, isGuest),
  })

  const { data: categorySpending = [] } = useQuery({
    queryKey: ['categorySpending', trackerId, userId, isGuest],
    queryFn: () => transactionApi.getCategorySpending(trackerId, userId, isGuest),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', userId, isGuest],
    queryFn: () => categoryApi.getCategories(userId, isGuest),
  })

  const deleteTrackerMutation = useMutation({
    mutationFn: () => trackerApi.deleteTracker(trackerId, userId, isGuest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers', userId, isGuest] })
      navigate('/')
    },
  })

  const updateTrackerMutation = useMutation({
    mutationFn: ({ name, icon, color }: { name: string; icon: string; color: string }) => trackerApi.updateTracker(trackerId, name, userId, isGuest, icon || 'Wallet', color || '#7dd3fc'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker', trackerId, userId, isGuest] })
      queryClient.invalidateQueries({ queryKey: ['trackers', userId, isGuest] })
      setShowEditModal(false)
    },
  })

  useEffect(() => {
    if (tracker) {
      setEditName(tracker.name)
      setEditIcon(tracker.icon || 'Wallet')
      setEditColor(tracker.color || '#7dd3fc')
    }
  }, [tracker])

  const chartData = categorySpending.map((cat: any) => ({
    name: cat.category_name || 'Uncategorized',
    value: Number(cat.total),
  }))

  const incomeCategories = categories.filter((c: any) => c.type === 'income')
  const expenseCategories = categories.filter((c: any) => c.type === 'expense')

  // Show and Calculate date range from transactions
  const getDateRange = () => {
    if (transactions.length === 0) return null
    
    const dates = transactions
      .map((t: any) => new Date(t.transaction_date))
      .filter((date: Date) => !isNaN(date.getTime()))
      .sort((a: Date, b: Date) => a.getTime() - b.getTime())
    
    if (dates.length === 0) return null
    
    const earliest = dates[0]
    const latest = dates[dates.length - 1]
    
    return {
      start: earliest,
      end: latest,
    }
  }

  const dateRange = getDateRange()

  if (!tracker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(235, 239, 248, 0.85), rgba(245, 240, 232, 0.9)), url(${moneyBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-12 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-800 flex-1">{tracker.name}</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </motion.button>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 rounded-lg p-6 border border-green-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-green-800">Total Income</h3>
            </div>
            <p className="text-3xl font-bold text-green-700">
              ${summary?.totalIncome?.toFixed(2) || '0.00'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 rounded-lg p-6 border border-red-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-medium text-red-800">Total Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-red-700">
              ${summary?.totalExpenses?.toFixed(2) || '0.00'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-lg p-6 border ${
              (summary?.balance || 0) >= 0
                ? 'bg-blue-50 border-blue-200'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Landmark className={`w-5 h-5 ${(summary?.balance || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              <h3 className={`text-sm font-medium ${(summary?.balance || 0) >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Total Balance</h3>
            </div>
            <p
              className={`text-3xl font-bold ${
                (summary?.balance || 0) >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}
            >
              ${summary?.balance?.toFixed(2) || '0.00'}
            </p>
          </motion.div>
        </div>

        {/* Add Buttons */}
        <div className="mb-4">
          <div className="flex gap-4 mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTransactionType('income')
                setShowAddModal(true)
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6" />
              Add Income
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTransactionType('expense')
                setShowAddModal(true)
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6" />
              Add Expense
            </motion.button>
          </div>
          {dateRange && (
            <p className="text-xl text-gray-800 mt-6 mb-6 flex items-center gap-6 ">
              <CalendarHeart className="w-6 h-6 inline-block mb-2" />
              <span>{format(dateRange.start, 'd MMM yyyy')} - {format(dateRange.end, 'd MMM yyyy')}</span>
            </p>
          )}
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Expenses Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="oklch(70.4% 0.191 22.216)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {transactions.map((transaction: any, index: number) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    index={index}
                    trackerId={trackerId}
                    userId={userId}
                    isGuest={isGuest}
                    queryClient={queryClient}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <AddTransactionModal
            trackerId={trackerId}
            type={transactionType}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            onClose={() => setShowAddModal(false)}
            userId={userId}
            isGuest={isGuest}
            queryClient={queryClient}
          />
        )}

        {/* Edit Tracker Modal */}
        {showEditModal && (
          <EditTrackerModal
            name={editName}
            icon={editIcon}
            onNameChange={setEditName}
            onIconChange={setEditIcon}
            color={editColor}
            onColorChange={setEditColor}
            onSave={() => updateTrackerMutation.mutate({ name: editName, icon: editIcon, color: editColor })}
            onCancel={() => {
              setShowEditModal(false)
              setEditName(tracker.name)
              setEditIcon(tracker.icon || 'Wallet')
              setEditColor(tracker.color || '#7dd3fc')
              setShowDeleteConfirm(false)
            }}
            onDelete={() => deleteTrackerMutation.mutate()}
            isSaving={updateTrackerMutation.isPending}
            isDeleting={deleteTrackerMutation.isPending}
            trackerName={tracker.name}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        )}
      </motion.div>
    </div>
    </div>
  )
}

function TransactionItem({
  transaction,
  index,
  trackerId,
  userId,
  isGuest,
  queryClient,
}: any) {
  const deleteMutation = useMutation({
    mutationFn: () => transactionApi.deleteTransaction(transaction.id, userId, isGuest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', trackerId, userId, isGuest] })
      queryClient.invalidateQueries({ queryKey: ['summary', trackerId, userId, isGuest] })
      queryClient.invalidateQueries({ queryKey: ['categorySpending', trackerId, userId, isGuest] })
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              transaction.type === 'income'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {transaction.type}
          </span>
          <span className="font-medium">{transaction.category_name || 'Uncategorized'}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
        </p>
        {transaction.notes && (
          <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`text-lg font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteMutation.mutate()}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

function AddTransactionModal({
  trackerId,
  type,
  incomeCategories,
  expenseCategories,
  onClose,
  userId,
  isGuest,
  queryClient,
}: any) {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [notes, setNotes] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({})

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const addMutation = useMutation({
    mutationFn: (data: any) => transactionApi.addTransaction(data, userId, isGuest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', trackerId, userId, isGuest] })
      queryClient.invalidateQueries({ queryKey: ['summary', trackerId, userId, isGuest] })
      queryClient.invalidateQueries({ queryKey: ['categorySpending', trackerId, userId, isGuest] })
      onClose()
    },
  })

  const validateForm = () => {
    const newErrors: { amount?: string; category?: string } = {}
    
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    if (!showCustomCategory && !categoryId) {
      newErrors.category = 'Please select a category'
    }
    
    if (showCustomCategory && !categoryName.trim()) {
      newErrors.category = 'Please enter a category name'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const selectedCategory = showCustomCategory
      ? null // Custom category - no ID
      : categories.find((c: any) => c.id === Number(categoryId))

    addMutation.mutate({
      tracker_id: trackerId,
      type,
      amount: Number(amount),
      category_id: showCustomCategory ? null : (categoryId ? Number(categoryId) : null),
      category_name: showCustomCategory 
        ? categoryName.trim() 
        : (selectedCategory?.name || categoryName.trim()),
      transaction_date: date,
      notes: notes.trim() || null,
    })
  }

  // Clear error when user starts typing/selecting
  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }))
    }
  }

  const handleCategoryNameChange = (value: string) => {
    setCategoryName(value)
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4">
          Add {type === 'income' ? 'Income' : 'Expense'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.amount 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-indigo-500'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            {!showCustomCategory ? (
              <>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors mb-2 ${
                    errors.category 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mb-2 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.category}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(true)
                    setCategoryId('')
                    setCategoryName('')
                    setErrors(prev => ({ ...prev, category: undefined }))
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  + Add custom category
                </button>
              </>
            ) : (
              <div>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  placeholder="Enter custom category name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors mb-2 ${
                    errors.category 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                />
                {errors.category && (
                  <p className="mb-2 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.category}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(false)
                    setCategoryName('')
                    setErrors(prev => ({ ...prev, category: undefined }))
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  ← Use existing category
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {addMutation.isPending ? 'Adding...' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function EditTrackerModal({
  name,
  icon,
  color,
  onNameChange,
  onIconChange,
  onColorChange,
  onSave,
  onCancel,
  onDelete,
  isSaving,
  isDeleting,
  trackerName,
  showDeleteConfirm,
  setShowDeleteConfirm,
}: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Tracker</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
        
        {/* Icon Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {TRACKER_ICONS.map((iconOption) => {
              const IconComponent = iconOption.component
              const isSelected = icon === iconOption.name
              return (
                <button
                  key={iconOption.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onIconChange(iconOption.name)
                  }}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer relative z-10 min-w-[48px] min-h-[48px] flex items-center justify-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-100 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${
                    isSelected ? 'text-indigo-600' : 'text-gray-600'
                  }`} />
                </button>
              )
            })}
          </div>
          
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Color
          </label>
          <div className="grid grid-cols-6 gap-2">
            {TRACKER_COLORS.map((colorOption) => {
              const isSelected = color === colorOption.value
              return (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onColorChange(colorOption.value)
                  }}
                  className={`w-10 h-10 rounded-lg border-2 transition-all cursor-pointer relative z-10 ${
                    isSelected
                      ? 'border-indigo-600 shadow-lg scale-110'
                      : 'border-gray-200 hover:border-indigo-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                />
              )
            })}
          </div>
          
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={onSave}
            disabled={isSaving || !name.trim()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Delete Section */}
        {showDeleteConfirm ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600 font-medium">
              Are you sure you want to delete "{trackerName}"? 
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Tracker
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}


