import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'

// ── Counter Hook ──
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = target / (duration / 16)
          const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(start))
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

// ── Slide-in Hook ──
const useSlideIn = (direction = 'left', delay = 0) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const base = `transition-all duration-700 ease-out`
  const style = {
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' :
      direction === 'left' ? 'translateX(-60px)' :
      direction === 'right' ? 'translateX(60px)' :
      'translateY(40px)',
  }

  return { ref, style, className: base }
}

// ── Stats Section ──
const StatsSection = () => {
  const girls = useCounter(11089, 2500)
  const anonymous = useCounter(100, 2000)
  const products = useCounter(500, 2000)

  return (
    <div className="flex items-center gap-12 flex-wrap justify-center">
      <div ref={girls.ref} className="text-center">
        <p className="text-4xl font-bold text-pink-400">{girls.count.toLocaleString()}+</p>
        <p className="text-xs text-gray-400 mt-0.5">Girls on Bloom</p>
      </div>
      <div className="w-px h-8 bg-gray-100" />
      <div ref={anonymous.ref} className="text-center">
        <p className="text-4xl font-bold text-purple-400">{anonymous.count}%</p>
        <p className="text-xs text-gray-400 mt-0.5">Anonymous blogging</p>
      </div>
      <div className="w-px h-8 bg-gray-100" />
      <div className="text-center">
        <p className="text-4xl font-bold text-green-400">4-in-1</p>
        <p className="text-xs text-gray-400 mt-0.5">Platform features</p>
      </div>
      <div className="w-px h-8 bg-gray-100" />
      <div ref={products.ref} className="text-center">
        <p className="text-4xl font-bold text-orange-400">{products.count}+</p>
        <p className="text-xs text-gray-400 mt-0.5">Products available</p>
      </div>
    </div>
  )
}

// ── Data ──
const features = [
  { title: 'Shop', desc: 'Hygiene & wellness products delivered discreetly', route: '/shop', bg: '#FFF0F5', border: '#FBCFE8', accent: '#DB2777', glow: 'rgba(219,39,119,0.4)' },
  { title: 'Period Tracker', desc: 'Smart cycle tracking with mood & symptom logs', route: '/tracker', bg: '#F5F3FF', border: '#DDD6FE', accent: '#6D28D9', glow: 'rgba(109,40,217,0.4)' },
  { title: 'Health Hub', desc: 'Verified health info & expert Q&A', route: '/health', bg: '#F0FDF4', border: '#BBF7D0', accent: '#047857', glow: 'rgba(4,120,87,0.4)' },
  { title: 'Anon Blog', desc: 'Share your story — no name, no judgment', route: '/blog', bg: '#FFF7ED', border: '#FED7AA', accent: '#C2410C', glow: 'rgba(194,65,12,0.4)' },
]

const steps = [
  { number: '01', title: 'Create your account', desc: 'Sign up in seconds — just your email, nothing more.' },
  { number: '02', title: 'Track your cycle', desc: 'Log periods, mood, and symptoms. Get smart predictions.' },
  { number: '03', title: 'Shop with confidence', desc: 'Order hygiene essentials — delivered discreetly to your door.' },
  { number: '04', title: 'Read & share freely', desc: 'Access verified health articles. Post your story anonymously.' },
]



const testimonials = [
  { quote: "Bloom helped me understand my cycle for the first time. The tracker is so easy to use!", tag: "Period Tracker", color: '#DB2777' },
  { quote: "I finally found a safe place to share what I was going through. No judgment, just support.", tag: "Anon Blog", color: '#C2410C' },
  { quote: "The health articles are actually written for us — not just medical jargon. Love this!", tag: "Health Hub", color: '#047857' },
  { quote: "Getting pads delivered discreetly changed everything for me. So grateful for Bloom.", tag: "Shop", color: '#6D28D9' },
]

