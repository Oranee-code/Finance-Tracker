// AI Insights utility for analyzing spending patterns and generating suggestions

export interface Insight {
  id: string
  type: 'warning' | 'suggestion' | 'info' | 'success'
  title: string
  message: string
  trackerId?: number
  trackerName?: string
  category?: string
  percentage?: number
  priority: 'high' | 'medium' | 'low'
}

interface CategorySpending {
  category_name: string
  total: number
}

interface TrackerData {
  id: number
  name: string
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
  categorySpending: CategorySpending[]
}

// Category keywords for pattern matching
const CATEGORY_KEYWORDS: { [key: string]: string[] } = {
  'housing': ['housing', 'rent', 'mortgage', 'home', 'apartment', 'lease', 'property', 'housing', 'residence'],
  'groceries': ['grocery', 'supermarket', 'food', 'groceries', 'grocery store', 'market'],
  'eating_out': ['eating out', 'restaurant', 'dining', 'food delivery', 'takeout', 'fast food', 'dine out', 'eating'],
  'transportation': ['transport', 'gas', 'fuel', 'petrol', 'diesel', 'uber', 'taxi', 'lyft', 'public transport', 'car', 'vehicle', 'parking', 'tolls', 'auto', 'automotive', 'commute', 'bus', 'train', 'subway', 'metro', 'transportation'],
  'utilities': ['utilities', 'bills', 'electricity', 'water', 'utility', 'electric', 'power', 'gas bill', 'water bill'],
  'phone_internet': ['phone', 'internet', 'mobile', 'cellular', 'telephone', 'wifi', 'broadband', 'data plan', 'phone bill', 'internet bill'],
  'shopping': ['shopping', 'clothes', 'fashion', 'retail', 'misc', 'miscellaneous', 'store', 'purchase'],
  'entertainment': ['entertainment', 'movies', 'games', 'streaming', 'netflix', 'spotify', 'hulu', 'disney', 'theater', 'cinema', 'concert', 'show'],
  'coffee': ['coffee', 'cafe', 'coffee shop', 'espresso', 'latte', 'cappuccino', 'starbucks', 'tim hortons'],
  'subscriptions': ['subscription', 'subscriptions', 'membership', 'memberships', 'monthly subscription', 'annual subscription', 'recurring'],
  'health_medical': ['health', 'medical', 'doctor', 'hospital', 'pharmacy', 'medicine', 'medication', 'dental', 'healthcare', 'medical bill'],
  'education': ['education', 'school', 'tuition', 'course', 'training', 'learning', 'university', 'college', 'student'],
  'insurance': ['insurance', 'health insurance', 'car insurance', 'life insurance', 'home insurance', 'auto insurance', 'premium'],
  'debt_payments': ['debt', 'loan', 'credit card', 'payment', 'repayment', 'installment', 'debt payment', 'loan payment'],
  'household_supplies': ['household', 'supplies', 'cleaning', 'detergent', 'toilet paper', 'paper towels', 'household items'],
  'pets': ['pet', 'pets', 'dog', 'cat', 'veterinary', 'vet', 'pet food', 'pet care', 'animal'],
  'gifts_donations': ['gift', 'gifts', 'donation', 'donations', 'charity', 'charitable', 'giving', 'present'],
  'travel': ['travel', 'trip', 'vacation', 'hotel', 'flight', 'airline', 'tourism', 'traveling', 'holiday'],
  'personal_care': ['personal care', 'personal', 'haircut', 'salon', 'spa', 'beauty', 'cosmetics', 'toiletries', 'hygiene'],
  'repairs_maintenance': ['repair', 'repairs', 'maintenance', 'fix', 'fixing', 'upkeep', 'service', 'servicing'],
  'saving': ['saving', 'savings', 'save', 'investment', 'invest', 'deposit', 'emergency fund', 'retirement', 'investments'],
}

// Recommended spending percentages based on income
interface CategoryRecommendation {
  min: number
  max: number
  name: string
}

