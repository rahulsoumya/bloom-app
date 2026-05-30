import { useState, useEffect } from 'react'
import ArticleCard from '../components/ArticleCard'
import API_URL from '../config'

const categories = ['all', 'nutrition', 'hygiene', 'menstrual', 'mental', 'skincare']

const Health = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchArticles = async (category) => {
    setLoading(true)
    try {
      const url = category === 'all'
  ? `${API_URL}/api/articles`
  : `${API_URL}/api/articles?category=${category}`
      const res = await fetch(url)
      const data = await res.json()
      setArticles(data)
    } catch (err) {
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(selectedCategory)
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">

      <h1 className="text-3xl font-bold text-pink-600 text-center mb-2">
         Health Hub
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Verified health tips — just for you
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

      {loading && <p className="text-center text-gray-400 mt-20">Loading articles...</p>}
      {error && <p className="text-center text-red-400 mt-20">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="text-center text-gray-400 mt-20">No articles found.</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

    </div>
  )
}

export default Health