import connection from './connection.ts'

export interface Tracker {
  id: number
  name: string
  icon?: string
  color?: string
  user_id: string
  is_guest: boolean
  created_at: string
  updated_at: string
}

export async function getAllTrackers(userId: string, isGuest: boolean) {
  return connection('trackers')
    .where({ user_id: userId, is_guest: isGuest })
    .orderBy('updated_at', 'desc')
}

export async function getTrackerById(id: number, userId: string, isGuest: boolean) {
  return connection('trackers')
    .where({ id, user_id: userId, is_guest: isGuest })
    .first()
}

export async function addTracker(tracker: {
  name: string
  icon?: string
  color?: string
  user_id: string
  is_guest: boolean
}) {
  const [id] = await connection('trackers').insert(tracker).returning('id')
  return id
}

export async function updateTracker(
  id: number,
  userId: string,
  isGuest: boolean,
  updates: { name?: string; icon?: string; color?: string }
) {
  return connection('trackers')
    .where({ id, user_id: userId, is_guest: isGuest })
    .update({ ...updates, updated_at: new Date() })
}

export async function deleteTracker(id: number, userId: string, isGuest: boolean) {
  return connection('trackers')
    .where({ id, user_id: userId, is_guest: isGuest })
    .delete()
}

