import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Unauthorized() {
  const router = useRouter()
  return (
    <>
      <Head><title>Access Denied</title></Head>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '2rem',
        background: 'var(--bg)', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontSize: '2rem',
          color: 'var(--text)', marginBottom: '0.75rem',
        }}>Access Denied</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '360px', lineHeight: 1.6, marginBottom: '2rem' }}>
          This app is private and only accessible to Lucas &amp; Ava.
          You signed in with an email that isn't on the list.
        </p>
        <button
          onClick={() => router.push('/login')}
          style={{
            padding: '10px 24px', borderRadius: '99px',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--muted)', fontSize: '14px', transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--muted)' }}
          onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          ← Back to Login
        </button>
      </div>
    </>
  )
}
