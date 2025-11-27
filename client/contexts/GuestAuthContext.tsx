import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface GuestUser {
  id: string
  name: string
  email: string
  isGuest: true
  createdAt: number
}

interface GuestAuthContextType {
  isGuest: boolean
  guestUser: GuestUser | null
  hasPreviousGuestData: boolean
  signInAsGuest: (restorePrevious?: boolean) => void
  signOutGuest: () => void
  clearGuestData: () => void
  updateGuestName: (name: string) => void
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(
  undefined,
)

// Persistent guest ID key - never deleted
const GUEST_ID_KEY = 'financeTracker_guestId'
// Guest data key - stores all guest data
const GUEST_DATA_KEY = 'financeTracker_guestData'
// Active session key - cleared on logout
const GUEST_SESSION_KEY = 'financeTracker_guestSession'

export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(false)
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null)

  // Load guest state from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(GUEST_SESSION_KEY)
    const storedGuestData = localStorage.getItem(GUEST_DATA_KEY)
    
    // Restore active session if exists
    if (storedSession === 'true' && storedGuestData) {
      try {
        const guest = JSON.parse(storedGuestData)
        setIsGuest(true)
        setGuestUser(guest)
      } catch (e) {
        console.error('Error parsing guest data:', e)
      }
    }
  }, [])

  // Check if there's previous guest data
  const hasPreviousGuestData = () => {
    const guestId = localStorage.getItem(GUEST_ID_KEY)
    const guestData = localStorage.getItem(GUEST_DATA_KEY)
    return !!(guestId && guestData)
  }

  const signInAsGuest = (restorePrevious = true) => {
    let guest: GuestUser

    // Check if there's previous guest data to restore
    if (restorePrevious && hasPreviousGuestData()) {
      const storedData = localStorage.getItem(GUEST_DATA_KEY)
      if (storedData) {
        try {
          guest = JSON.parse(storedData)
          // Update the guest object to mark as active
          guest = { ...guest }
        } catch (e) {
          // If parsing fails, create new guest
          guest = createNewGuest()
        }
      } else {
        guest = createNewGuest()
      }
    } else {
      // Create new guest
      guest = createNewGuest()
    }

    setGuestUser(guest)
    setIsGuest(true)
    
    // Store persistent guest ID (never deleted)
    if (!localStorage.getItem(GUEST_ID_KEY)) {
      localStorage.setItem(GUEST_ID_KEY, guest.id)
    }
    
    // Store guest data (persists across sessions)
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(guest))
    
    // Store active session (cleared on logout)
    localStorage.setItem(GUEST_SESSION_KEY, 'true')
  }

  const createNewGuest = (): GuestUser => {
    const guestId = localStorage.getItem(GUEST_ID_KEY) || `guest-${Date.now()}`
    return {
      id: guestId,
      name: 'Guest User',
      email: 'guest@example.com',
      isGuest: true,
      createdAt: Date.now(),
    }
  }

  const signOutGuest = () => {
    // Only clear the active session, keep the data
    setGuestUser(null)
    setIsGuest(false)
    localStorage.removeItem(GUEST_SESSION_KEY)
    // Keep GUEST_ID_KEY and GUEST_DATA_KEY for future restoration
  }

  const clearGuestData = () => {
    // Permanently delete all guest data
    setGuestUser(null)
    setIsGuest(false)
    localStorage.removeItem(GUEST_SESSION_KEY)
    localStorage.removeItem(GUEST_ID_KEY)
    localStorage.removeItem(GUEST_DATA_KEY)
  }

  const updateGuestName = (name: string) => {
    if (!guestUser) return
    
    const updatedGuest: GuestUser = {
      ...guestUser,
      name: name.trim() || 'Guest User',
    }
    
    setGuestUser(updatedGuest)
    // Update stored guest data
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(updatedGuest))
  }

  return (
    <GuestAuthContext.Provider
      value={{
        isGuest,
        guestUser,
        hasPreviousGuestData: hasPreviousGuestData(),
        signInAsGuest,
        signOutGuest,
        clearGuestData,
        updateGuestName,
      }}
    >
      {children}
    </GuestAuthContext.Provider>
  )
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext)
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider')
  }
  return context
}

