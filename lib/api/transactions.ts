import { prisma } from '@/lib/db'
import { Transaction, TransactionType } from '@/lib/types'

export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
    })

    return transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type as TransactionType,
      categoryId: transaction.categoryId,
      userId: transaction.userId,
      category: transaction.category ? {
        id: transaction.category.id,
        name: transaction.category.name,
        icon: transaction.category.icon,
        color: transaction.category.color,
        userId: transaction.category.userId,
      } : undefined,
    }))
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export async function createTransaction(data: {
  amount: number
  description: string
  type: TransactionType
  categoryId: string
  userId: string
  date?: Date
}) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date: data.date || new Date(),
      },
      include: {
        category: true,
      },
    })

    return {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type as TransactionType,
      categoryId: transaction.categoryId,
      userId: transaction.userId,
      category: transaction.category ? {
        id: transaction.category.id,
        name: transaction.category.name,
        icon: transaction.category.icon,
        color: transaction.category.color,
        userId: transaction.category.userId,
      } : undefined,
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
}

export async function updateTransaction(
  id: string,
  data: {
    amount?: number
    description?: string
    type?: TransactionType
    categoryId?: string
    date?: Date
  }
) {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    })

    return {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type as TransactionType,
      categoryId: transaction.categoryId,
      userId: transaction.userId,
      category: transaction.category ? {
        id: transaction.category.id,
        name: transaction.category.name,
        icon: transaction.category.icon,
        color: transaction.category.color,
        userId: transaction.category.userId,
      } : undefined,
    }
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw error
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}

export async function getTransactionsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    return await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    })
  } catch (error) {
    console.error('Error fetching transactions by date range:', error)
    return []
  }
}