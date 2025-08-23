"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/lib/types"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateProfile: (data: Partial<User>) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data - in a real app, this would fetch from your auth provider
    const loadUser = async () => {
      try {
        // For demo purposes, create a default user
        const demoUser: User = {
          id: 'demo-user-1',
          name: 'John Doe',
          email: 'john@example.com',
          image: '/placeholder-user.jpg'
        }
        setUser(demoUser)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
      // Here you would also make an API call to update the user in the database
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateProfile, isLoading }}>
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