const CATEGORY_RECOMMENDATIONS: { [key: string]: CategoryRecommendation } = {
  'housing': { min: 25, max: 30, name: 'Housing / Rent / Mortgage' },
  'groceries': { min: 10, max: 15, name: 'Groceries / Food' },
  'eating_out': { min: 5, max: 10, name: 'Eating Out' },
  'transportation': { min: 5, max: 10, name: 'Transportation' },
  'utilities': { min: 5, max: 10, name: 'Utilities / Bills' },
  'phone_internet': { min: 2, max: 5, name: 'Phone & Internet' },
  'shopping': { min: 5, max: 10, name: 'Shopping' },
  'entertainment': { min: 5, max: 8, name: 'Entertainment' },
  'coffee': { min: 1, max: 3, name: 'Coffee' },
  'subscriptions': { min: 1, max: 3, name: 'Subscriptions' },
  'health_medical': { min: 2, max: 5, name: 'Health/Medical' },
  'education': { min: 2, max: 5, name: 'Education' },
  'insurance': { min: 5, max: 10, name: 'Insurance' },
  'debt_payments': { min: 5, max: 15, name: 'Debt Payments' },
  'household_supplies': { min: 2, max: 5, name: 'Household Supplies' },
  'pets': { min: 1, max: 3, name: 'Pets' },
  'gifts_donations': { min: 1, max: 5, name: 'Gifts/Donations' },
  'travel': { min: 5, max: 10, name: 'Travel' },
  'personal_care': { min: 2, max: 5, name: 'Personal Care' },
  'repairs_maintenance': { min: 1, max: 3, name: 'Repairs/Maintenance' },
  'saving': { min: 20, max: 30, name: 'Savings/Investments' },
}

// Category status type
type CategoryStatus = 'high' | 'normal' | 'low'

interface CategoryAnalysis {
  categoryType: string
  categoryName: string
  total: number
  percentage: number
  status: CategoryStatus
  recommendation: CategoryRecommendation
}

// Analyze all categories and determine their status (high/normal/low)
function analyzeCategoryBudgets(
  totalIncome: number,
  categorySpending: CategorySpending[],
  categoryTotals?: { [key: string]: number }
): CategoryAnalysis[] {
  const analysis: CategoryAnalysis[] = []
  
  if (totalIncome <= 0) return analysis

  // Use provided categoryTotals or calculate from categorySpending
  const totals = categoryTotals || Object.fromEntries(
    categorySpending.map(cat => [cat.category_name?.toLowerCase() || 'uncategorized', Number(cat.total)])
  )

  // Analyze each category type
  Object.entries(CATEGORY_RECOMMENDATIONS).forEach(([categoryType, recommendation]) => {
    const keywords = CATEGORY_KEYWORDS[categoryType] || []
    const matchedCategories = findCategoriesByKeywords(totals, keywords)
    const total = matchedCategories.reduce((sum, cat) => sum + (totals[cat] || 0), 0)
    
    if (total > 0) {
      const percentage = (total / totalIncome) * 100
      const categoryName = matchedCategories[0] || recommendation.name
      
      let status: CategoryStatus = 'normal'
      if (percentage > recommendation.max) {
        status = 'high'
      } else if (percentage < recommendation.min) {
        status = 'low'
      }

      analysis.push({
        categoryType,
        categoryName,
        total,
        percentage,
        status,
        recommendation,
      })
    }
  })

  return analysis
}

