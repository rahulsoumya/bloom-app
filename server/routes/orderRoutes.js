import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder 
} from '../controllers/orderController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/', protect, placeOrder)
router.get('/mine', protect, getMyOrders)
router.get('/', protect, adminOnly, getAllOrders)
router.patch('/:id', protect, adminOnly, updateOrderStatus)

router.patch('/:id/cancel', protect, cancelOrder)
export default router