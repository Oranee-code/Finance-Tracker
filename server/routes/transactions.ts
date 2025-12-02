import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as db from '../db/transactions.ts'
import { getUserId } from '../utils.ts'

const router = Router()

router.get('/tracker/:trackerId', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const transactions = await db.getTransactionsByTracker(
      Number(req.params.trackerId),
      userId,
      isGuest
    )
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})

router.get('/tracker/:trackerId/summary', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const summary = await db.getTransactionSummary(
      Number(req.params.trackerId),
      userId,
      isGuest
    )
    res.json(summary)
  } catch (err) {
    next(err)
  }
})

router.get('/tracker/:trackerId/categories', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const categories = await db.getTransactionsByCategory(
      Number(req.params.trackerId),
      userId,
      isGuest
    )
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const {
      tracker_id,
      type,
      amount,
      category_id,
      category_name,
      transaction_date,
      notes,
      repeat,
    } = req.body

    if (!tracker_id || !type || !amount || !transaction_date) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Missing required fields' })
      return
    }

    const id = await db.addTransaction({
      tracker_id,
      type,
      amount,
      category_id,
      category_name,
      transaction_date,
      notes,
      repeat: repeat || 'never',
      user_id: userId,
      is_guest: isGuest,
    })
    res.status(StatusCodes.CREATED).json({ id })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const updates = req.body
    await db.updateTransaction(Number(req.params.id), userId, isGuest, updates)
    res.sendStatus(StatusCodes.NO_CONTENT)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    await db.deleteTransaction(Number(req.params.id), userId, isGuest)
    res.sendStatus(StatusCodes.NO_CONTENT)
  } catch (err) {
    next(err)
  }
})

export default router

