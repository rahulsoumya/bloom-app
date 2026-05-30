import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config'

const categories = ['period', 'hygiene', 'healthcare', 'mentalhealth', 'experience', 'tips']

const WriteBlog = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'experience',
    isAnonymous: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      navigate('/blog')
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <button
        onClick={() => navigate('/blog')}
        className="text-pink-500 text-sm mb-6 flex items-center gap-1 hover:underline max-w-2xl mx-auto"
      >
        ← Back to Blog
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Write your story
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Share your experience — your identity is safe with us 🔒
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              placeholder="Give your story a title..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Category</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition
                    ${form.category === cat
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-pink-50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Your Story</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm leading-relaxed"
              placeholder="Write your story here... this is your safe space 🌸"
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Post Anonymously</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Your name will be hidden from everyone
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-pink-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
          >
            {loading ? 'Posting...' : 'Publish Story 🌸'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default WriteBlog