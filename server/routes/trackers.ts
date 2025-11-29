import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as db from '../db/trackers.ts'
import { getUserId } from '../utils.ts'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const trackers = await db.getAllTrackers(userId, isGuest)
    res.json(trackers)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const tracker = await db.getTrackerById(Number(req.params.id), userId, isGuest)
    if (!tracker) {
      res.sendStatus(StatusCodes.NOT_FOUND)
      return
    }
    res.json(tracker)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const { name, icon, color } = req.body
    if (!name) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' })
      return
    }
    const iconToSave = icon && icon.trim() ? icon.trim() : 'Wallet'
    const colorToSave = color && color.trim() ? color.trim() : '#7dd3fc'
    const id = await db.addTracker({ name, icon: iconToSave, color: colorToSave, user_id: userId, is_guest: isGuest })
    res.status(StatusCodes.CREATED).json({ id })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    const { name, icon, color } = req.body
    const updates: { name?: string; icon?: string; color?: string } = {}
    if (name !== undefined) updates.name = name
    if (icon !== undefined) {
      updates.icon = icon && icon.trim() ? icon.trim() : 'Wallet'
    }
    if (color !== undefined) {
      updates.color = color && color.trim() ? color.trim() : '#7dd3fc'
    }
    await db.updateTracker(Number(req.params.id), userId, isGuest, updates)
    res.sendStatus(StatusCodes.NO_CONTENT)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { userId, isGuest } = getUserId(req)
    await db.deleteTracker(Number(req.params.id), userId, isGuest)
    res.sendStatus(StatusCodes.NO_CONTENT)
  } catch (err) {
    next(err)
  }
})

export default router

