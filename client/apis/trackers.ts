import request from 'superagent'

const baseUrl = '/api/v1/trackers'

export async function getTrackers(userId: string, isGuest: boolean) {
  const res = await request
    .get(baseUrl)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

export async function getTracker(id: number, userId: string, isGuest: boolean) {
  const res = await request
    .get(`${baseUrl}/${id}`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

export async function addTracker(
  name: string,
  userId: string,
  isGuest: boolean
) {
  const res = await request
    .post(baseUrl)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
    .send({ name })
  return res.body
}

export async function updateTracker(
  id: number,
  name: string,
  userId: string,
  isGuest: boolean
) {
  await request
    .patch(`${baseUrl}/${id}`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
    .send({ name })
}

export async function deleteTracker(
  id: number,
  userId: string,
  isGuest: boolean
) {
  await request
    .delete(`${baseUrl}/${id}`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
}

