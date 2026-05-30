import express from 'express'
import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/userController.js'
import protect from '../middleware/authMiddleware.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.get('/profile', protect, getProfile)
router.put('/profile', protect, upload.single('photo'), updateProfile)
router.put('/change-password', protect, changePassword)

export default router