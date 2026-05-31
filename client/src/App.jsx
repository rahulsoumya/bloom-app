import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import footer from './components/footer'

import Login from './pages/Login'
import Register from './pages/Register'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import AdminPanel from './pages/AdminPanel'
import Tracker from './pages/Tracker'
import Health from './pages/Health'
import ArticleDetail from './pages/ArticleDetail'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import WriteBlog from './pages/WriteBlog'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
import OrderSuccess from './pages/OrderSuccess'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }}
        >

          <Navbar />

          <main style={{ flex: 1 }}>

            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shop"
                element={
                  <ProtectedRoute>
                    <Shop />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shop/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tracker"
                element={
                  <ProtectedRoute>
                    <Tracker />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/health"
                element={
                  <ProtectedRoute>
                    <Health />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/health/:id"
                element={
                  <ProtectedRoute>
                    <ArticleDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <Blog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/blog/write"
                element={
                  <ProtectedRoute>
                    <WriteBlog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/blog/:id"
                element={
                  <ProtectedRoute>
                    <BlogDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order-success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <h1 className="text-center mt-10 text-gray-400 text-2xl">
                    404 — Page not found
                  </h1>
                }
              />

            </Routes>

          </main>

          <footer />
        </div>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App