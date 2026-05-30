import express from 'express'
import {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct
} from '../controllers/productController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Admin only routes
router.post('/', protect, adminOnly, upload.single('image'), addProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

export default router