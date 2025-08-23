export type TransactionType = 'EXPENSE' | 'INCOME';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  categoryId: string;
  userId: string;
  category?: Category;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';