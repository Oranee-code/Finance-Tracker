import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as db from '../db/categories.ts'
import { getUserId } from '../utils.ts'
import checkJwt from '../auth0.ts'

const router = Router()

// Apply JWT verification middleware (optional - won't fail if no token)
// This allows both Auth0 users and guest users
router.use(checkJwt)

router.get('/', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const categories = await db.getCategories(userId, isGuest)
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const { name, type } = req.body
    if (!name || !type) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Name and type are required' })
      return
    }
    const id = await db.addCategory({ name, type, user_id: userId, is_guest: isGuest })
    res.status(StatusCodes.CREATED).json({ id })
  } catch (err) {
    next(err)
  }
})

// Reset categories to defaults (with emojis)
router.post('/reset', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const categories = await db.resetCategories(userId, isGuest)
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

export default router

