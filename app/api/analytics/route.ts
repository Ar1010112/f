import { NextRequest, NextResponse } from 'next/server'
import { getDailyAnalytics, getWeeklyAnalytics, getMonthlyAnalytics, getMonthlyTrends } from '@/lib/api/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'monthly'
    const date = searchParams.get('date')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const targetDate = date ? new Date(date) : new Date()

    let data
    switch (type) {
      case 'daily':
        data = await getDailyAnalytics(userId, targetDate)
        break
      case 'weekly':
        data = await getWeeklyAnalytics(userId, targetDate)
        break
      case 'trends':
        data = await getMonthlyTrends(userId, 6)
        break
      case 'monthly':
      default:
        data = await getMonthlyAnalytics(userId, targetDate)
        break
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}