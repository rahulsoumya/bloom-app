import express from 'express'
import {
  getAllArticles,
  getArticleById,
  addArticle,
  deleteArticle
} from '../controllers/articleController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.get('/', getAllArticles)
router.get('/:id', getArticleById)

// Admin only routes
router.post('/', protect, adminOnly, upload.single('image'), addArticle)
router.delete('/:id', protect, adminOnly, deleteArticle)

export default router