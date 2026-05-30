import express from 'express'
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  likeBlog,
  deleteBlog
} from '../controllers/blogController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getAllBlogs)
router.get('/:id', protect, getBlogById)
router.post('/', protect, createBlog)
router.patch('/:id/like', protect, likeBlog)
router.delete('/:id', protect, deleteBlog)

export default router