// Generate budget insights based on category analysis
function generateBudgetInsights(
  totalIncome: number,
  categoryAnalysis: CategoryAnalysis[],
  trackerId?: number,
  trackerName?: string
): Insight[] {
  const insights: Insight[] = []
  
  if (categoryAnalysis.length === 0) return insights

  // Count categories by status
  const highCategories = categoryAnalysis.filter(cat => cat.status === 'high')
  const lowCategories = categoryAnalysis.filter(cat => cat.status === 'low' && cat.categoryType !== 'saving')
  const normalCategories = categoryAnalysis.filter(cat => cat.status === 'normal')

  // Generate insights for high categories (overspending)
  highCategories.forEach((analysis) => {
    const excess = analysis.percentage - analysis.recommendation.max
    const excessAmount = (excess / 100) * totalIncome
    
    let priority: 'high' | 'medium' = 'medium'
    if (analysis.percentage > analysis.recommendation.max * 1.5) {
      priority = 'high'
    }

    insights.push({
      id: `budget-${analysis.categoryType}-high-${trackerId || 'all'}`,
      type: 'warning',
      title: `${analysis.recommendation.name} Spending is High`,
      message: `You're spending $${analysis.total.toFixed(2)} (${analysis.percentage.toFixed(1)}% of income) on ${analysis.recommendation.name.toLowerCase()}, which exceeds the recommended ${analysis.recommendation.max}%. Recommended range is ${analysis.recommendation.min}-${analysis.recommendation.max}% of income. You're spending ${excess.toFixed(1)}% more than recommended, which is approximately $${excessAmount.toFixed(2)} extra per month. Consider reducing spending in this category to improve your budget balance.`,
      trackerId,
      trackerName,
      category: analysis.categoryName,
      percentage: analysis.percentage,
      priority,
    })
  })

  // Generate insights for normal categories (good budgeting)
  if (normalCategories.length > 0 && highCategories.length === 0) {
    // Only show positive feedback if there are no high categories
    const topNormalCategory = normalCategories.sort((a, b) => b.percentage - a.percentage)[0]
    if (topNormalCategory && topNormalCategory.categoryType !== 'saving') {
      insights.push({
        id: `budget-${topNormalCategory.categoryType}-normal-${trackerId || 'all'}`,
        type: 'success',
        title: `Good ${topNormalCategory.recommendation.name} Budgeting`,
        message: `You're spending $${topNormalCategory.total.toFixed(2)} (${topNormalCategory.percentage.toFixed(1)}% of income) on ${topNormalCategory.recommendation.name.toLowerCase()}, which is within the recommended ${topNormalCategory.recommendation.min}-${topNormalCategory.recommendation.max}% range. Great job maintaining a balanced budget!`,
        trackerId,
        trackerName,
        category: topNormalCategory.categoryName,
        percentage: topNormalCategory.percentage,
        priority: 'low',
      })
    }
  }

  // Generate insights for low categories (good discipline, but only if not many high categories)
  if (lowCategories.length > 0 && highCategories.length <= 1) {
    const wellBelowCategories = lowCategories.filter(
      cat => cat.percentage < cat.recommendation.min * 0.7
    )
    
    if (wellBelowCategories.length > 0) {
      const topLowCategory = wellBelowCategories.sort((a, b) => a.percentage - b.percentage)[0]
      insights.push({
        id: `budget-${topLowCategory.categoryType}-low-${trackerId || 'all'}`,
        type: 'success',
        title: `Excellent ${topLowCategory.recommendation.name} Management!`,
        message: `You're spending $${topLowCategory.total.toFixed(2)} (${topLowCategory.percentage.toFixed(1)}% of income) on ${topLowCategory.recommendation.name.toLowerCase()}, which is well below the recommended ${topLowCategory.recommendation.min}-${topLowCategory.recommendation.max}% range. This shows excellent financial discipline and leaves more room for savings!`,
        trackerId,
        trackerName,
        category: topLowCategory.categoryName,
        percentage: topLowCategory.percentage,
        priority: 'low',
      })
    }
  }

  // Overall budget summary insight
  if (highCategories.length >= 3) {
    insights.push({
      id: `budget-summary-multiple-high-${trackerId || 'all'}`,
      type: 'warning',
      title: 'Multiple Categories Over Budget',
      message: `You have ${highCategories.length} categories exceeding recommended spending ranges. This indicates overspending across multiple areas. Consider reviewing your budget priorities and reducing expenses in high-spending categories to improve your overall financial health.`,
      trackerId,
      trackerName,
      priority: 'high',
    })
  } else if (highCategories.length === 0 && normalCategories.length >= 3) {
    insights.push({
      id: `budget-summary-good-${trackerId || 'all'}`,
      type: 'success',
      title: 'Excellent Budget Management!',
      message: `Great job! Most of your spending categories are within recommended ranges. You're demonstrating strong budgeting habits and financial discipline. Keep up the excellent work!`,
      trackerId,
      trackerName,
      priority: 'low',
    })
  }

  return insights
}

