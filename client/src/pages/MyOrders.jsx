import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-blue-50 text-blue-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-400'
}

const statusEmoji = {
  pending: '🕐',
  confirmed: '✅',
  delivered: '📦',
  cancelled: '❌'
}

const MyOrders = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return (
    <p className="text-center mt-20 text-gray-400">Loading orders...</p>
  )

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-pink-600 mb-2">📦 My Orders</h1>
        <div className="flex items-center gap-3 mb-8">
  <button
    onClick={() => navigate('/profile?tab=orders')}
    className="text-pink-500 text-sm hover:underline"
  >
   

  </button>
   </div>
        <p className="text-gray-400 text-sm mb-8">{orders.length} orders placed</p>

        {orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 mb-4">No orders yet!</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Start Shopping
            </button>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">

              {/* Order header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                  {statusEmoji[order.status]} {order.status}
                </span>
              </div>

              {/* Order items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-pink-600 text-lg">₹{order.totalAmount}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default MyOrders