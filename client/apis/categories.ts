import request from 'superagent'

const baseUrl = '/api/v1/categories'

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

export async function getCategories(userId: string, isGuest: boolean, accessToken?: string | null) {
  const req = request.get(baseUrl)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
  return res.body
}

export async function addCategory(
  name: string,
  type: 'income' | 'expense',
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.post(baseUrl)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req.send({ name, type })
  return res.body
}

// Reset categories to defaults with emojis
export async function resetCategories(userId: string, isGuest: boolean, accessToken?: string | null) {
  const req = request.post(`${baseUrl}/reset`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
  return res.body
}

