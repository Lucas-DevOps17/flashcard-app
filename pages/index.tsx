import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'

type Course = 'gda' | 'ibm' | 'py' | 'gen' | 'notion'
type Rating = 'easy' | 'hard' | 'again'
interface Card { course: Course; q: string; a: string }
interface Scores { easy: number; hard: number; again: number }

const STARTER: Card[] = [
  // Google Data Analytics
  { course: 'gda', q: 'What are the 6 phases of the data analysis process?', a: '<strong>Ask → Prepare → Process → Analyze → Share → Act.</strong> Each phase builds on the previous: Ask defines the problem, Prepare gathers data, Process cleans it, Analyze finds patterns, Share communicates insights, Act implements decisions.' },
  { course: 'gda', q: 'What is the difference between structured and unstructured data?', a: '<strong>Structured data</strong> is organized in rows and columns (like spreadsheets or databases). <strong>Unstructured data</strong> has no predefined format — emails, images, videos, and social media posts are examples.' },
  { course: 'gda', q: 'What does SMART stand for in data analysis questions?', a: '<strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>ction-oriented, <strong>R</strong>elevant, <strong>T</strong>ime-bound. SMART questions help analysts stay focused and lead to useful, actionable insights.' },
  { course: 'gda', q: 'What is data bias and why does it matter?', a: 'Data bias is when data is collected in a way that skews results. It matters because biased data leads to <strong>wrong conclusions</strong>. Common types: sampling bias, observer bias, confirmation bias.' },
  { course: 'gda', q: 'What is the difference between a metric and a dimension?', a: '<strong>Metrics</strong> are measurable, quantitative values (sales revenue, click rate). <strong>Dimensions</strong> are qualitative attributes used to categorize data (country, product category, date). Dimensions slice; metrics measure.' },
  { course: 'gda', q: 'What is data integrity?', a: 'Data integrity means data is <strong>accurate, complete, consistent, and trustworthy</strong> throughout its lifecycle. Without integrity, analysis results cannot be relied upon for decisions.' },
  // IBM Data Analyst
  { course: 'ibm', q: 'What is the difference between a data analyst and a data scientist?', a: 'A <strong>data analyst</strong> focuses on interpreting existing data to answer business questions. A <strong>data scientist</strong> builds predictive models and works with more complex algorithms. Analysts describe; scientists predict.' },
  { course: 'ibm', q: 'What is SQL and what are its four main operations?', a: '<strong>SQL</strong> (Structured Query Language) manages relational databases. The four main operations are <strong>SELECT</strong> (read), <strong>INSERT</strong> (create), <strong>UPDATE</strong> (modify), <strong>DELETE</strong> (remove) — together called CRUD.' },
  { course: 'ibm', q: 'What is the purpose of a JOIN in SQL?', a: 'A <strong>JOIN</strong> combines rows from two or more tables based on a related column. Types: <strong>INNER JOIN</strong> (matching rows only), <strong>LEFT JOIN</strong> (all left + matching right), <strong>RIGHT JOIN</strong>, <strong>FULL OUTER JOIN</strong>.' },
  { course: 'ibm', q: 'What is a primary key vs a foreign key?', a: 'A <strong>primary key</strong> uniquely identifies each row in a table (no duplicates, no nulls). A <strong>foreign key</strong> in one table references the primary key of another table, creating a relationship between them.' },
  { course: 'ibm', q: 'What does ETL stand for in data work?', a: '<strong>Extract, Transform, Load.</strong> ETL is the process of pulling data from source systems, cleaning/transforming it into the right format, and loading it into a data warehouse or database for analysis.' },
  // Python for Everybody
  { course: 'py', q: 'What is the difference between a list and a tuple in Python?', a: 'A <strong>list</strong> is mutable (can be changed): <code>[ ]</code>. A <strong>tuple</strong> is immutable (cannot be changed): <code>( )</code>. Use tuples for fixed data that should not be modified, like coordinates.' },
  { course: 'py', q: 'What does len() do in Python?', a: '<code>len()</code> returns the <strong>number of items</strong> in an object. Works on strings, lists, tuples, dictionaries, and more. Example: <code>len("hello")</code> returns <strong>5</strong>.' },
  { course: 'py', q: 'What is a for loop and how does it work in Python?', a: 'A <strong>for loop</strong> iterates over a sequence. Example: <code>for item in my_list:</code> runs the indented block once for each item. Use <code>range(n)</code> to loop n times.' },
  { course: 'py', q: 'What is a dictionary in Python?', a: 'A <strong>dictionary</strong> stores key-value pairs: <code>{"name": "Lucas", "age": 30}</code>. Keys must be unique. Access values with <code>dict["key"]</code>. Very useful for structured data.' },
  { course: 'py', q: 'What does the import statement do?', a: '<code>import</code> brings in external <strong>libraries/modules</strong> so you can use their functions. Example: <code>import pandas as pd</code> lets you use pandas functions as <code>pd.read_csv()</code>.' },
  { course: 'py', q: 'What is pandas used for in Python?', a: '<strong>Pandas</strong> is a library for data manipulation and analysis. Key objects: <code>DataFrame</code> (table), <code>Series</code> (column). Common operations: reading CSV, filtering rows, grouping, merging datasets.' },
  // General Knowledge
  { course: 'gen', q: 'What is the difference between RAM and storage?', a: '<strong>RAM (Random Access Memory)</strong> is temporary memory your computer uses while running programs — it clears when powered off. <strong>Storage</strong> (SSD/HDD) is permanent memory that holds your files and OS even when off.' },
  { course: 'gen', q: 'What is an API?', a: 'An <strong>API (Application Programming Interface)</strong> is a set of rules that lets two applications talk to each other. Example: when a weather app fetches forecast data, it uses a weather service\'s API behind the scenes.' },
  { course: 'gen', q: 'What is the difference between the internet and the web?', a: 'The <strong>internet</strong> is the global network infrastructure connecting billions of devices. The <strong>web (World Wide Web)</strong> is one service that runs on the internet — the system of websites accessed via browsers.' },
  { course: 'gen', q: 'What is machine learning in simple terms?', a: '<strong>Machine learning</strong> is a type of AI where computers learn patterns from data instead of being explicitly programmed with rules. Example: a spam filter learns what spam looks like from millions of email examples.' },
  { course: 'gen', q: 'What is version control and why is it important?', a: '<strong>Version control</strong> (e.g. Git) tracks every change made to code over time. It lets developers revert mistakes, work on separate features in parallel, and collaborate without overwriting each other\'s work.' },
  { course: 'gen', q: 'What is the difference between a compiler and an interpreter?', a: 'A <strong>compiler</strong> translates all source code to machine code before running (e.g. C++). An <strong>interpreter</strong> executes code line by line at runtime (e.g. Python). Compiled programs are faster; interpreted ones are more flexible.' },
  { course: 'gen', q: 'What is Big O notation?', a: '<strong>Big O notation</strong> describes how an algorithm\'s runtime or space grows as input size increases. <strong>O(1)</strong> = constant, <strong>O(n)</strong> = linear, <strong>O(n²)</strong> = quadratic. It helps compare algorithm efficiency.' },
  { course: 'gen', q: 'What is the difference between a relational and non-relational database?', a: '<strong>Relational (SQL)</strong> stores data in structured tables with fixed schemas — great for complex queries. <strong>Non-relational (NoSQL)</strong> stores flexible data (documents, key-value pairs) — great for scale and unstructured data.' },
  { course: 'gen', q: 'What does CPU stand for and what does it do?', a: '<strong>CPU (Central Processing Unit)</strong> is the brain of a computer — it executes all program instructions. Speed is measured in GHz. More cores allow better multitasking. The GPU handles graphics and parallel computing separately.' },
  { course: 'gen', q: 'What is open source software?', a: '<strong>Open source software</strong> has publicly available source code that anyone can view, modify, and distribute. Examples: Linux, Python, React, VS Code. The opposite is <strong>proprietary/closed source</strong> software like Windows or Photoshop.' },
  { course: 'gen', q: 'What is the difference between frontend and backend development?', a: '<strong>Frontend</strong> is everything the user sees and interacts with (HTML, CSS, JavaScript, React). <strong>Backend</strong> is the server-side logic, databases, and APIs that the frontend calls. Full-stack developers work on both.' },
  { course: 'gen', q: 'What is cloud computing?', a: '<strong>Cloud computing</strong> means using servers, storage, and services hosted on the internet instead of your local machine. Providers like AWS, Google Cloud, and Azure let you rent computing power and only pay for what you use.' },
]

