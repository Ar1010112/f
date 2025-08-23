import { prisma } from '@/lib/db'
import { Account } from '@/lib/types'

export async function getAccounts(userId: string): Promise<Account[]> {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return accounts.map(account => ({
      id: account.id,
      name: account.name,
      balance: account.balance,
      userId: account.userId,
    }))
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return []
  }
}

export async function createAccount(data: {
  name: string
  balance: number
  userId: string
}) {
  try {
    return await prisma.account.create({
      data,
    })
  } catch (error) {
    console.error('Error creating account:', error)
    throw error
  }
}

export async function updateAccountBalance(accountId: string, newBalance: number) {
  try {
    return await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    })
  } catch (error) {
    console.error('Error updating account balance:', error)
    throw error
  }
}

export async function getTotalBalance(userId: string): Promise<number> {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { balance: true },
    })

    return accounts.reduce((total, account) => total + account.balance, 0)
  } catch (error) {
    console.error('Error calculating total balance:', error)
    return 0
  }
}