// Generate insights for a single tracker
export function generateTrackerInsights(
  tracker: TrackerData,
  categorySpending: CategorySpending[]
): Insight[] {
  const insights: Insight[] = []

  if (!tracker || !tracker.summary) {
    return insights
  }

  const { totalIncome, totalExpenses, balance } = tracker.summary

  // Need income to calculate percentages
  if (totalIncome <= 0) {
    return insights
  }

  // Perform comprehensive budget analysis
  const categoryAnalysis = analyzeCategoryBudgets(totalIncome, categorySpending)
  const budgetInsights = generateBudgetInsights(
    totalIncome,
    categoryAnalysis,
    tracker.id,
    tracker.name
  )
  insights.push(...budgetInsights)

  // Helper function to find categories by type and calculate total
  const getCategoryTotal = (categoryType: string): { total: number; categories: string[] } => {
    const keywords = CATEGORY_KEYWORDS[categoryType] || []
    const categoryMap = Object.fromEntries(
      categorySpending.map(cat => [cat.category_name?.toLowerCase() || 'uncategorized', Number(cat.total)])
    )
    const matchedCategories = findCategoriesByKeywords(categoryMap, keywords)
    const total = matchedCategories.reduce((sum, catName) => {
      const cat = categorySpending.find(c => c.category_name?.toLowerCase() === catName)
      return sum + (cat ? Number(cat.total) : 0)
    }, 0)
    return { total, categories: matchedCategories }
  }

  // Analyze each category type based on income
  Object.entries(CATEGORY_RECOMMENDATIONS).forEach(([categoryType, recommendation]) => {
    const { total, categories } = getCategoryTotal(categoryType)
    
    if (total > 0) {
      const percentageOfIncome = (total / totalIncome) * 100
      const categoryName = categories[0] || recommendation.name

      // Check if exceeds recommended maximum
      if (percentageOfIncome > recommendation.max) {
        const excess = percentageOfIncome - recommendation.max
        const excessAmount = (excess / 100) * totalIncome
        
        let priority: 'high' | 'medium' = 'medium'
        if (percentageOfIncome > recommendation.max * 1.5) {
          priority = 'high'
        }

        insights.push({
          id: `${categoryType}-exceeds-${tracker.id}`,
          type: 'warning',
          title: `${recommendation.name} Exceeds Recommendation`,
          message: `You're spending $${total.toFixed(2)} (${percentageOfIncome.toFixed(1)}% of income) on ${recommendation.name.toLowerCase()}, which exceeds the recommended ${recommendation.max}%. Recommended range is ${recommendation.min}-${recommendation.max}% of income. You're spending ${excess.toFixed(1)}% more than recommended, which is approximately $${excessAmount.toFixed(2)} extra per month.`,
          trackerId: tracker.id,
          trackerName: tracker.name,
          category: categoryName,
          percentage: percentageOfIncome,
          priority: priority,
        })
      }
      // Check if well below recommended minimum (positive feedback)
      else if (percentageOfIncome < recommendation.min * 0.7 && categoryType !== 'saving') {
        // For non-savings categories, being well below is good (except savings)
        insights.push({
          id: `${categoryType}-below-${tracker.id}`,
          type: 'success',
          title: `Great ${recommendation.name} Management!`,
          message: `You're spending $${total.toFixed(2)} (${percentageOfIncome.toFixed(1)}% of income) on ${recommendation.name.toLowerCase()}, which is well below the recommended ${recommendation.min}-${recommendation.max}% range. This shows excellent financial discipline and leaves more room for savings!`,
          trackerId: tracker.id,
          trackerName: tracker.name,
          category: categoryName,
          percentage: percentageOfIncome,
          priority: 'low',
        })
      }
      // Check if within recommended range (positive feedback)
      else if (percentageOfIncome >= recommendation.min && percentageOfIncome <= recommendation.max) {
        insights.push({
          id: `${categoryType}-optimal-${tracker.id}`,
          type: 'success',
          title: `Optimal ${recommendation.name} Spending`,
          message: `You're spending $${total.toFixed(2)} (${percentageOfIncome.toFixed(1)}% of income) on ${recommendation.name.toLowerCase()}, which is within the recommended ${recommendation.min}-${recommendation.max}% range. Great job maintaining a balanced budget!`,
          trackerId: tracker.id,
          trackerName: tracker.name,
          category: categoryName,
          percentage: percentageOfIncome,
          priority: 'low',
        })
      }
    }
  })

  // Special handling for savings - positive reinforcement
  const savingsData = getCategoryTotal('saving')
  if (savingsData.total > 0) {
    const savingsPercentage = (savingsData.total / totalIncome) * 100
    const savingsCategoryName = savingsData.categories[0] || 'Savings'
    
    let message = ''
    if (savingsPercentage >= 30) {
      message = `Outstanding! You're saving $${savingsData.total.toFixed(2)} (${savingsPercentage.toFixed(1)}% of income).
      This exceeds the recommended 20%+ and shows exceptional financial discipline! 🎉`
    } else if (savingsPercentage >= 20) {
      message = `Excellent! You're saving $${savingsData.total.toFixed(2)} (${savingsPercentage.toFixed(1)}% of income),
      which meets the recommended 20%+ savings rate. Keep building your financial future! 💪`
    } else if (savingsPercentage >= 10) {
      message = `Good progress! You're saving $${savingsData.total.toFixed(2)} (${savingsPercentage.toFixed(1)}% of income).
      Aim for 20%+ to build a strong financial foundation. Every dollar counts! ✨`
    } else {
      message = `You're saving $${savingsData.total.toFixed(2)} (${savingsPercentage.toFixed(1)}% of income). 
      Consider increasing savings to reach the recommended 20%+ of income for better financial security. 🌟`
    }

    insights.push({
      id: `saving-positive-${tracker.id}`,
      type: savingsPercentage >= 20 ? 'success' : 'suggestion',
      title: 'Savings Analysis',
      message: message,
      trackerId: tracker.id,
      trackerName: tracker.name,
      category: savingsCategoryName,
      percentage: savingsPercentage,
      priority: savingsPercentage >= 20 ? 'low' : 'medium',
    })
  } else {
    // No savings - suggest starting
    insights.push({
      id: `saving-missing-${tracker.id}`,
      type: 'suggestion',
      title: 'Start Building Savings',
      message: `You're not currently tracking savings. Financial experts recommend saving at least 20% of your income ($${(totalIncome * 0.2).toFixed(2)} 
      based on your current income). Start small and build the habit!`,
      trackerId: tracker.id,
      trackerName: tracker.name,
      percentage: 0,
      priority: 'medium',
    })
  }

  // Insight: Negative balance warning
  if (balance < 0) {
    insights.push({
      id: `negative-balance-${tracker.id}`,
      type: 'warning',
      title: 'Negative Balance Alert',
      message: `Your balance in "${tracker.name}" is negative ($${Math.abs(balance).toFixed(2)}). You're spending more than you're earning.
      Consider reviewing your expenses and finding areas to cut back. This is not sustainable and will lead to financial problems.`,
      trackerId: tracker.id,
      trackerName: tracker.name,
      percentage: Math.abs((balance / totalIncome) * 100),
      priority: 'high',
    })
  } else if (balance > 0 && totalIncome > 0) {
    // Positive: Positive balance
    const savingsRate = (balance / totalIncome) * 100
    let message = ''
    if (savingsRate >= 30) {
      message = `Outstanding! You have a positive balance of $${balance.toFixed(2)} and are saving ${savingsRate.toFixed(1)}% of your income.
      This is exceptional financial management! 🎉`
    } else if (savingsRate >= 20) {
      message = `Excellent work! You have a positive balance of $${balance.toFixed(2)} and are saving ${savingsRate.toFixed(1)}% of your income.
      You're building a strong financial foundation! 💪`
    } else if (savingsRate >= 10) {
      message = `Great job! You have a positive balance of $${balance.toFixed(2)} and are saving ${savingsRate.toFixed(1)}% of your income. Keep up the good financial habits! ✨`
    } else {
      message = `Good progress! You have a positive balance of $${balance.toFixed(2)}. Every dollar saved counts toward your financial goals! 🌟`
    }
    
    insights.push({
      id: `positive-balance-${tracker.id}`,
      type: 'success',
      title: 'Positive Balance',
      message: message,
      trackerId: tracker.id,
      trackerName: tracker.name,
      percentage: savingsRate,
      priority: 'low',
    })
  }

  // Insight: Total expense ratio
  const expenseRatio = (totalExpenses / totalIncome) * 100
  const savingsTotal = savingsData.total
  const expensesWithoutSavings = totalExpenses - savingsTotal
  const expenseRatioWithoutSavings = (expensesWithoutSavings / totalIncome) * 100
  const savingPercentage = totalIncome > 0 ? (savingsTotal / totalIncome) * 100 : 0
  const hasSignificantSavings = savingsTotal > 0 && savingPercentage >= 20
  
  if (expenseRatio > 90 && !hasSignificantSavings) {
    insights.push({
      id: `expense-ratio-high-${tracker.id}`,
      type: 'warning',
      title: 'High Expense Ratio',
      message: `Your total expenses are ${expenseRatio.toFixed(1)}% of your income ($${totalExpenses.toFixed(2)}).
      This leaves little room for savings. Consider reducing discretionary spending to build a financial buffer.`,
      trackerId: tracker.id,
      trackerName: tracker.name,
      percentage: expenseRatio,
      priority: 'high',
    })
  } else if (expenseRatio < 50 && !hasSignificantSavings) {
    insights.push({
      id: `expense-ratio-good-${tracker.id}`,
      type: 'success',
      title: 'Great Savings Rate!',
      message: `Your total expenses are only ${expenseRatio.toFixed(1)}% of your income ($${totalExpenses.toFixed(2)}). Excellent job maintaining a healthy savings rate!`,
      trackerId: tracker.id,
      trackerName: tracker.name,
      percentage: expenseRatio,
      priority: 'low',
    })
  }

  // Insight: Spending exceeds income
  if (totalExpenses > totalIncome * 1.1) {
    insights.push({
      id: `income-expense-mismatch-${tracker.id}`,
      type: 'warning',
      title: 'Spending Exceeds Income',
      message: `Your expenses ($${totalExpenses.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}) by $${(totalExpenses - totalIncome).toFixed(2)}.
      This is unsustainable. Consider increasing income or reducing expenses. This will lead to financial problems.`,
      trackerId: tracker.id,
      trackerName: tracker.name,
      priority: 'high',
    })
  }

  // Sort insights by priority (high first, then by percentage)
  const sortedInsights = insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    // Prioritize warnings and suggestions over success messages
    const typeOrder = { warning: 3, suggestion: 2, info: 1, success: 0 }
    
    // First sort by priority
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    // Then by type (warnings first)
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[b.type] - typeOrder[a.type]
    }
    
    // Finally by percentage
    return (b.percentage || 0) - (a.percentage || 0)
  })

  // Return only the top 1-2 most important insights
  // Strategy: Balance warnings with positive reinforcement
  const positiveInsights = sortedInsights.filter(insight => insight.type === 'success' || insight.type === 'info')
  const warningInsights = sortedInsights.filter(insight => insight.type === 'warning')
  const suggestionInsights = sortedInsights.filter(insight => insight.type === 'suggestion')
  
  const result: Insight[] = []
  
  // Always include highest priority warning if exists
  if (warningInsights.length > 0) {
    result.push(warningInsights[0])
  }
  
  // If we have room and positive insights exist, include one for encouragement
  if (result.length < 2 && positiveInsights.length > 0) {
    result.push(positiveInsights[0])
  }
  
  // If still have room, add a suggestion
  if (result.length < 2 && suggestionInsights.length > 0) {
    result.push(suggestionInsights[0])
  }
  
  // If no warnings but have positive insights, show those (user is doing well!)
  if (result.length === 0 && positiveInsights.length > 0) {
    return positiveInsights.slice(0, 2)
  }
  
  return result.slice(0, 2)
}

