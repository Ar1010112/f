// Mock database implementation for demo purposes
// In a real application, this would use Prisma with a real database

export interface MockUser {
  id: string
  name: string
  email: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface MockCategory {
  id: string
  name: string
  icon: string
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface MockTransaction {
  id: string
  amount: number
  description: string
  date: Date
  type: 'EXPENSE' | 'INCOME'
  categoryId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Mock data storage
let mockUsers: MockUser[] = []
let mockCategories: MockCategory[] = []
let mockTransactions: MockTransaction[] = []

// Initialize with some default data
const initializeDefaultData = () => {
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('financeflow_mock_users')
    const storedCategories = localStorage.getItem('financeflow_mock_categories')
    const storedTransactions = localStorage.getItem('financeflow_mock_transactions')

    if (storedUsers) mockUsers = JSON.parse(storedUsers)
    if (storedCategories) mockCategories = JSON.parse(storedCategories)
    if (storedTransactions) {
      mockTransactions = JSON.parse(storedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }))
    }
  }
}

const saveToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('financeflow_mock_users', JSON.stringify(mockUsers))
    localStorage.setItem('financeflow_mock_categories', JSON.stringify(mockCategories))
    localStorage.setItem('financeflow_mock_transactions', JSON.stringify(mockTransactions))
  }
}

// Initialize data
initializeDefaultData()

// Mock Prisma client
export const prisma = {
  user: {
    findMany: async (options?: any) => {
      return mockUsers.filter(user => {
        if (options?.where?.id) return user.id === options.where.id
        return true
      })
    },
    findUnique: async (options: any) => {
      return mockUsers.find(user => user.id === options.where.id) || null
    },
    create: async (options: any) => {
      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        ...options.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockUsers.push(newUser)
      saveToStorage()
      return newUser
    }
  },
  category: {
    findMany: async (options?: any) => {
      let categories = mockCategories
      if (options?.where?.userId) {
        categories = categories.filter(cat => cat.userId === options.where.userId)
      }
      return categories
    },
    create: async (options: any) => {
      const newCategory: MockCategory = {
        id: `cat-${Date.now()}`,
        ...options.data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockCategories.push(newCategory)
      saveToStorage()
      return newCategory
    },
    createMany: async (options: any) => {
      const newCategories = options.data.map((data: any) => ({
        id: `cat-${Date.now()}-${Math.random()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      mockCategories.push(...newCategories)
      saveToStorage()
      return { count: newCategories.length }
    }
  },
  transaction: {
    findMany: async (options?: any) => {
      let transactions = mockTransactions
      
      if (options?.where?.userId) {
        transactions = transactions.filter(t => t.userId === options.where.userId)
      }
      
      if (options?.where?.date?.gte || options?.where?.date?.lte) {
        transactions = transactions.filter(t => {
          const transactionDate = new Date(t.date)
          if (options.where.date.gte && transactionDate < new Date(options.where.date.gte)) return false
          if (options.where.date.lte && transactionDate > new Date(options.where.date.lte)) return false
          return true
        })
      }

      if (options?.include?.category) {
        return transactions.map(t => ({
          ...t,
          category: mockCategories.find(c => c.id === t.categoryId) || null
        }))
      }

      return transactions
    },
    create: async (options: any) => {
      const newTransaction: MockTransaction = {
        id: `trans-${Date.now()}`,
        ...options.data,
        date: options.data.date || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockTransactions.push(newTransaction)
      saveToStorage()
      
      if (options.include?.category) {
        return {
          ...newTransaction,
          category: mockCategories.find(c => c.id === newTransaction.categoryId) || null
        }
      }
      
      return newTransaction
    },
    update: async (options: any) => {
      const index = mockTransactions.findIndex(t => t.id === options.where.id)
      if (index !== -1) {
        mockTransactions[index] = {
          ...mockTransactions[index],
          ...options.data,
          updatedAt: new Date()
        }
        saveToStorage()
        
        if (options.include?.category) {
          return {
            ...mockTransactions[index],
            category: mockCategories.find(c => c.id === mockTransactions[index].categoryId) || null
          }
        }
        
        return mockTransactions[index]
      }
      throw new Error('Transaction not found')
    },
    delete: async (options: any) => {
      const index = mockTransactions.findIndex(t => t.id === options.where.id)
      if (index !== -1) {
        const deleted = mockTransactions.splice(index, 1)[0]
        saveToStorage()
        return deleted
      }
      throw new Error('Transaction not found')
    }
  }
}