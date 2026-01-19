import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import superagent from 'superagent'

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const res = await superagent.get('/api/v1/auth/me')
      setUser(res.body.user)
    } catch (err) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await superagent
      .post('/api/v1/auth/login')
      .send({ email, password })
    
    setUser(res.body.user)
  }

  const register = async (email: string, password: string, name: string) => {
    const res = await superagent
      .post('/api/v1/auth/register')
      .send({ email, password, name })
    
    setUser(res.body.user)
  }

  const logout = async () => {
    try {
      await superagent.post('/api/v1/auth/logout')
    } catch (err) {
      // Ignore errors on logout
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

