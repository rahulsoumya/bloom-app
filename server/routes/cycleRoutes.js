import express from 'express'
import {
  addCycleLog,
  getCycleLogs,
  deleteCycleLog
} from '../controllers/cycleController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes are protected — login required
router.post('/', protect, addCycleLog)
router.get('/', protect, getCycleLogs)
router.delete('/:id', protect, deleteCycleLog)

export default router