// Generate insights based on spending patterns (for multiple trackers)
export function generateInsights(
  trackers: TrackerData[],
  allCategorySpending: CategorySpending[]
): Insight[] {
  const insights: Insight[] = []

  if (trackers.length === 0) {
    return insights
  }

  // Calculate total income and expenses across all trackers
  const totalIncome = trackers.reduce((sum, t) => sum + (t.summary.totalIncome || 0), 0)
  const totalExpenses = trackers.reduce((sum, t) => sum + (t.summary.totalExpenses || 0), 0)
  const totalBalance = totalIncome - totalExpenses

  if (totalIncome <= 0) {
    return insights
  }

  // Calculate total spending by category across all trackers
  const categoryTotals: { [key: string]: number } = {}
  allCategorySpending.forEach((cat) => {
    const name = cat.category_name?.toLowerCase() || 'uncategorized'
    categoryTotals[name] = (categoryTotals[name] || 0) + Number(cat.total)
  })

  // Perform comprehensive budget analysis across all trackers
  const categoryAnalysis = analyzeCategoryBudgets(totalIncome, allCategorySpending, categoryTotals)
  const budgetInsights = generateBudgetInsights(totalIncome, categoryAnalysis)
  insights.push(...budgetInsights)

  // Analyze each category type based on income
  Object.entries(CATEGORY_RECOMMENDATIONS).forEach(([categoryType, recommendation]) => {
    const keywords = CATEGORY_KEYWORDS[categoryType] || []
    const matchedCategories = findCategoriesByKeywords(categoryTotals, keywords)
    const total = matchedCategories.reduce((sum, cat) => sum + categoryTotals[cat], 0)
    
    if (total > 0) {
      const percentageOfIncome = (total / totalIncome) * 100
      const categoryName = matchedCategories[0] || recommendation.name

      // Check if exceeds recommended maximum
      if (percentageOfIncome > recommendation.max) {
        const excess = percentageOfIncome - recommendation.max
        const excessAmount = (excess / 100) * totalIncome
        const tracker = findTrackerWithCategory(trackers, matchedCategories[0])
        
        let priority: 'high' | 'medium' = 'medium'
        if (percentageOfIncome > recommendation.max * 1.5) {
          priority = 'high'
        }

        insights.push({
          id: `${categoryType}-exceeds-all`,
          type: 'warning',
          title: `${recommendation.name} Exceeds Recommendation`,
          message: `You're spending $${total.toFixed(2)} (${percentageOfIncome.toFixed(1)}% of income) 
          on ${recommendation.name.toLowerCase()}, 
          which exceeds the recommended ${recommendation.max}%. 
          Recommended range is ${recommendation.min}-${recommendation.max}% of income. 
          You're spending ${excess.toFixed(1)}% more than recommended.`,
          trackerId: tracker?.id,
          trackerName: tracker?.name,
          category: categoryName,
          percentage: percentageOfIncome,
          priority: priority,
        })
      }
    }
  })

  // Insight: Negative balance warning
  if (totalBalance < 0) {
    insights.push({
      id: 'negative-balance',
      type: 'warning',
      title: 'Negative Balance Alert',
      message: `Your total balance is negative ($${Math.abs(totalBalance).toFixed(2)}).
       You're spending more than you're earning. Consider reviewing your expenses and finding areas to cut back.`,
      percentage: Math.abs((totalBalance / totalIncome) * 100),
      priority: 'high',
    })
  }

  // Insight: Total expense ratio
  const expenseRatio = (totalExpenses / totalIncome) * 100
  if (expenseRatio > 90) {
    insights.push({
      id: 'expense-ratio-high',
      type: 'warning',
      title: 'High Expense Ratio',
      message: `Your total expenses are ${expenseRatio.toFixed(1)}% of your income. This leaves little room for savings. Consider reducing discretionary spending to build a financial buffer.`,
      percentage: expenseRatio,
      priority: 'high',
    })
  }

  // Insight: Spending exceeds income
  if (totalExpenses > totalIncome * 1.1) {
    insights.push({
      id: 'income-expense-mismatch',
      type: 'warning',
      title: 'Spending Exceeds Income',
      message: `Your expenses ($${totalExpenses.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}) by $${(totalExpenses - totalIncome).toFixed(2)}. This is unsustainable. Consider increasing income or reducing expenses.`,
      priority: 'high',
    })
  }

  // Sort insights by priority (high first, then by percentage)
  const sortedInsights = insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const typeOrder = { warning: 3, suggestion: 2, info: 1, success: 0 }
    
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[b.type] - typeOrder[a.type]
    }
    
    return (b.percentage || 0) - (a.percentage || 0)
  })

  // Return only the top 1-2 most important insights
  const positiveInsights = sortedInsights.filter(insight => insight.type === 'success' || insight.type === 'info')
  const warningInsights = sortedInsights.filter(insight => insight.type === 'warning')
  const suggestionInsights = sortedInsights.filter(insight => insight.type === 'suggestion')
  
  const result: Insight[] = []
  
  if (warningInsights.length > 0) {
    result.push(warningInsights[0])
  }
  
  if (result.length < 2 && positiveInsights.length > 0) {
    result.push(positiveInsights[0])
  }
  
  if (result.length < 2 && suggestionInsights.length > 0) {
    result.push(suggestionInsights[0])
  }
  
  if (result.length === 0 && positiveInsights.length > 0) {
    return positiveInsights.slice(0, 2)
  }
  
  return result.slice(0, 2)
}

