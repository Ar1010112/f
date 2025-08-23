import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, format, startOfDay, endOfDay } from 'date-fns'

export async function getDailyAnalytics(userId: string, date: Date = new Date()) {
  try {
    const startDate = startOfDay(date)
    const endDate = endOfDay(date)

    const transactions = await prisma.transaction.findMany({
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

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryBreakdown = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, transaction) => {
        const categoryName = transaction.category?.name || 'Other'
        acc[categoryName] = (acc[categoryName] || 0) + transaction.amount
        return acc
      }, {} as Record<string, number>)

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      categoryBreakdown,
      transactionCount: transactions.length,
    }
  } catch (error) {
    console.error('Error fetching daily analytics:', error)
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      categoryBreakdown: {},
      transactionCount: 0,
    }
  }
}

export async function getWeeklyAnalytics(userId: string, date: Date = new Date()) {
  try {
    const startDate = startOfWeek(date)
    const endDate = endOfWeek(date)

    const transactions = await prisma.transaction.findMany({
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

    const dailyData = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      
      const dayTransactions = transactions.filter(t => 
        t.date.toDateString() === day.toDateString()
      )

      const income = dayTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = dayTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      dailyData.push({
        name: format(day, 'EEE'),
        income,
        expense,
      })
    }

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      dailyData,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
    }
  } catch (error) {
    console.error('Error fetching weekly analytics:', error)
    return {
      dailyData: [],
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
    }
  }
}

export async function getMonthlyAnalytics(userId: string, date: Date = new Date()) {
  try {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)

    const transactions = await prisma.transaction.findMany({
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

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryBreakdown = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, transaction) => {
        const categoryName = transaction.category?.name || 'Other'
        acc[categoryName] = (acc[categoryName] || 0) + transaction.amount
        return acc
      }, {} as Record<string, number>)

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      categoryBreakdown,
      transactionCount: transactions.length,
    }
  } catch (error) {
    console.error('Error fetching monthly analytics:', error)
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      categoryBreakdown: {},
      transactionCount: 0,
    }
  }
}

export async function getMonthlyTrends(userId: string, months: number = 6) {
  try {
    const trends = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const analytics = await getMonthlyAnalytics(userId, date)
      
      trends.push({
        name: format(date, 'MMM'),
        income: analytics.totalIncome,
        expense: analytics.totalExpenses,
      })
    }

    return trends
  } catch (error) {
    console.error('Error fetching monthly trends:', error)
    return []
  }
}