const TAG_LABELS: Record<Course, string> = {
  gda: 'Google Data Analytics',
  ibm: 'IBM Data Analyst',
  py: 'Python',
  gen: 'General Knowledge',
  notion: 'From Notes',
}

const TAG_COLORS: Record<Course, { bg: string; color: string }> = {
  gda:    { bg: 'var(--green-dim)',  color: 'var(--green)' },
  ibm:    { bg: 'var(--blue-dim)',   color: 'var(--blue)' },
  py:     { bg: 'var(--accent-dim)', color: 'var(--accent)' },
  gen:    { bg: '#1e2a1e',           color: '#6fcf97' },
  notion: { bg: '#1f1f2e',           color: '#8b85d4' },
}

const CATEGORY_OPTIONS: Array<{ value: string; label: string; course: Course }> = [
  { value: 'gda', label: 'Google Data Analytics', course: 'gda' },
  { value: 'ibm', label: 'IBM Data Analyst',       course: 'ibm' },
  { value: 'py',  label: 'Python for Everybody',   course: 'py'  },
  { value: 'gen', label: 'General Knowledge',      course: 'gen' },
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [allCards, setAllCards] = useState<Card[]>(STARTER)
  const [filter, setFilter] = useState<'all' | Course>('all')
  const [queue, setQueue] = useState<Card[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [scores, setScores] = useState<Scores>({ easy: 0, hard: 0, again: 0 })
  const [done, setDone] = useState(false)
  const [genText, setGenText] = useState('')
  const [genCategory, setGenCategory] = useState('gda')
  const [genStatus, setGenStatus] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const buildQueue = useCallback(() => {
    const filtered = filter === 'all' ? allCards : allCards.filter(c => c.course === filter)
    setQueue([...filtered].sort(() => Math.random() - 0.5))
    setIndex(0)
    setFlipped(false)
    setScores({ easy: 0, hard: 0, again: 0 })
    setDone(false)
  }, [filter, allCards])

  useEffect(() => { buildQueue() }, [buildQueue])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'SELECT') return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) }
      if (e.key === 'ArrowRight') advance()
      if (e.key === '1' && flipped) rate('again')
      if (e.key === '2' && flipped) rate('hard')
      if (e.key === '3' && flipped) rate('easy')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const advance = () => {
    const next = index + 1
    if (next >= queue.length) { setDone(true); return }
    setIndex(next)
    setFlipped(false)
  }

  const rate = (r: Rating) => {
    setScores(s => ({ ...s, [r]: s[r] + 1 }))
    if (r === 'again') setQueue(q => { const c = [...q]; c.push(c[index]); return c })
    advance()
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const generateCards = async () => {
    if (!genText || genText.trim().length < 20) {
      setGenStatus('⚠️ Please paste some study text first.')
      return
    }
    setGenLoading(true)
    setGenStatus('🤖 Generating flashcards from your notes...')
    const selectedOption = CATEGORY_OPTIONS.find(o => o.value === genCategory)
    const categoryLabel = selectedOption?.label || 'General Knowledge'
    try {
      const res = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: genText.trim(), category: categoryLabel }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGenStatus('❌ ' + (data.error || 'Generation failed. Try again.'))
        return
      }
      const course = selectedOption?.course || 'notion' as Course
      const newCards: Card[] = data.cards
        .filter((c: { q?: unknown; a?: unknown }) => c.q && c.a)
        .map((c: { q: string; a: string }) => ({ q: c.q, a: c.a, course }))
      setAllCards(prev => [...prev, ...newCards])
      setGenText('')
      setGenStatus(`✅ ${newCards.length} cards added to ${categoryLabel}!`)
      showToast(`${newCards.length} new ${categoryLabel} cards created! 🎉`)
    } catch {
      setGenStatus('❌ Network error. Check your connection and try again.')
    } finally {
      setGenLoading(false)
    }
  }

  if (status === 'loading' || !session) return null

  const card = queue[index]
  const progress = queue.length ? (index / queue.length) * 100 : 0
  const firstName = session.user?.name?.split(' ')[0] || 'there'

  const filters: Array<{ key: 'all' | Course; label: string }> = [
    { key: 'all', label: 'All Courses' },
    { key: 'gda', label: 'Google Data Analytics' },
    { key: 'ibm', label: 'IBM Data Analyst' },
    { key: 'py',  label: 'Python' },
    { key: 'gen', label: 'General Knowledge' },
  ]

  return (
    <>
      <Head><title>Lucas & Ava — Flashcards</title></Head>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
          Lucas &amp; <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Ava</em>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {session.user?.image && <img src={session.user.image} alt="" style={{ width: 30, height: 30, borderRadius: '50%' }} />}
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Hi, {firstName}!</span>
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ padding: '5px 14px', borderRadius: '99px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: '12px', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--muted)' }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >Sign out</button>
        </div>
      </div>

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem 4rem', minHeight: 'calc(100vh - 61px)' }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding: '7px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 500, border: `1px solid ${filter === f.key ? 'var(--accent)' : 'var(--border)'}`, background: filter === f.key ? 'var(--accent)' : 'var(--surface)', color: filter === f.key ? '#0f0e0c' : 'var(--muted)', transition: 'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '28px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Cards',  val: queue.length,  color: 'var(--accent)' },
            { label: 'Easy',   val: scores.easy,   color: 'var(--green)' },
            { label: 'Hard',   val: scores.hard,   color: 'var(--accent)' },
            { label: 'Review', val: scores.again,  color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: 560, height: 3, background: 'var(--border)', borderRadius: 99, marginBottom: '1rem' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>

        {!done && card ? (
          <>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '1rem' }}>Card {index + 1} of {queue.length}</div>

            {/* Flashcard flip */}
            <div onClick={() => setFlipped(f => !f)} style={{ width: '100%', maxWidth: 560, perspective: '1200px', marginBottom: '1.5rem', cursor: 'pointer' }}>
              <div style={{ position: 'relative', minHeight: 280, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
                {/* Front */}
                <div style={{ position: 'absolute', width: '100%', minHeight: 280, backfaceVisibility: 'hidden', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', borderRadius: 99, padding: '4px 14px', marginBottom: '1.2rem', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: TAG_COLORS[card.course].bg, color: TAG_COLORS[card.course].color }}>{TAG_LABELS[card.course]}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--text)' }}>{card.q}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1.2rem' }}>Tap to reveal answer</div>
                </div>
                {/* Back */}
                <div style={{ position: 'absolute', width: '100%', minHeight: 280, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', borderRadius: 99, padding: '4px 14px', marginBottom: '1.2rem', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: TAG_COLORS[card.course].bg, color: TAG_COLORS[card.course].color }}>{TAG_LABELS[card.course]}</div>
                  <div style={{ fontSize: '1rem', lineHeight: 1.7, color: '#c8c4bb', fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: card.a }} />
                </div>
              </div>
            </div>

            {/* Rating / Skip */}
            {flipped ? (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                {([
                  { r: 'again' as Rating, emoji: '😓', label: 'Again', hBg: 'var(--red-dim)',    hC: 'var(--red)' },
                  { r: 'hard'  as Rating, emoji: '🤔', label: 'Hard',  hBg: 'var(--accent-dim)', hC: 'var(--accent)' },
                  { r: 'easy'  as Rating, emoji: '✅', label: 'Easy',  hBg: 'var(--green-dim)',  hC: 'var(--green)' },
                ]).map(btn => (
                  <button key={btn.r} onClick={() => rate(btn.r)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 28px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px', fontWeight: 500, color: 'var(--muted)', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = btn.hBg; e.currentTarget.style.color = btn.hC; e.currentTarget.style.borderColor = btn.hC }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{btn.emoji}</span>{btn.label}
                  </button>
                ))}
              </div>
            ) : (
              <button onClick={advance}
                style={{ padding: '8px 20px', borderRadius: 99, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: '12px', marginBottom: '1.5rem', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.color = 'var(--text)' }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)' }}>
                Skip →
              </button>
            )}
          </>
        ) : done ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Session Complete! 🎉</div>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '1.5rem' }}>✅ {scores.easy} easy · 🤔 {scores.hard} hard · 😓 {scores.again} to review</p>
            <button onClick={buildQueue}
              style={{ padding: '10px 28px', borderRadius: 99, border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#0f0e0c' }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}>
              Start Over
            </button>
          </div>
        ) : null}

        {/* ── Generate Panel ── */}
        <div style={{ width: '100%', maxWidth: 560, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginTop: 8 }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            ✨ Generate cards from your Notion notes
          </div>

          {/* Category selector */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: 6 }}>Add cards to which course?</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORY_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setGenCategory(opt.value)}
                  style={{ padding: '5px 12px', borderRadius: 99, fontSize: '11px', fontWeight: 500, border: `1px solid ${genCategory === opt.value ? TAG_COLORS[opt.course].color : 'var(--border)'}`, background: genCategory === opt.value ? TAG_COLORS[opt.course].bg : 'transparent', color: genCategory === opt.value ? TAG_COLORS[opt.course].color : 'var(--muted)', transition: 'all 0.15s', cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea + button */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <textarea value={genText} onChange={e => setGenText(e.target.value)}
              placeholder={`Paste your ${CATEGORY_OPTIONS.find(o => o.value === genCategory)?.label || ''} notes here...`}
              style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text)', resize: 'vertical', minHeight: 80, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
            <button onClick={generateCards} disabled={genLoading}
              style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#0f0e0c', fontSize: 13, fontWeight: 600, opacity: genLoading ? 0.5 : 1, flexShrink: 0, transition: 'opacity 0.2s' }}>
              {genLoading ? '...' : 'Generate'}
            </button>
          </div>

          {genStatus && (
            <div style={{ fontSize: 12, color: genStatus.startsWith('❌') ? 'var(--red)' : genStatus.startsWith('✅') ? 'var(--green)' : 'var(--muted)', marginTop: 8 }}>
              {genStatus}
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: 'var(--bg)', padding: '10px 22px', borderRadius: 99, fontSize: 13, zIndex: 100, animation: 'fadeUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        code { background: var(--card-bg); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; font-size: 0.9em; font-family: monospace; color: var(--accent); }
        strong { color: var(--accent); font-weight: 600; }
      `}</style>
    </>
  )
}
