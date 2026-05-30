import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config'

const categories = ['all', 'period', 'hygiene', 'healthcare', 'mentalhealth', 'experience', 'tips']

const categoryColors = {
  period: 'bg-pink-50 text-pink-600',
  hygiene: 'bg-blue-50 text-blue-600',
  healthcare: 'bg-green-50 text-green-600',
  mentalhealth: 'bg-purple-50 text-purple-600',
  experience: 'bg-orange-50 text-orange-600',
  tips: 'bg-yellow-50 text-yellow-600'
}

const Blog = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchBlogs = async (category) => {
    setLoading(true)
    try {
     const url = category === 'all'
  ? `${API_URL}/api/blogs`
  : `${API_URL}/api/blogs?category=${category}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setBlogs(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(selectedCategory)
  }, [selectedCategory])

  const handleLike = async (e, id) => {
    e.stopPropagation()
    try {
      const res  = await fetch(`${API_URL}/api/blogs/${id}/like`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setBlogs(prev =>
        prev.map(b => b._id === id ? { ...b, likes: data.likes } : b)
      )
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">

      {/* Header */}
      {/* Hero Banner */}
    <div className="bg-gradient-to-r from-pink-300 to-purple-100 py-12 px-6 text-center mb-8 rounded-3xl max-w-4xl mx-auto">
    <span className="text-xs font-semibold tracking-widest uppercase text-pink-400 border border-pink-300 px-4 py-1 rounded-full">
    Safe • Anonymous • Real
    </span>
    <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-2">
     Community Blog
    </h1>
    <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
    Real stories from real girls — shared anonymously, read with love 🌸
    </p>
    <button
    onClick={() => navigate('/blog/write')}
    className="mt-6 bg-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-pink-600 transition text-sm inline-block"
  >
    + Write Your Story
  </button>
</div>
      
      {/* Category Filter */}
      <div className="max-w-4xl mx-auto flex flex-wrap gap-2 mt-6 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition
              ${selectedCategory === cat
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-pink-400'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-400 mt-20">Loading posts...</p>
      )}

      {/* Empty */}
      {!loading && blogs.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-4">No posts yet in this category.</p>
          <button
            onClick={() => navigate('/blog/write')}
            className="bg-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition"
          >
            Be the first to write!
          </button>
        </div>
      )}

      {/* Blog Cards Grid */}
      {!loading && blogs.length > 0 && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {blogs.map(blog => (
            <div
              key={blog._id}
              onClick={() => navigate(`/blog/${blog._id}`)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${categoryColors[blog.category]}`}>
                  {blog.category}
                </span>
                <span className="text-xs text-green-500 font-medium bg-green-50 px-2 py-1 rounded-full">
                  🔒 Anonymous
                </span>
              </div>

              {/* Title */}
           <h3
              style={{ fontFamily: "'Dancing Script', cursive", fontWeight: '900' }}
              className="text-xl text-gray-800 mb-2 line-clamp-2 leading-snug"
            >
              {blog.title}
            </h3>            

              {/* Content preview */}
              <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4">
                {blog.content}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs text-pink-500 font-semibold">
                    {blog.isAnonymous ? 'A' : blog.author?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-400">
                    {blog.isAnonymous ? 'Anonymous' : blog.author?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short'
                    })}
                  </span>
                  <button
                    onClick={(e) => handleLike(e, blog._id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-500 transition"
                  >
                    ❤️ {blog.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Blog