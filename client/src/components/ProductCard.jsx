import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/shop/${product._id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      {/* Product Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <span className="text-xs text-pink-500 font-medium capitalize bg-pink-50 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="text-gray-800 font-semibold mt-2 mb-1">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-pink-600 font-bold text-lg">
            ₹{product.price}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full
            ${product.stock > 0
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-400'
            }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard