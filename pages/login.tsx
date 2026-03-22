import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/')
  }, [session, router])

  if (status === 'loading') return null

  return (
    <>
      <Head><title>Lucas & Ava — Flashcards</title></Head>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '1rem',
        background: 'var(--bg)',
      }}>

        {/* Decorative circles */}
        <div style={{
          position: 'fixed', top: '-120px', right: '-120px',
          width: '400px', height: '400px', borderRadius: '50%',
          border: '1px solid #2a2318', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed', bottom: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          border: '1px solid #1a1916', pointerEvents: 'none',
        }} />

        {/* Card */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '24px', padding: '3rem 2.5rem', maxWidth: '420px',
          width: '100%', textAlign: 'center', position: 'relative', zIndex: 1,
        }}>

          <div style={{
            fontSize: '2.8rem', marginBottom: '1rem',
            fontFamily: 'Playfair Display, serif', fontWeight: 600,
            color: 'var(--text)', lineHeight: 1.1,
          }}>
            Lucas &amp; <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 400 }}>Ava</em>
          </div>

          <div style={{
            display: 'inline-block', background: 'var(--accent-dim)',
            color: 'var(--accent)', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: '99px', marginBottom: '1.5rem',
          }}>
            Study Flashcard App
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your private study space for<br />
            Google Data Analytics, IBM Data Analyst<br />
            &amp; Python for Everybody.
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', width: '100%', padding: '13px 20px',
              background: 'var(--text)', color: 'var(--bg)',
              border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 600, transition: 'opacity 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          <p style={{ marginTop: '1.2rem', fontSize: '12px', color: 'var(--muted)' }}>
            Only Lucas &amp; Ava's Gmail accounts have access.
          </p>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '12px', color: '#3a3835' }}>
          Mar – May 2026 · Chiang Mai, Thailand
        </p>
      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
