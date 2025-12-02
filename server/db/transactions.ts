import connection from './connection.ts'

export interface Transaction {
  id: number
  tracker_id: number
  type: 'income' | 'expense'
  amount: number
  category_id: number | null
  category_name: string | null
  transaction_date: string
  notes: string | null
  repeat: string | null
  user_id: string
  is_guest: boolean
  created_at: string
  updated_at: string
}

export async function getTransactionsByTracker(
  trackerId: number,
  userId: string,
  isGuest: boolean
) {
  return connection('transactions')
    .where({ tracker_id: trackerId, user_id: userId, is_guest: isGuest })
    .orderBy('transaction_date', 'desc')
    .orderBy('created_at', 'desc')
}

export async function getTransactionById(
  id: number,
  userId: string,
  isGuest: boolean
) {
  return connection('transactions')
    .where({ id, user_id: userId, is_guest: isGuest })
    .first()
}

export async function addTransaction(transaction: {
  tracker_id: number
  type: 'income' | 'expense'
  amount: number
  category_id?: number | null
  category_name?: string
  transaction_date: string
  notes?: string
  repeat?: string
  user_id: string
  is_guest: boolean
}) {
  const [id] = await connection('transactions')
    .insert(transaction)
    .returning('id')
  return id
}

export async function updateTransaction(
  id: number,
  userId: string,
  isGuest: boolean,
  updates: {
    amount?: number
    category_id?: number | null
    category_name?: string
    transaction_date?: string
    notes?: string
    repeat?: string
  }
) {
  return connection('transactions')
    .where({ id, user_id: userId, is_guest: isGuest })
    .update({ ...updates, updated_at: new Date() })
}

export async function deleteTransaction(
  id: number,
  userId: string,
  isGuest: boolean
) {
  return connection('transactions')
    .where({ id, user_id: userId, is_guest: isGuest })
    .delete()
}

export async function getTransactionSummary(
  trackerId: number,
  userId: string,
  isGuest: boolean
) {
  const transactions = await connection('transactions')
    .where({ tracker_id: trackerId, user_id: userId, is_guest: isGuest })
    .select('type', 'amount')

  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  }

  transactions.forEach((t) => {
    if (t.type === 'income') {
      summary.totalIncome += Number(t.amount)
    } else {
      summary.totalExpenses += Number(t.amount)
    }
  })

  summary.balance = summary.totalIncome - summary.totalExpenses
  return summary
}

export async function getTransactionsByCategory(
  trackerId: number,
  userId: string,
  isGuest: boolean
) {
  return connection('transactions')
    .where({ tracker_id: trackerId, user_id: userId, is_guest: isGuest })
    .where('type', 'expense')
    .select('category_name')
    .sum('amount as total')
    .groupBy('category_name')
    .orderBy('total', 'desc')
}

