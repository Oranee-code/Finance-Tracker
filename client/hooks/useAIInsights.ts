import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import * as trackerApi from '../apis/trackers.ts'
import * as transactionApi from '../apis/transactions.ts'
import { generateInsights, Insight } from '../utils/aiInsights.ts'

interface TrackerData {
  id: number
  name: string
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
  categorySpending: Array<{
    category_name: string
    total: number
  }>
}

export function useAIInsights(userId: string, isGuest: boolean) {
  const queryClient = useQueryClient()

  // Fetch all trackers
  const { data: trackers = [], isLoading: trackersLoading } = useQuery({
    queryKey: ['trackers', userId, isGuest],
    queryFn: () => trackerApi.getTrackers(userId, isGuest),
    enabled: !!userId,
  })

  // Fetch all tracker data in parallel
  const { data: allTrackerData, isLoading: dataLoading } = useQuery({
    queryKey: ['aiInsightsData', trackers.map((t: any) => t.id).join(','), userId, isGuest],
    queryFn: async () => {
      if (trackers.length === 0) return []

      const promises = trackers.map(async (tracker: any) => {
        const [summary, categorySpending] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['summary', tracker.id, userId, isGuest],
            queryFn: () => transactionApi.getTransactionSummary(tracker.id, userId, isGuest),
          }),
          queryClient.fetchQuery({
            queryKey: ['categorySpending', tracker.id, userId, isGuest],
            queryFn: () => transactionApi.getCategorySpending(tracker.id, userId, isGuest),
          }),
        ])

        return {
          id: tracker.id,
          name: tracker.name,
          summary: {
            totalIncome: summary?.totalIncome || 0,
            totalExpenses: summary?.totalExpenses || 0,
            balance: summary?.balance || 0,
          },
          categorySpending: categorySpending || [],
        }
      })

      return Promise.all(promises)
    },
    enabled: !!userId && trackers.length > 0,
  })

  // Aggregate all category spending
  const allCategorySpending = useMemo(() => {
    if (!allTrackerData) return []
    const categoryMap: { [key: string]: number } = {}
    allTrackerData.forEach((tracker) => {
      tracker.categorySpending.forEach((cat: { category_name: string; total: number }) => {
        const name = cat.category_name || 'Uncategorized'
        categoryMap[name] = (categoryMap[name] || 0) + Number(cat.total)
      })
    })
    return Object.entries(categoryMap).map(([category_name, total]) => ({
      category_name,
      total,
    }))
  }, [allTrackerData])

  // Generate insights
  const insights: Insight[] = useMemo(() => {
    if (!allTrackerData || allTrackerData.length === 0) return []
    return generateInsights(allTrackerData, allCategorySpending)
  }, [allTrackerData, allCategorySpending])

  const isLoading = trackersLoading || dataLoading

  return {
    insights,
    isLoading,
    trackerData: allTrackerData || [],
  }
}

