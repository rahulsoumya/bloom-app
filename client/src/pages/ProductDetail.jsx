import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API_URL from '../config'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`)
        const data = await res.json()
        if (!res.ok) { setError(data.message); return }
        setProduct(data)
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>
  if (error) return <p className="text-center mt-20 text-red-400">{error}</p>

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <button
        onClick={() => navigate('/shop')}
        className="text-pink-500 text-sm mb-6 flex items-center gap-1 hover:underline max-w-4xl mx-auto"
      >
        ← Back to Shop
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-1/2 h-72 rounded-xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-xs text-pink-500 font-medium capitalize bg-pink-50 px-3 py-1 rounded-full w-fit mb-3">
            {product.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{product.description}</p>
          <p className="text-3xl font-bold text-pink-600 mb-3">₹{product.price}</p>
          <span className={`text-sm font-medium w-fit px-3 py-1 rounded-full mb-6
            ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </span>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-xl font-semibold transition
                ${added
                  ? 'bg-green-500 text-white'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="px-4 py-3 rounded-xl border border-pink-300 text-pink-500 font-semibold hover:bg-pink-50 transition"
            >
              View Cart 🛒
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetail