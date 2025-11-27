import connection from './connection.ts'

export interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  user_id: string
  is_guest: boolean
  created_at: string
}

const DEFAULT_CATEGORIES = {
  income: [
    '💵 Salary',
    '💰 Investment',
    '📈 Freelance',
    '🎁 Gift',
    '💸 Bonus',
  ],
  expense: [
    '🛒 Groceries',
    '🏠 Rent',
    '🏡 Mortgage',
    '💡 Utilities',
    '🚗 Transport',
    '⛽ Gas',
    '🏋️ Gym',
    '🛍️ Shopping',
    '🍽️ Eating Out',
    '☕ Coffee',
    '🎬 Entertainment',
    '🏥 Health',
    '🎓 Education',
    '📱 Phone & Internet',
    '💰 Savings',
  ],
}

export async function getCategories(userId: string, isGuest: boolean) {
  let categories = await connection('categories')
    .where({ user_id: userId, is_guest: isGuest })
    .orderBy('type')
    .orderBy('name')

  // If no categories exist, create default ones
  if (categories.length === 0) {
    await createDefaultCategories(userId, isGuest)
    categories = await connection('categories')
      .where({ user_id: userId, is_guest: isGuest })
      .orderBy('type')
      .orderBy('name')
  }

  return categories
}

// Helper to create default categories
async function createDefaultCategories(userId: string, isGuest: boolean) {
  const defaultCats = []
  for (const type of ['income', 'expense'] as const) {
    for (const name of DEFAULT_CATEGORIES[type]) {
      defaultCats.push({
        name,
        type,
        user_id: userId,
        is_guest: isGuest,
      })
    }
  }
  await connection('categories').insert(defaultCats)
}

// Reset categories to defaults (with emojis)
export async function resetCategories(userId: string, isGuest: boolean) {
  // Delete existing categories for this user
  await connection('categories')
    .where({ user_id: userId, is_guest: isGuest })
    .del()
  
  // Create fresh default categories with emojis
  await createDefaultCategories(userId, isGuest)
  
  return getCategories(userId, isGuest)
}

export async function addCategory(category: {
  name: string
  type: 'income' | 'expense'
  user_id: string
  is_guest: boolean
}) {
  const [id] = await connection('categories').insert(category).returning('id')
  return id
}

