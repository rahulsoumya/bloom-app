import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f0f2' }}>
      <div style={{ display: 'flex', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(219,39,119,0.15)', width: '100%', maxWidth: 900, minHeight: 520 }}>

        {/* Left Panel */}
        <div style={{ background: 'linear-gradient(135deg, #DB2777, #9333EA)', width: '42%', padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          className="hidden md:flex">
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                🌸
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Bloom</span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>
              Welcome back
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.7 }}>
              Your safe space for health, care & growth. We're glad you're back!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '🗓️', text: 'Track your period cycle' },
              { icon: '🌿', text: 'Read verified health articles' },
              { icon: '✏️', text: 'Share stories anonymously' },
              { icon: '🛍️', text: 'Shop hygiene essentials' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, background: '#fff', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            <span style={{ fontSize: 24 }}>🌸</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>Bloom</span>
          </div>

          <h3 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Login to Bloom</h3>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 28 }}>Enter your details to continue</p>

          {error && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e11d48', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
                style={{ width: '100%', border: '1.5px solid #fce7f3', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#374151', outline: 'none', background: '#fff9fb', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#DB2777'}
                onBlur={e => e.target.style.borderColor = '#fce7f3'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Your password"
                style={{ width: '100%', border: '1.5px solid #fce7f3', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#374151', outline: 'none', background: '#fff9fb', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#DB2777'}
                onBlur={e => e.target.style.borderColor = '#fce7f3'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#f9a8d4' : '#DB2777', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#be185d' }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#DB2777' }}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#DB2777', fontWeight: 600, textDecoration: 'none' }}>
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login