import Order from '../models/Order.js'

// Place order
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount
    })
    res.status(201).json({ message: 'Order placed!', order })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Get my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Get all orders — admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Update order status — admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.status(200).json({ message: 'Status updated!', order })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
// Cancel order — only user can cancel their own pending order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // only owner can cancel
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    // only pending orders can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' })
    }

    order.status = 'cancelled'
    await order.save()

    res.status(200).json({ message: 'Order cancelled', order })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}