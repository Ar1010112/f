'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/lib/types'

export function useTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/transactions?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }
        const data = await response.json()
        // Ensure dates are properly parsed
        const parsedData = data.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date)
        }))
        setTransactions(parsedData)
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        // Fallback to empty array on error
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])

  const addTransaction = async (transactionData: any) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...transactionData, userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create transaction')
      }

      const newTransaction = await response.json()
      // Ensure date is properly parsed
      const parsedTransaction = {
        ...newTransaction,
        date: new Date(newTransaction.date)
      }
      setTransactions(prev => [parsedTransaction, ...prev])
      return parsedTransaction
    } catch (err) {
      console.error('Error adding transaction:', err)
      throw err
    }
  }

  const updateTransaction = async (id: string, transactionData: any) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        throw new Error('Failed to update transaction')
      }

      const updatedTransaction = await response.json()
      // Ensure date is properly parsed
      const parsedTransaction = {
        ...updatedTransaction,
        date: new Date(updatedTransaction.date)
      }
      setTransactions(prev => 
        prev.map(t => t.id === id ? parsedTransaction : t)
      )
      return parsedTransaction
    } catch (err) {
      console.error('Error updating transaction:', err)
      throw err
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete transaction')
      }

      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting transaction:', err)
      throw err
    }
  }

  const refetch = async () => {
    if (userId) {
      try {
        setLoading(true)
        const response = await fetch(`/api/transactions?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          const parsedData = data.map((transaction: any) => ({
            ...transaction,
            date: new Date(transaction.date)
          }))
          setTransactions(parsedData)
        }
      } catch (err) {
        console.error('Error refetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch,
  }
}