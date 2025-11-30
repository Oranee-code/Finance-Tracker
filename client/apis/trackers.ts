import request from 'superagent'

const baseUrl = '/api/v1/trackers'

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

export async function getTrackers(userId: string, isGuest: boolean, accessToken?: string | null) {
  const req = request.get(baseUrl)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
  return res.body
}

export async function getTracker(id: number, userId: string, isGuest: boolean, accessToken?: string | null) {
  const req = request.get(`${baseUrl}/${id}`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req
  return res.body
}

export async function addTracker(
  name: string,
  userId: string,
  isGuest: boolean,
  icon?: string,
  color?: string,
  accessToken?: string | null
) {
  const req = request.post(baseUrl)
  setAuthHeaders(req, userId, isGuest, accessToken)
  const res = await req.send({ name, icon, color })
  return res.body
}

export async function updateTracker(
  id: number,
  name: string,
  userId: string,
  isGuest: boolean,
  icon?: string,
  color?: string,
  accessToken?: string | null
) {
  const req = request.patch(`${baseUrl}/${id}`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  await req.send({ name, icon, color })
}

export async function deleteTracker(
  id: number,
  userId: string,
  isGuest: boolean,
  accessToken?: string | null
) {
  const req = request.delete(`${baseUrl}/${id}`)
  setAuthHeaders(req, userId, isGuest, accessToken)
  await req
}

