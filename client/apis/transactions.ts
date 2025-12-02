import request from 'superagent'

const baseUrl = '/api/v1/transactions'

export async function getTransactions(
  trackerId: number,
  userId: string,
  isGuest: boolean
) {
  const res = await request
    .get(`${baseUrl}/tracker/${trackerId}`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

export async function getTransactionSummary(
  trackerId: number,
  userId: string,
  isGuest: boolean
) {
  const res = await request
    .get(`${baseUrl}/tracker/${trackerId}/summary`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

export async function getCategorySpending(
  trackerId: number,
  userId: string,
  isGuest: boolean
) {
  const res = await request
    .get(`${baseUrl}/tracker/${trackerId}/categories`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

export async function addTransaction(
  transaction: {
    tracker_id: number
    type: 'income' | 'expense'
    amount: number
    category_id?: number | null
    category_name?: string
    transaction_date: string
    notes?: string
    repeat?: string
  },
  userId: string,
  isGuest: boolean
) {
  const res = await request
    .post(baseUrl)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
    .send(transaction)
  return res.body
}

export async function updateTransaction(
  id: number,
  updates: {
    amount?: number
    category_id?: number | null
    category_name?: string
    transaction_date?: string
    notes?: string
    repeat?: string
  },
  userId: string,
  isGuest: boolean
) {
  await request
    .patch(`${baseUrl}/${id}`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
    .send(updates)
}

export async function deleteTransaction(
  id: number,
  userId: string,
  isGuest: boolean
) {
  await request
    .delete(`${baseUrl}/${id}`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
}

