import request from 'superagent'

const baseUrl = '/api/v1/categories'

export async function getCategories(userId: string, isGuest: boolean) {
  const res = await request
    .get(baseUrl)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

export async function addCategory(
  name: string,
  type: 'income' | 'expense',
  userId: string,
  isGuest: boolean
) {
  const res = await request
    .post(baseUrl)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
    .send({ name, type })
  return res.body
}

// Reset categories to defaults with emojis
export async function resetCategories(userId: string, isGuest: boolean) {
  const res = await request
    .post(`${baseUrl}/reset`)
    .set('X-Guest-Id', userId)
    .set('X-Is-Guest', isGuest.toString())
  return res.body
}

