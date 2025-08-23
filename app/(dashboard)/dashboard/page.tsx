"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/context/user-context"
import { useTransactions } from "@/lib/hooks/useTransactions"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { ArrowUpRight, ArrowDownRight, Plus, Wallet, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { EditTransactionDialog } from "@/components/dialogs/edit-transaction-dialog"
import { toast } from "sonner"

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export default function DashboardPage() {
  const { user, isLoading: userLoading } = useUser()
  const { transactions, loading: transactionsLoading, deleteTransaction } = useTransactions(user?.id || null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!user?.id || !transactions.length) return

    const fetchAnalytics = async () => {
      try {
        const [monthlyResponse, weeklyResponse] = await Promise.all([
          fetch(`/api/analytics?userId=${user.id}&type=monthly`),
          fetch(`/api/analytics?userId=${user.id}&type=weekly`)
        ])

        if (monthlyResponse.ok && weeklyResponse.ok) {
          const monthlyData = await monthlyResponse.json()
          const weeklyData = await weeklyResponse.json()

          setAnalytics(monthlyData)
          setWeeklyData(weeklyData.dailyData || [])
        } else {
          // Fallback to client-side calculation
          calculateAnalyticsClientSide()
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        calculateAnalyticsClientSide()
      }
    }

    const calculateAnalyticsClientSide = () => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth
      })

      const totalIncome = monthlyTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      const categoryBreakdown = monthlyTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, transaction) => {
          const categoryName = transaction.category?.name || 'Other'
          acc[categoryName] = (acc[categoryName] || 0) + transaction.amount
          return acc
        }, {} as Record<string, number>)

      setAnalytics({
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        categoryBreakdown,
        transactionCount: monthlyTransactions.length,
      })

      // Generate weekly data
      const weeklyData = []
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek)
        day.setDate(startOfWeek.getDate() + i)
        
        const dayTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.toDateString() === day.toDateString()
        })

        const income = dayTransactions
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0)

        const expense = dayTransactions
          .filter(t => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0)

        weeklyData.push({
          name: format(day, 'EEE'),
          income,
          expense,
        })
      }

      setWeeklyData(weeklyData)
    }

    fetchAnalytics()
  }, [user?.id, transactions])

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id)
        toast.success('Transaction deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete transaction')
      }
    }
  }

  if (userLoading || transactionsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const recentTransactions = transactions.slice(0, 5)
  const monthlyIncome = analytics?.totalIncome || 0
  const monthlyExpenses = analytics?.totalExpenses || 0
  const netIncome = monthlyIncome - monthlyExpenses

  const categoryData = analytics?.categoryBreakdown ? 
    Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
      name,
      value: value as number
    })) : []

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Income
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${monthlyExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Income
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netIncome.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transactions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Overview</CardTitle>
                <CardDescription>
                  Your financial activity for the past week
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expense" fill="hsl(var(--chart-1))" name="Expenses" />
                    <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                  Your expense distribution this month
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No expense data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest financial activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                  <div className="flex items-center justify-between" key={transaction.id}>
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 ${transaction.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}>
                        {transaction.type === 'INCOME' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category?.name || 'Other'} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-medium ${transaction.type === 'INCOME' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    No recent transactions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                Comprehensive analysis of your financial data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Monthly Summary</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Income:</span>
                      <span className="text-sm font-medium text-green-600">${monthlyIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Expenses:</span>
                      <span className="text-sm font-medium text-red-600">${monthlyExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Net Income:</span>
                      <span className={`text-sm font-medium ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${netIncome.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Transaction Count</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Transactions:</span>
                      <span className="text-sm font-medium">{analytics?.transactionCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Income Transactions:</span>
                      <span className="text-sm font-medium text-green-600">
                        {transactions.filter(t => t.type === 'INCOME').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expense Transactions:</span>
                      <span className="text-sm font-medium text-red-600">
                        {transactions.filter(t => t.type === 'EXPENSE').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditTransactionDialog
        transaction={editingTransaction}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingTransaction(null)
        }}
      />
    </DashboardLayout>
  )
}