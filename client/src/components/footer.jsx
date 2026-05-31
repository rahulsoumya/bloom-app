import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
  if (!email) return

  setJoined(true)
  setEmail('')

  setTimeout(() => {
    setJoined(false)
  }, 3000)
}

  return (
  <footer
  style={{
    marginTop: '80px',
    background: '#1f2937',
    color: 'white',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    padding: '60px 20px 20px'
  }}
>

  {/* TOP */}
  <div
    style={{
      maxWidth: '1200px',
      margin: 'auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
      gap: '40px'
    }}
  >

    {/* LOGO */}
    <div>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 'bold'
        }}
      >
        🌸 Bloom
      </h1>

      <p
        style={{
          marginTop: '15px',
          color: '#d1d5db',
          lineHeight: '1.7'
        }}
      >
        A safe and modern space for girls to care,
        grow, track health, and connect freely.
      </p>
    </div>

    {/* LINKS */}
    <div>
      <h3 style={{ marginBottom: '20px' }}>
        Quick Links
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: '#d1d5db'
        }}
      >
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/shop')}
        >
          Shop
        </span>

        <span
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/tracker')}
        >
          Period Tracker
        </span>

        <span
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/health')}
        >
          Health
        </span>

        <span
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/blog')}
        >
          Blog
        </span>
      </div>
    </div>

    {/* SUPPORT */}
    <div>
      <h3 style={{ marginBottom: '20px' }}>
        Support
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: '#d1d5db'
        }}
      >
        <span>Privacy Policy</span>
        <span>Terms & Conditions</span>
        <span>Help Center</span>
        <span>Contact Us</span>
      </div>
    </div>

    {/* CONNECT */}
    <div>
      <h3 style={{ marginBottom: '20px' }}>
        Connect
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '15px',
          fontSize: '24px',
          cursor: 'pointer'
        }}
      >
        <span>📷</span>
        <span>🐦</span>
        <span>💬</span>
      </div>
    </div>

  </div>

  {/* DIVIDER */}
  <div
    style={{
      borderTop: '1px solid rgba(255,255,255,0.1)',
      margin: '40px 0 20px'
    }}
  />

  {/* BOTTOM */}
  <div
    style={{
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '14px'
    }}
  >
    © 2026 Bloom — Built with care for every girl 🌸
  </div>

</footer>
)
}

export default Footer


 