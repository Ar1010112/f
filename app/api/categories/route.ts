import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory, getDefaultCategories } from '@/lib/api/categories'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const categories = await getDefaultCategories(userId)
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in GET /api/categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, icon, color, userId } = body

    if (!name || !icon || !color || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const category = await createCategory({
      name,
      icon,
      color,
      userId,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}