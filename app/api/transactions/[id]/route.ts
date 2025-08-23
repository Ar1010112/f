import { NextRequest, NextResponse } from 'next/server'
import { updateTransaction, deleteTransaction } from '@/lib/api/transactions'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { amount, description, type, categoryId, date } = body

    const updateData: any = {}
    if (amount !== undefined) updateData.amount = parseFloat(amount)
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (date !== undefined) updateData.date = new Date(date)

    const transaction = await updateTransaction(params.id, updateData)
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error in PUT /api/transactions/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTransaction(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/transactions/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}