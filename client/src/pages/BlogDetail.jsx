import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config'
const categoryColors = {
  period: 'bg-pink-50 text-pink-600',
  hygiene: 'bg-blue-50 text-blue-600',
  healthcare: 'bg-green-50 text-green-600',
  mentalhealth: 'bg-purple-50 text-purple-600',
  experience: 'bg-orange-50 text-orange-600',
  tips: 'bg-yellow-50 text-yellow-600'
}

const BlogDetail = () => {
  const { id } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) { navigate('/blog'); return }
        setBlog(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const handleLike = async () => {
    if (liked) return
    try {
      const res = await fetch(`${API_URL}/api/blogs/${id}/like`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setBlog(prev => ({ ...prev, likes: data.likes }))
      setLiked(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/blog')
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>
  if (!blog) return null

  const isAuthor = blog.author?._id === user?.id
  console.log('blog.author._id :', blog.author?._id)
console.log('user.id          :', user?.id)
console.log('match?           :', blog.author?._id === user?.id)

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <button
        onClick={() => navigate('/blog')}
        className="text-pink-500 text-sm mb-6 flex items-center gap-1 hover:underline max-w-3xl mx-auto"
      >
        ← Back to Blog
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-15">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className={`text-xs font-medium capitalize px-3 py-1 rounded-full ${categoryColors[blog.category]}`}>
            {blog.category}
          </span>
          <span className="text-xs text-green-500 font-medium bg-green-50 px-2 py-1 rounded-full">
            🔒 {blog.isAnonymous ? 'Anonymous' : blog.author?.name}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(blog.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </span>
        </div>

        {/* Title */}
        <h1
           style={{
             fontFamily: "'Dancing Script', cursive",
             fontWeight: 700,
             fontSize: 38,
             color: 'black',
             marginBottom: 28,
             lineHeight: 1.35
           }}
         >
  {blog.title}
</h1>

        {/* Content */}
      <div
        style={{
          fontFamily: "'Lora', serif",
          color: '#64748b',
          fontSize: 15,
          lineHeight: 1.9,
          whiteSpace: 'pre-line',
          marginBottom: 30
        }}
      >
  {blog.content}
</div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between border-t border-red-300 pt-6">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
              ${liked
                ? 'bg-pink-50 text-pink-500 cursor-default'
                : 'bg-red-300 text-gray-500 hover:bg-pink-50 hover:text-pink-500'
              }`}
          >
            {liked ? '❤️' : '❤️'} {blog.likes} {liked ? 'Liked!' : 'Like'}
          </button>

          {isAuthor && (
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-600 text-sm font-medium transition"
            >
              Delete post
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default BlogDetail