"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/lib/types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateProfile: (data: Partial<User>) => void
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('financeflow_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('financeflow_user')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulate API call - in real app, this would be an actual API call
      if (email && password) {
        const userData: User = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          image: '/placeholder-user.jpg'
        }
        
        setUser(userData)
        localStorage.setItem('financeflow_user', JSON.stringify(userData))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulate API call - in real app, this would be an actual API call
      if (name && email && password) {
        const userData: User = {
          id: `user-${Date.now()}`,
          name: name,
          email: email,
          image: '/placeholder-user.jpg'
        }
        
        setUser(userData)
        localStorage.setItem('financeflow_user', JSON.stringify(userData))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('financeflow_user')
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('financeflow_user', JSON.stringify(updatedUser))
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      updateProfile, 
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}