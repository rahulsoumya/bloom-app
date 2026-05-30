import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">

        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          Thank you for shopping with Bloom 🌸
        </p>
        <p className="text-gray-400 text-sm mb-8">
          We'll contact you soon to confirm your delivery details.
        </p>

        <div className="bg-pink-50 border border-pink-100 rounded-xl px-4 py-3 mb-8">
          <p className="text-sm text-pink-500 font-medium">
            📦 Your order status: <span className="font-bold">Pending</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You can track your order in My Orders
          </p>
        </div>

        <div className="flex flex-col gap-3">
         <button
  onClick={() => navigate('/profile?tab=orders')}
  className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
>
  View My Orders 📦
</button>
          <button
            onClick={() => navigate('/shop')}
            className="w-full border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-medium hover:border-pink-300 hover:text-pink-500 transition"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  )
}

export default OrderSuccess