'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  color: 'var(--t1)',
  padding: '12px 16px',
  borderRadius: '10px',
  fontFamily: 'var(--font)',
  fontSize: '14px',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); router.push('/dashboard') }, 1200)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', position: 'relative', background: 'var(--bg)', overflow: 'hidden', fontFamily: 'var(--font)' }}>
      <div className="orb-layer"><div className="orb orb-p" /><div className="orb orb-g" /><div className="orb orb-t" /></div>

      {/* Back */}
      <button onClick={() => router.push('/')}
        style={{ position: 'absolute', top: '24px', left: '32px', background: 'transparent', border: 'none', color: 'var(--t3)', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', zIndex: 10, transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--t1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--t3)'}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back
      </button>

      {/* Left panel — decorative */}
      <div className="login-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', position: 'relative', zIndex: 1, borderRight: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '400px', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)', transition: 'all 0.7s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,var(--purple),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white' }}>P</div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.01em' }}>Personal OS</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', lineHeight: 1.1, marginBottom: '16px' }}>
            Your system<br />awaits you.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--t2)', fontWeight: 400, lineHeight: 1.7, marginBottom: '40px' }}>
            Everything you track, reflect on and build — right where you left it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '⚡', label: '12-day routine streak', color: 'var(--purple)' },
              { icon: '✍', label: '47 journal entries', color: 'var(--teal)' },
              { icon: '🔥', label: 'Fasting at 22h 14m', color: 'var(--orange)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <span style={{ fontSize: '18px' }}>{s.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t1)' }}>{s.label}</span>
                <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right" style={{ width: '480px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', position: 'relative', zIndex: 1, opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}>
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--t1)', marginBottom: '6px' }}>Welcome back.</h2>
          <p style={{ fontSize: '14px', color: 'var(--t2)', fontWeight: 400 }}>Sign in to your private system.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '7px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={inputStyle} required
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '7px' }}>Passphrase</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
              style={inputStyle} required
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--purple)'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'} />
          </div>

          <button type="submit" disabled={loading}
            style={{ marginTop: '8px', width: '100%', padding: '14px', background: loading ? 'var(--surface3)' : 'linear-gradient(135deg,var(--purple),var(--purple-d))', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'var(--font)', fontSize: '15px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', boxShadow: loading ? 'none' : '0 8px 28px var(--purple-g)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {loading
              ? <><svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="12 26" fill="none" /></svg>Entering…</>
              : 'Enter My System'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--t3)', marginTop: '24px', fontWeight: 500 }}>
          Demo — any credentials work
        </p>
      </div>
    </div>
  )
}
