import { useNavigate } from 'react-router-dom'

const categoryColors = {
  nutrition: 'bg-green-50 text-green-600',
  hygiene: 'bg-blue-50 text-blue-600',
  menstrual: 'bg-pink-50 text-pink-600',
  mental: 'bg-purple-50 text-purple-600',
  skincare: 'bg-orange-50 text-orange-600'
}

const ArticleCard = ({ article }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/health/${article._id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="h-44 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${categoryColors[article.category]}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400">{article.readTime}</span>
        </div>
        <h3 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
          {article.content.substring(0, 100)}...
        </p>
      </div>
    </div>
  )
}

export default ArticleCard