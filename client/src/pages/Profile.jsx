import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API_URL from '../config'

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-blue-50 text-blue-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-400'
}

const statusEmoji = {
  pending: '🕐',
  confirmed: '✅',
  delivered: '📦',
  cancelled: '❌'
}

const OrdersTab = ({ token, navigate }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    setCancelLoading(id)
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchOrders()
    } catch (err) {
      console.log(err)
    } finally {
      setCancelLoading('')
    }
  }

  if (loading) return <div className="bg-white rounded-2xl shadow-sm p-6"><p className="text-gray-400 text-sm">Loading...</p></div>

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">My Orders</h2>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400 text-sm mb-4">No orders yet!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition"
          >
            Start Shopping 🛍️
          </button>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="border border-gray-100 rounded-xl p-4">

            {/* Order header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                {statusEmoji[order.status]} {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Total + Cancel */}
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <p className="font-bold text-pink-600">₹{order.totalAmount}</p>
              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancelLoading === order._id}
                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition font-medium"
                >
                  {cancelLoading === order._id ? 'Cancelling...' : '✕ Cancel Order'}
                </button>
              )}
              {order.status !== 'pending' && (
                <p className="text-xs text-gray-400 italic">
                  {order.status === 'cancelled' ? 'Order was cancelled' : 'Cannot cancel — already processed'}
                </p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
const Profile = () => {
  const { user, token, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile')

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    age: user?.age || ''
  })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [myBlogs, setMyBlogs] = useState([])
  const [cycleLogs, setCycleLogs] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'blogs') fetchMyBlogs()
    if (activeTab === 'cycle') fetchCycleLogs()
  }, [activeTab])

  const fetchMyBlogs = async () => {
    setDataLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      // filter only user's blogs
      const mine = data.filter(b => b.author?._id === user?.id)
      setMyBlogs(mine)
    } catch (err) {
      console.log(err)
    } finally {
      setDataLoading(false)
    }
  }

  const fetchCycleLogs = async () => {
    setDataLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/cycle`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCycleLogs(data)
    } catch (err) {
      console.log(err)
    } finally {
      setDataLoading(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')
    try {
      const formData = new FormData()
      formData.append('name', profileForm.name)
      formData.append('age', profileForm.age)
      if (photo) formData.append('photo', photo)

      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) { setProfileError(data.message); return }
      updateUser(data.user)
      setPhotoPreview(data.user.photo)  // ← update with cloudinary URL
      setPhoto(null)                     // ← clear local file
      setProfileSuccess('Profile updated successfully!')
    } catch (err) {
      setProfileError('Something went wrong')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')
    try {
      const res = await fetch(`${API_URL}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })
      const data = await res.json()
      if (!res.ok) { setPasswordError(data.message); return }
      setPasswordSuccess('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError('Something went wrong')
    } finally {
      setPasswordLoading(false)
    }
  }

  const moodEmoji = {
    happy: '😊', sad: '😢', angry: '😠', anxious: '😰', normal: '😐'
  }

  const sidebarItems = [
    { key: 'profile', icon: '👤', label: 'Profile' },
    { key: 'orders', icon: '📦', label: 'My Orders' },
    { key: 'blogs', icon: '✏️', label: 'My Blogs' },
    { key: 'cycle', icon: '🗓️', label: 'Cycle History' },
    { key: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4">

            {/* Avatar */}
            <div className="text-center pb-4 border-b border-gray-100 mb-3">
              <div className="w-16 h-16 rounded-full bg-pink-500 border-4 border-pink-100 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                {user?.photo ? (
                  <img src={user.photo} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block font-medium
                ${user?.role === 'admin'
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-pink-50 text-pink-600'
                }`}>
                {user?.role}
              </span>
            </div>

            {/* Nav items */}
            {sidebarItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-1 text-left
                  ${activeTab === item.key
                    ? 'bg-pink-50 text-pink-500'
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition text-left"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

              {/* Cover */}
              <div className="h-28 bg-gradient-to-r from-pink-400 to-pink-300" />

              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-10 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-pink-500 border-4 border-white flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-3xl font-bold">
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {profileSuccess && <p className="text-green-500 text-sm mb-4">{profileSuccess}</p>}
                {profileError && <p className="text-red-400 text-sm mb-4">{profileError}</p>}

                <form onSubmit={handleProfileUpdate} className="space-y-4">

                  {/* Photo upload */}
                 <div>
  <label className="text-sm text-gray-600 font-medium">Profile Photo</label>
  <div className="flex items-center gap-4 mt-2">
    <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-100 border-2 border-pink-200 flex-shrink-0 flex items-center justify-center">
      {photoPreview ? (
        <img src={photoPreview} alt="profile" className="w-full h-full object-cover" />
      ) : (
        <span className="text-pink-500 text-2xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </span>
      )}
    </div>
    <div className="flex-1">
      <label
        htmlFor="photo-upload"
        className="cursor-pointer inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-500 text-sm font-medium px-4 py-2 rounded-xl hover:bg-pink-100 transition"
      >
        📷 {photoPreview ? 'Change Photo' : 'Upload Photo'}
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />
      {photo && (
        <p className="text-xs text-gray-400 mt-1">
          ✅ {photo.name} — click Save Changes to upload
        </p>
      )}
      {!photo && user?.photo && (
        <p className="text-xs text-gray-400 mt-1">
          Photo saved to cloud ☁️
        </p>
      )}
    </div>
  </div>
</div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Age</label>
                      <input
                        type="number"
                        value={profileForm.age}
                        onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-medium">Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2 mt-1 text-sm text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-medium">Member Since</label>
                    <input
                      type="text"
                      value={new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                      disabled
                      className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2 mt-1 text-sm text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-pink-500 text-white py-2.5 rounded-xl font-semibold hover:bg-pink-600 transition text-sm"
                  >
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* MY BLOGS TAB */}
          {activeTab === 'blogs' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-6">My Blogs</h2>

              {dataLoading && <p className="text-gray-400 text-sm">Loading...</p>}

              {!dataLoading && myBlogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm mb-4">You haven't written any blogs yet.</p>
                  <button
                    onClick={() => navigate('/blog/write')}
                    className="bg-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition"
                  >
                    Write your first story 🌸
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {myBlogs.map(blog => (
                  <div
                    key={blog._id}
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{blog.title}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {blog.category} •{' '}
                          {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${blog.isAnonymous ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                          {blog.isAnonymous ? '🔒 Anon' : '👤 Named'}
                        </span>
                        <span className="text-xs text-gray-400">🤍 {blog.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* MY ORDERS TAB */}
          {activeTab === 'orders' && (
          <OrdersTab token={token} navigate={navigate} />
          )}

          {/* CYCLE HISTORY TAB */}
          {activeTab === 'cycle' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-6">Cycle History</h2>

              {dataLoading && <p className="text-gray-400 text-sm">Loading...</p>}

              {!dataLoading && cycleLogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm mb-4">No cycle logs yet.</p>
                  <button
                    onClick={() => navigate('/tracker')}
                    className="bg-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 transition"
                  >
                    Go to Tracker 🗓️
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {cycleLogs.map(log => (
                  <div key={log._id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {new Date(log.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                          {' → '}
                          {new Date(log.endDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {moodEmoji[log.mood]} {log.mood}
                          {log.symptoms.length > 0 && ` • ${log.symptoms.join(', ')}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-pink-500 font-medium">
                          {Math.ceil((new Date(log.endDate) - new Date(log.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                        </p>
                      </div>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-gray-400 mt-2 italic">"{log.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-6">Change Password</h2>

              {passwordSuccess && <p className="text-green-500 text-sm mb-4">{passwordSuccess}</p>}
              {passwordError && <p className="text-red-400 text-sm mb-4">{passwordError}</p>}

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-pink-500 text-white py-2.5 rounded-xl font-semibold hover:bg-pink-600 transition text-sm"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Profile