// Helper function to find categories by keywords
function findCategoriesByKeywords(
  categoryTotals: { [key: string]: number },
  keywords: string[]
): string[] {
  return Object.keys(categoryTotals).filter((catName) => {
    const lowerCatName = catName.toLowerCase()
    // Remove emojis and special characters for better matching
    const cleanCatName = lowerCatName.replace(/[^\w\s]/g, '').trim()
    return keywords.some((keyword) => {
      const lowerKeyword = keyword.toLowerCase()
      return lowerCatName.includes(lowerKeyword) || cleanCatName.includes(lowerKeyword)
    })
  })
}

// Helper function to find tracker with a specific category
function findTrackerWithCategory(trackers: TrackerData[], categoryName: string): TrackerData | undefined {
  return trackers.find((tracker) =>
    tracker.categorySpending.some(
      (cat) => cat.category_name?.toLowerCase() === categoryName.toLowerCase()
    )
  )
}

// Helper function to get category type
function getCategoryType(categoryName: string): string {
  const lowerName = categoryName.toLowerCase()
  // Remove emojis and special characters for better matching
  const cleanName = lowerName.replace(/[^\w\s]/g, '').trim()
  for (const [type, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => {
      const lowerKeyword = keyword.toLowerCase()
      return lowerName.includes(lowerKeyword) || cleanName.includes(lowerKeyword)
    })) {
      return type
    }
  }
  return 'other'
}
