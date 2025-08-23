import { NextRequest, NextResponse } from 'next/server'
import { getTransactions, createTransaction } from '@/lib/api/transactions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const transactions = await getTransactions(userId)
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error in GET /api/transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, type, categoryId, userId, date } = body

    if (!amount || !description || !type || !categoryId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transaction = await createTransaction({
      amount: parseFloat(amount),
      description,
      type,
      categoryId,
      userId,
      date: date ? new Date(date) : undefined,
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}