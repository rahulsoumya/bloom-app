import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API_URL from '../config'

const categoryColors = {
  nutrition: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  hygiene: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  menstrual: { bg: '#FFF0F5', text: '#DB2777', border: '#FBCFE8' },
  mental: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  skincare: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' }
}

const ArticleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/api/articles/${id}`)
        const data = await res.json()
        if (!res.ok) { setError(data.message); return }
        setArticle(data)
      } catch (err) {
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#FFF8FA' }}>
      <div className="w-8 h-8 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
      <p className="text-sm text-gray-400">Loading article...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#FFF8FA' }}>
      <p className="text-4xl">😔</p>
      <p className="text-sm text-red-400">{error}</p>
    </div>
  )

  const colors = categoryColors[article.category] || { bg: '#FFF0F5', text: '#DB2777', border: '#FBCFE8' }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8FA' }}>

      {/* Top gradient banner */}
      <div
        className="w-full py-6 px-6"
        style={{ background: 'linear-gradient(135deg, #FFE4EF 0%, #F3EEFF 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/health')}
            className="text-pink-500 text-sm flex items-center gap-1 hover:gap-2 transition-all duration-200"
          >
            ← Back to Health Hub
          </button>
        </div>
      </div>

      {/* Main layout — wider */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div
          className="bg-white rounded-3xl overflow-hidden"
          style={{ border: '1.5px solid #FFE4EF' }}
        >

          {/* Two column layout */}
          <div className="flex flex-col lg:flex-row">

            {/* LEFT — Article content */}
            <div className="flex-1 p-8 lg:p-10">

              {/* Category + Meta */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span
                  className="text-xs font-semibold capitalize px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  {article.category}
                </span>
                <span className="text-xs text-gray-400">📖 {article.readTime}</span>
                <span className="text-xs text-gray-400">
                  🗓 {new Date(article.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-snug" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                
                {article.title}
              </h1>

              {/* Divider */}
              <div className="h-px bg-pink-100 mb-6" />

              {/* Content */}
              <div className="text-gray-600 leading-relaxed text-sm space-y-4">
                {article.content.split('\n').filter(p => p.trim() !== '').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Bottom tag */}
              <div
                className="mt-10 rounded-2xl px-5 py-4 flex items-center gap-3"
                style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
              >
                <span className="text-2xl">🌸</span>
                <p className="text-xs leading-relaxed" style={{ color: colors.text }}>
                  This article is part of Bloom's verified health content — written with care for every girl.
                </p>
              </div>

            </div>

            {/* RIGHT — Image */}
            {article.image && (
              <div className="lg:w-96 lg:min-h-full">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
            )}

          </div>
        </div>

        {/* Back button bottom */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/health')}
            className="border border-pink-200 text-pink-400 px-6 py-2.5 rounded-2xl text-sm font-medium hover:bg-pink-50 transition-all duration-200"
          >
            ← Back to Health Hub
          </button>
        </div>

      </div>
    </div>
  )
}

export default ArticleDetail