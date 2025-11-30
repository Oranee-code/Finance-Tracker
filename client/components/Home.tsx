import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import * as trackerApi from '../apis/trackers.ts'
import { useUserInfo } from '../hooks/useUserInfo.ts'
import moneyBg from '../../Image/Money BG2.jpg'
import LandingPage from './LandingPage.tsx'
import Dashboard from './Dashboard.tsx'
import AddTrackerModal from './AddTrackerModal.tsx'

export default function Home() {
  const { userId, isGuest, accessToken } = useUserInfo()
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)

  const { data: trackers = [], isLoading } = useQuery({
    queryKey: ['trackers', userId, isGuest],
    queryFn: () => trackerApi.getTrackers(userId, isGuest, accessToken),
    enabled: !!userId, // Only fetch if user is authenticated or is a guest
  })

  const addMutation = useMutation({
    mutationFn: ({ name, icon, color }: { name: string; icon: string; color: string }) => 
      trackerApi.addTracker(name, userId, isGuest, icon, color, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackers', userId, isGuest] })
      setShowAddModal(false)
    },
  })

  const handleAddTracker = (name: string, icon: string, color: string) => {
    addMutation.mutate({ name, icon, color })
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
        {trackers.length === 0 ? (
          <LandingPage onCreateTracker={() => setShowAddModal(true)} />
        ) : (
          <Dashboard 
            trackers={trackers}
            userId={userId}
            isGuest={isGuest}
            accessToken={accessToken}
            onAddTracker={() => setShowAddModal(true)}
          />
        )}

        {/* Add Tracker Modal */}
        <AddTrackerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTracker}
          isLoading={addMutation.isPending}
        />
      </div>
    </div>
  )
}
