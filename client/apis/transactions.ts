import request from 'superagent'

const baseUrl = '/api/v1/transactions'

// Helper to set headers based on auth type
function setAuthHeaders(req: request.SuperAgentRequest, userId: string, isGuest: boolean, accessToken?: string | null) {
  if (isGuest) {
    return req
      .set('X-Guest-Id', userId)
      .set('X-Is-Guest', 'true')
  } else if (accessToken) {
    return req
      .set('Authorization', `Bearer ${accessToken}`)
  }
  return req
}

export async function getTransactions(
  trackerId: number,
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.get(`${baseUrl}/tracker/${trackerId}`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
  return res.body
}

export async function getTransactionSummary(
  trackerId: number,
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.get(`${baseUrl}/tracker/${trackerId}/summary`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
  return res.body
}

export async function getCategorySpending(
  trackerId: number,
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.get(`${baseUrl}/tracker/${trackerId}/categories`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
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
  },
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.post(baseUrl)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req.send(transaction)
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
  },
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.patch(`${baseUrl}/${id}`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  await req.send(updates)
}

export async function deleteTransaction(
  id: number,
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.delete(`${baseUrl}/${id}`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  await req
}

