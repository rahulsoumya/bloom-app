import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import API_URL from '../config'

const categories = ['all', 'pads', 'tampons', 'cups', 'skincare', 'hygiene', 'wellness']

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchProducts = async (category) => {
    setLoading(true)
    try {
      const url = category === 'all'
          ? `${API_URL}/api/products`
          : `${API_URL}/api/products?category=${category}`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(selectedCategory)
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">

      <h1 className="text-3xl font-bold text-pink-600 text-center mb-2">
        Bloom Shop
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Everything you need, delivered discreetly
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition
              ${selectedCategory === cat
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-pink-400'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-400 mt-20">Loading products...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-400 mt-20">{error}</p>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
          No products found in this category.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  )
}

export default Shop