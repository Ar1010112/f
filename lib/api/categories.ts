import { prisma } from '@/lib/db'
import { Category } from '@/lib/types'

export async function getCategories(userId: string): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      userId: category.userId,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createCategory(data: {
  name: string
  icon: string
  color: string
  userId: string
}) {
  try {
    return await prisma.category.create({
      data,
    })
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function getDefaultCategories(userId: string) {
  const defaultCategories = [
    { name: 'Food', icon: '🍔', color: '#FF6B6B' },
    { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
    { name: 'Entertainment', icon: '🎬', color: '#45B7D1' },
    { name: 'Shopping', icon: '🛍️', color: '#96CEB4' },
    { name: 'Utilities', icon: '💡', color: '#FFEAA7' },
    { name: 'Health', icon: '🏥', color: '#DDA0DD' },
    { name: 'Salary', icon: '💰', color: '#98D8C8' },
    { name: 'Other', icon: '📝', color: '#A8A8A8' },
  ]

  try {
    const existingCategories = await prisma.category.findMany({
      where: { userId },
    })

    if (existingCategories.length === 0) {
      await prisma.category.createMany({
        data: defaultCategories.map(cat => ({
          ...cat,
          userId,
        })),
      })
    }

    return await getCategories(userId)
  } catch (error) {
    console.error('Error creating default categories:', error)
    return []
  }
}