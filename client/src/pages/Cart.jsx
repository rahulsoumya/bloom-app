import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import API_URL from '../config'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/orders`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
          })),
          totalAmount: totalPrice
        })
      })

      const data = await res.json()
      if (!res.ok) { setError(data.message); return }

      clearCart()
      navigate('/order-success')
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🛒</p>
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty!</h2>
        <p className="text-gray-400 text-sm">Add some products from the shop</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-pink-600 transition mt-2"
        >
          Go to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-pink-600 mb-2">🛒 My Cart</h1>
        <p className="text-gray-400 text-sm mb-8">{totalItems} items in your cart</p>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-pink-500 font-bold mt-1">₹{item.price}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{item.category}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-pink-100 hover:text-pink-500 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-gray-700 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-pink-100 hover:text-pink-500 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-bold text-gray-700">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-400 transition"
            >
              Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-700 font-medium flex-shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-bold text-pink-600 text-xl">₹{totalPrice}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Free delivery on all orders 🚚</p>
              </div>

              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
              >
                {loading ? 'Placing Order...' : 'Place Order 🛍️'}
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-medium hover:border-pink-300 hover:text-pink-500 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart