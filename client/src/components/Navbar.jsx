import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowDropdown(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate('/login')
  }

  const goTo = (path) => {
    navigate(path)
    setShowDropdown(false)
  }

  return (
    <>
      {/* Warm gradient blur backdrop */}
      {showDropdown && (
        <div
          className="backdrop-animate fixed inset-0 z-40 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(244,192,209,0.45), rgba(212,83,126,0.25))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}

      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">
            🌸
          </div>
          <span className="text-lg font-bold text-gray-800">Bloom</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/shop" className="text-gray-500 hover:text-pink-500 text-sm font-medium transition">Shop</Link>
          <Link to="/tracker" className="text-gray-500 hover:text-pink-500 text-sm font-medium transition">Period Tracker</Link>
          <Link to="/health" className="text-gray-500 hover:text-pink-500 text-sm font-medium transition">Health</Link>
          <Link to="/blog" className="text-gray-500 hover:text-pink-500 text-sm font-medium transition">Blog</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-gray-500 hover:text-pink-500 text-sm font-medium transition">Admin</Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Cart Icon */}
          {user && (
            <button
              onClick={() => navigate('/cart')}
              className="relative text-gray-500 hover:text-pink-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* Avatar + Dropdown */}
          <div ref={dropdownRef}>
            {user ? (
              <>
                {/* Avatar button */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-9 h-9 rounded-full bg-pink-500 border-2 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200
                    ${showDropdown
                      ? 'border-pink-400 scale-110 shadow-lg shadow-pink-200'
                      : 'border-pink-200 hover:scale-105'
                    }`}
                >
                  {user.photo ? (
                    <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Dropdown — elastic bounce center */}
                {showDropdown && (
                  <div className="dropdown-animate bg-white rounded-2xl shadow-2xl overflow-hidden"
                    style={{ boxShadow: '0 25px 60px rgba(212,83,126,0.25), 0 8px 25px rgba(0,0,0,0.1)' }}
                  >

                    {/* Pink gradient header */}
                    <div style={{ background: 'linear-gradient(135deg, #D4537E, #E891B0)' }}
                      className="px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-white border-opacity-50 flex items-center justify-center overflow-hidden flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.25)' }}
                        >
                          {user.photo ? (
                            <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {user.name?.[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-pink-100 text-xs truncate">{user.email}</p>
                          <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full capitalize font-medium"
                            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2 px-2">
                      {[
                        { icon: '👤', label: 'My Profile', sub: 'View & edit your profile', path: '/profile' },
                        { icon: '🛒', label: `My Cart${totalItems > 0 ? ` (${totalItems})` : ''}`, sub: 'View items in cart', path: '/cart' },
                        { icon: '📦', label: 'My Orders', sub: 'Track your orders', path: '/profile?tab=orders' },
                        { icon: '✏️', label: 'Write Blog', sub: 'Share your story anonymously', path: '/blog/write' },
                        { icon: '⚙️', label: 'Settings', sub: 'Change password & preferences', path: '/profile?tab=settings' },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-pink-50 group"
                        >
                          <span className="text-xl w-7 flex-shrink-0">{item.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-700 group-hover:text-pink-500 transition">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-400">{item.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2 px-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left hover:bg-red-50 transition group"
                      >
                        <span className="text-xl w-7 flex-shrink-0">🚪</span>
                        <div>
                          <p className="text-sm font-medium text-red-400 group-hover:text-red-500 transition">Logout</p>
                          <p className="text-xs text-red-300">Sign out of your account</p>
                        </div>
                      </button>
                    </div>

                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-500 hover:text-pink-500 font-medium transition">Login</Link>
                <Link to="/register" className="bg-pink-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-pink-600 transition font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar