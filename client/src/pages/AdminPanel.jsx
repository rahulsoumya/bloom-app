import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

const AdminPanel = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('products')

  // Product states
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'pads', stock: ''
  })
  const [productImage, setProductImage] = useState(null)
  const [productLoading, setProductLoading] = useState(false)

  // Article states
  const [articles, setArticles] = useState([])
  const [articleForm, setArticleForm] = useState({
    title: '', content: '', category: 'nutrition', readTime: '3 min read'
  })
  const [articleImage, setArticleImage] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)

  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/')
  }, [user])

  useEffect(() => {
    fetchProducts()
    fetchArticles()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/articles`)
      const data = await res.json()
      setArticles(data)
    } catch (err) {
      setError('Failed to load articles')
    }
  }

  // Product handlers
  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setProductLoading(true)
    setError('')
    setSuccess('')
    try {
      const formData = new FormData()
      Object.keys(productForm).forEach(key => formData.append(key, productForm[key]))
      formData.append('image', productImage)

      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      setSuccess('Product added!')
      setProductForm({ name: '', description: '', price: '', category: 'pads', stock: '' })
      setProductImage(null)
      fetchProducts()
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setProductLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setDeleteLoading(id)
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Product deleted!')
      fetchProducts()
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setDeleteLoading('')
    }
  }

  // Article handlers
  const handleArticleChange = (e) => {
    setArticleForm({ ...articleForm, [e.target.name]: e.target.value })
  }

  const handleAddArticle = async (e) => {
    e.preventDefault()
    setArticleLoading(true)
    setError('')
    setSuccess('')
    try {
      const formData = new FormData()
      Object.keys(articleForm).forEach(key => formData.append(key, articleForm[key]))
      formData.append('image', articleImage)

      const res = await fetch(`${API_URL}/api/articles`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      setSuccess('Article added!')
      setArticleForm({ title: '', content: '', category: 'nutrition', readTime: '3 min read' })
      setArticleImage(null)
      fetchArticles()
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setArticleLoading(false)
    }
  }

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return
    setDeleteLoading(id)
    try {
      await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Article deleted!')
      fetchArticles()
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setDeleteLoading('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-pink-600 text-center mb-8">
         Admin Panel
      </h1>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition
            ${activeTab === 'products'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:border-pink-400'
            }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition
            ${activeTab === 'articles'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:border-pink-400'
            }`}
        >
          Articles
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {/* Add Product Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-5">
                Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Product Name</label>
                  <input type="text" name="name" value={productForm.name}
                    onChange={handleProductChange} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="e.g. Whisper Pads" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea name="description" value={productForm.description}
                    onChange={handleProductChange} required rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Product description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Price (₹)</label>
                    <input type="number" name="price" value={productForm.price}
                      onChange={handleProductChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="120" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Stock</label>
                    <input type="number" name="stock" value={productForm.stock}
                      onChange={handleProductChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select name="category" value={productForm.category}
                    onChange={handleProductChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300">
                    <option value="pads">Pads</option>
                    <option value="tampons">Tampons</option>
                    <option value="cups">Cups</option>
                    <option value="skincare">Skincare</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Product Image</label>
                  <input type="file" accept="image/*"
                    onChange={(e) => setProductImage(e.target.files[0])} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1" />
                </div>
                <button type="submit" disabled={productLoading}
                  className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition">
                  {productLoading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-5">
                All Products ({products.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {products.map(product => (
                  <div key={product._id}
                    className="flex items-center gap-4 border border-gray-100 rounded-xl p-3">
                    <img src={product.image} alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-sm text-pink-500">₹{product.price}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {product.category} • {product.stock} in stock
                      </p>
                    </div>
                    <button onClick={() => handleDeleteProduct(product._id)}
                      disabled={deleteLoading === product._id}
                      className="text-red-400 hover:text-red-600 text-sm font-medium">
                      {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ARTICLES TAB */}
        {activeTab === 'articles' && (
          <>
            {/* Add Article Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-5">
                Add New Article
              </h2>
              <form onSubmit={handleAddArticle} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Title</label>
                  <input type="text" name="title" value={articleForm.title}
                    onChange={handleArticleChange} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="e.g. 5 Foods to Eat During Your Period" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Content</label>
                  <textarea name="content" value={articleForm.content}
                    onChange={handleArticleChange} required rows={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Write full article content here..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Category</label>
                    <select name="category" value={articleForm.category}
                      onChange={handleArticleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300">
                      <option value="nutrition">Nutrition</option>
                      <option value="hygiene">Hygiene</option>
                      <option value="menstrual">Menstrual</option>
                      <option value="mental">Mental Health</option>
                      <option value="skincare">Skincare</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Read Time</label>
                    <input type="text" name="readTime" value={articleForm.readTime}
                      onChange={handleArticleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="5 min read" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Cover Image</label>
                  <input type="file" accept="image/*"
                    onChange={(e) => setArticleImage(e.target.files[0])} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1" />
                </div>
                <button type="submit" disabled={articleLoading}
                  className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition">
                  {articleLoading ? 'Adding...' : 'Add Article'}
                </button>
              </form>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-5">
                All Articles ({articles.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {articles.map(article => (
                  <div key={article._id}
                    className="flex items-center gap-4 border border-gray-100 rounded-xl p-3">
                    <img src={article.image} alt={article.title}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{article.title}</p>
                      <p className="text-xs text-pink-500 capitalize">{article.category}</p>
                      <p className="text-xs text-gray-400">{article.readTime}</p>
                    </div>
                    <button onClick={() => handleDeleteArticle(article._id)}
                      disabled={deleteLoading === article._id}
                      className="text-red-400 hover:text-red-600 text-sm font-medium">
                      {deleteLoading === article._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default AdminPanel