// ── Feature Card ──
const FeatureCard = ({ feature, onClick }) => (
  <div
    onClick={onClick}
    style={{ background: feature.bg, border: `1px solid ${feature.border}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.3s ease' }}
    onMouseEnter={e => {
      const c = e.currentTarget
      c.style.background = feature.accent
      c.style.borderColor = feature.accent
      c.style.transform = 'translateY(-4px)'
      c.style.boxShadow = `0 12px 32px ${feature.glow}`
      c.querySelector('.card-title').style.color = '#fff'
      c.querySelector('.card-desc').style.color = 'rgba(255,255,255,0.8)'
      c.querySelector('.card-arrow').style.color = 'rgba(255,255,255,0.6)'
    }}
    onMouseLeave={e => {
      const c = e.currentTarget
      c.style.background = feature.bg
      c.style.borderColor = feature.border
      c.style.transform = 'translateY(0)'
      c.style.boxShadow = 'none'
      c.querySelector('.card-title').style.color = '#111827'
      c.querySelector('.card-desc').style.color = '#6b7280'
      c.querySelector('.card-arrow').style.color = '#d1d5db'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <span style={{ fontSize: 24 }}>{feature.icon}</span>
      <span className="card-arrow" style={{ color: '#d1d5db', fontSize: 16, transition: 'color 0.3s' }}>↗</span>
    </div>
    <div className="card-title" style={{ fontWeight: 600, fontSize: 19, color: '#111827', marginBottom: 6, transition: 'color 0.3s' }}>{feature.title}</div>
    <div className="card-desc" style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, transition: 'color 0.3s' }}>{feature.desc}</div>
  </div>
)

// ── Main Component ──
const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [activeTestimonial, setActiveTestimonial] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 3500)
    return () => clearInterval(t)
  }, [])

  // Slide refs
  const heroLeft = useSlideIn('left')
  const heroRight = useSlideIn('right', 150)
  const stepsTitle = useSlideIn('up')
  const highlightTitle = useSlideIn('up')
  const testimonialTitle = useSlideIn('up')

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#f8f0f2' }}>

      {/* ── HERO ── */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="inline-block border border-pink-300 text-pink-400 text-xs tracking-widest uppercase px-4 py-1 rounded-full mb-6">
          For every girl, every day
        </div>
        <div className="flex items-center justify-between gap-8">

          {/* Left */}
          <div ref={heroLeft.ref} style={heroLeft.style} className={`flex-1 max-w-xl ${heroLeft.className}`}>
            <h1 className="text-6xl font-bold text-gray-800 leading-tight mb-5">
              Your <span className="text-pink-500 italic">complete</span> space <br />
              for health, care & growth
            </h1>
            <p className="text-gray-400 text-sm max-w-lg mb-7 leading-relaxed">
              Shop hygiene essentials, track your cycle, read real health advice, and
              share your story — all in one safe, private platform built by and for girls.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate(user ? '/shop' : '/register')}
                className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-600 transition-all duration-200 flex items-center gap-2"
              >
                Start with Bloom ↗
              </button>
              <button
                onClick={() => document.getElementById('modules').scrollIntoView({ behavior: 'smooth' })}
                className="border border-gray-200 text-gray-500 px-6 py-3 rounded-2xl font-semibold hover:border-pink-300 hover:text-pink-400 transition-all duration-200"
              >
                Explore features
              </button>
            </div>
          </div>

          {/* Right — illustration box */}
          <div ref={heroRight.ref} style={heroRight.style} className={`hidden lg:flex items-center justify-center ${heroRight.className}`}>
            <div
              className="rounded-full overflow-hidden"
              style={{ width: '340px', height: '340px', backgroundColor: '#FFD6E7' }}
            >
              <img
                src="https://girlified.com.ng/wp-content/uploads/2025/11/4.png"
                alt="Bloom girls"
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-100 max-w-6xl mx-auto" />

      {/* ── STATS ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <StatsSection />
      </div>

      <div className="border-t border-gray-100 max-w-6xl mx-auto" />

      {/* ── MODULES ── */}
      <div id="modules" className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-l tracking-widest text-gray-500 uppercase mb-5 font-bold">Platform modules</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, i) => {
            const s = useSlideIn(i % 2 === 0 ? 'left' : 'right', i * 80)
            return (
              <div key={feature.title} ref={s.ref} style={s.style} className={s.className}>
                <FeatureCard feature={feature} onClick={() => navigate(feature.route)} />
              </div>
            )
          })}
          {user?.role === 'admin' && (
            <div
              onClick={() => navigate('/admin')}
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={e => {
                const c = e.currentTarget
                c.style.background = '#1E293B'; c.style.borderColor = '#1E293B'
                c.style.transform = 'translateY(-4px)'; c.style.boxShadow = '0 12px 32px rgba(30,41,59,0.4)'
                c.querySelector('.admin-title').style.color = '#fff'
                c.querySelector('.admin-desc').style.color = 'rgba(255,255,255,0.8)'
                c.querySelector('.admin-arrow').style.color = 'rgba(255,255,255,0.6)'
              }}
              onMouseLeave={e => {
                const c = e.currentTarget
                c.style.background = '#F8FAFC'; c.style.borderColor = '#E2E8F0'
                c.style.transform = 'translateY(0)'; c.style.boxShadow = 'none'
                c.querySelector('.admin-title').style.color = '#374151'
                c.querySelector('.admin-desc').style.color = '#6b7280'
                c.querySelector('.admin-arrow').style.color = '#d1d5db'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>⚙️</span>
                <span className="admin-arrow" style={{ color: '#d1d5db', fontSize: 16, transition: 'color 0.3s' }}>↗</span>
              </div>
              <div className="admin-title" style={{ fontWeight: 600, fontSize: 19, color: '#374151', marginBottom: 6, transition: 'color 0.3s' }}>Admin</div>
              <div className="admin-desc" style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, transition: 'color 0.3s' }}>Manage content, users & platform settings</div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 max-w-6xl mx-auto" />
      
      {/* ── TESTIMONIALS ── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div ref={testimonialTitle.ref} style={testimonialTitle.style} className={testimonialTitle.className}>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2 font-bold text-center">Community voices</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center ">What girls are saying</h2>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #DB2777, #9333EA)', borderRadius: 20, border: '1px solid #fce7f3', padding: 36, minHeight: 200, position: 'relative', overflow: 'hidden' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              position: i === 0 ? 'relative' : 'absolute',
              inset: 0, padding: 36,
              opacity: i === activeTestimonial ? 1 : 0,
              transform: i === activeTestimonial ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.5s ease',
              pointerEvents: i === activeTestimonial ? 'auto' : 'none',
            }}>
              <div style={{ fontSize: 40,color: 'rgba(255,255,255,0.3)', lineHeight: 1, marginBottom: 12 }}>"</div>
              <p style={{ fontSize: 16, color: '#fff', fontStyle: 'italic', lineHeight: 1.8, marginBottom: 20 }}>{t.quote}</p>
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: '50%',  backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>A</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Anonymous</p>
                  <p style={{ fontSize: 11, color:'black' }}>{t.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActiveTestimonial(i)}
              style={{ borderRadius: 9999, border: 'none', cursor: 'pointer', transition: 'all 0.3s', width: i === activeTestimonial ? 24 : 8, height: 8,backgroundColor: i === activeTestimonial ? '#DB2777' : '#f9a8d4'}}
            />
          ))}
        </div>
      </div>      

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div ref={stepsTitle.ref} style={stepsTitle.style} className={stepsTitle.className}>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2 font-bold">How it works</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Get started in 4 simple steps</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step, i) => {
            const s = useSlideIn(i % 2 === 0 ? 'left' : 'right', i * 100)
            return (
              <div key={step.number} ref={s.ref} style={s.style} className={s.className}>
                <div style={{ background: '#fff', border: '1px solid #fce7f3', borderRadius: 16, padding: 24, transition: 'box-shadow 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(219,39,119,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span style={{ fontSize: 32, fontWeight: 900, color: '#fbcfe8', fontFamily: 'serif' }}>{step.number}</span>
                    <span style={{ fontSize: 28 }}>{step.icon}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 6 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-gray-100 max-w-6xl mx-auto" />

     



      {/* ── CTA BANNER ── */}
      <div style={{ background: 'linear-gradient(135deg, #DB2777, #9333EA)', padding: '56px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Ready to bloom? 🌸</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Join thousands of girls who trust Bloom for their health, care, and community.
        </p>
        <button
          onClick={() => navigate(user ? '/shop' : '/register')}
          style={{ background: '#fff', color: '#DB2777', padding: '12px 32px', borderRadius: 14, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {user ? 'Go to Shop ↗' : 'Create Free Account ↗'}
        </button>
      </div>

     

    </div>
  )
}

export default Home