import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'

type Course = 'gda' | 'ibm' | 'py' | 'gen'
type Rating = 'easy' | 'hard' | 'again'
interface Card { course: Course; q: string; a: string }
interface Scores { easy: number; hard: number; again: number }

const STARTER: Card[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // GOOGLE DATA ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────
  { course: 'gda', q: 'What are the 6 phases of the data analysis process?', a: '<strong>Ask → Prepare → Process → Analyze → Share → Act.</strong> Ask defines the problem, Prepare gathers data, Process cleans it, Analyze finds patterns, Share communicates insights, Act implements decisions based on those insights.' },
  { course: 'gda', q: 'What is the difference between structured and unstructured data?', a: '<strong>Structured data</strong> is organized in rows and columns (spreadsheets, databases). <strong>Unstructured data</strong> has no predefined format — emails, images, videos, and social media posts are examples. Most real-world data is unstructured.' },
  { course: 'gda', q: 'What does SMART stand for in data analysis questions?', a: '<strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>ction-oriented, <strong>R</strong>elevant, <strong>T</strong>ime-bound. SMART questions guide analysts toward focused, answerable questions that lead to actionable insights.' },
  { course: 'gda', q: 'What is data bias and name three common types?', a: '<strong>Data bias</strong> is a systematic error that skews analysis results. Three types: <strong>Sampling bias</strong> (non-representative sample), <strong>Observer bias</strong> (analyst assumptions affect interpretation), <strong>Confirmation bias</strong> (only seeking data that confirms existing beliefs).' },
  { course: 'gda', q: 'What is the difference between a metric and a dimension?', a: '<strong>Metrics</strong> are measurable quantitative values — sales revenue, click rate, conversion percentage. <strong>Dimensions</strong> are qualitative attributes used to categorize — country, product name, date. Dimensions slice data; metrics measure it.' },
  { course: 'gda', q: 'What is data integrity and why does it matter?', a: '<strong>Data integrity</strong> means data is accurate, complete, consistent, and trustworthy throughout its lifecycle. Without it, analysis produces unreliable conclusions. Integrity is threatened by entry errors, transfer issues, or system failures.' },
  { course: 'gda', q: 'What is the difference between quantitative and qualitative data?', a: '<strong>Quantitative data</strong> is numerical and measurable — age, revenue, temperature. <strong>Qualitative data</strong> is descriptive and non-numerical — customer reviews, interview responses, colors. Both types serve different analytical purposes.' },
  { course: 'gda', q: 'What is a data type mismatch and why is it a problem?', a: 'A <strong>data type mismatch</strong> occurs when data is stored or processed in the wrong format — e.g. a date stored as text. It causes errors in calculations, sorting, and filtering, leading to incorrect results or broken formulas.' },
  { course: 'gda', q: 'What is the difference between wide data and long data?', a: '<strong>Wide data</strong> has many columns — each variable gets its own column (spreadsheet style). <strong>Long data</strong> has fewer columns but more rows — multiple rows per subject, with variable names in one column and values in another. Long format is preferred for most analysis tools.' },
  { course: 'gda', q: 'What is a data pipeline?', a: 'A <strong>data pipeline</strong> is an automated series of steps that moves and transforms data from source systems to a destination for analysis. It handles ingestion, cleaning, transformation, and loading — ensuring data is consistently available and ready for use.' },
  { course: 'gda', q: 'What is the purpose of data cleaning?', a: '<strong>Data cleaning</strong> fixes or removes inaccurate, incomplete, duplicate, or improperly formatted data. It is essential because dirty data leads to unreliable analysis. Common tasks include handling null values, fixing typos, removing duplicates, and standardizing formats.' },
  { course: 'gda', q: 'What is an outlier and how should you handle it?', a: 'An <strong>outlier</strong> is a data point that differs significantly from others. Handling depends on context: investigate the cause first — it may be a data error (remove it) or a genuinely extreme value (keep it). Never remove outliers without understanding why they exist.' },
  { course: 'gda', q: 'What is a pivot table and what is it used for?', a: 'A <strong>pivot table</strong> is a data summarization tool that lets you reorganize and aggregate data dynamically. You can group rows, calculate totals, averages, or counts, and change the layout interactively — ideal for exploring large datasets quickly.' },
  { course: 'gda', q: 'What is the difference between data verification and data validation?', a: '<strong>Data validation</strong> checks that data meets defined rules before entry (e.g. only accept values 1–5). <strong>Data verification</strong> checks that data was transferred or processed correctly. Validation prevents bad data entering; verification confirms data integrity after processing.' },
  { course: 'gda', q: 'What is a data dictionary?', a: 'A <strong>data dictionary</strong> is a reference document that defines the structure, format, and meaning of each field in a dataset. It describes column names, data types, allowed values, and relationships — essential for understanding unfamiliar datasets.' },

  // ─────────────────────────────────────────────────────────────────────────
  // IBM DATA ANALYST
  // ─────────────────────────────────────────────────────────────────────────
  { course: 'ibm', q: 'What is SQL and what are its four core CRUD operations?', a: '<strong>SQL (Structured Query Language)</strong> manages relational databases. The four CRUD operations are: <strong>SELECT</strong> (read), <strong>INSERT</strong> (create), <strong>UPDATE</strong> (modify), <strong>DELETE</strong> (remove). Every database interaction maps to one of these.' },
  { course: 'ibm', q: 'What is the difference between WHERE and HAVING in SQL?', a: '<strong>WHERE</strong> filters rows before aggregation — it works on individual row data. <strong>HAVING</strong> filters groups after aggregation — it works on the result of GROUP BY. Example: WHERE filters raw sales; HAVING filters aggregated totals per region.' },
  { course: 'ibm', q: 'What are the four SQL JOIN types?', a: '<strong>INNER JOIN</strong> — only matching rows from both tables. <strong>LEFT JOIN</strong> — all rows from left table + matching from right. <strong>RIGHT JOIN</strong> — all rows from right + matching from left. <strong>FULL OUTER JOIN</strong> — all rows from both, with NULLs where no match.' },
  { course: 'ibm', q: 'What is the difference between a primary key and a foreign key?', a: 'A <strong>primary key</strong> uniquely identifies each row in a table — no duplicates, no nulls. A <strong>foreign key</strong> in one table references the primary key of another, creating a relationship between tables. Foreign keys enforce referential integrity.' },
  { course: 'ibm', q: 'What does ETL stand for and what does each step do?', a: '<strong>Extract</strong> — pull raw data from source systems (databases, APIs, files). <strong>Transform</strong> — clean, reformat, and enrich the data to meet target schema requirements. <strong>Load</strong> — write the processed data into a data warehouse or database for analysis.' },
  { course: 'ibm', q: 'What is the difference between a data warehouse and a data lake?', a: 'A <strong>data warehouse</strong> stores structured, processed data ready for analysis — optimized for SQL queries (e.g. Snowflake, BigQuery). A <strong>data lake</strong> stores raw data in any format — structured, semi-structured, or unstructured — at lower cost, used for big data and ML.' },
  { course: 'ibm', q: 'What is database normalization?', a: '<strong>Normalization</strong> organizes a database to reduce data redundancy and improve integrity. It involves splitting data into related tables and using foreign keys to link them. The goal is to ensure each fact is stored in exactly one place, preventing update anomalies.' },
  { course: 'ibm', q: 'What is the difference between a data analyst and a data scientist?', a: 'A <strong>data analyst</strong> interprets existing data to answer business questions using SQL, Excel, and visualization tools — focused on descriptive insights. A <strong>data scientist</strong> builds predictive models using machine learning and statistical methods — focused on future outcomes.' },
  { course: 'ibm', q: 'What is a NULL value in SQL and how do you handle it?', a: 'A <strong>NULL</strong> represents a missing or unknown value — it is not zero or empty string. Handle NULLs with: <strong>IS NULL</strong> / <strong>IS NOT NULL</strong> in WHERE clauses, <strong>COALESCE()</strong> to substitute a default value, or <strong>IFNULL()</strong> / <strong>NULLIF()</strong> depending on the database.' },
  { course: 'ibm', q: 'What is the GROUP BY clause used for in SQL?', a: '<strong>GROUP BY</strong> groups rows that share the same value in specified columns and then applies aggregate functions (SUM, COUNT, AVG, MAX, MIN) to each group. Example: <code>GROUP BY region</code> with <code>SUM(sales)</code> gives total sales per region.' },
  { course: 'ibm', q: 'What is a subquery in SQL?', a: 'A <strong>subquery</strong> is a query nested inside another query. It runs first and its result is used by the outer query. Subqueries can appear in SELECT, FROM, or WHERE clauses. Example: find all employees earning more than the average salary.' },
  { course: 'ibm', q: 'What is the difference between OLTP and OLAP?', a: '<strong>OLTP (Online Transaction Processing)</strong> handles high-volume, real-time transactional operations like order processing or banking. <strong>OLAP (Online Analytical Processing)</strong> is optimized for complex queries and historical analysis across large datasets — used in data warehouses and BI tools.' },
  { course: 'ibm', q: 'What are aggregate functions in SQL? Name five.', a: '<strong>Aggregate functions</strong> perform calculations on a set of rows and return a single value. The five core ones: <strong>COUNT()</strong> — number of rows, <strong>SUM()</strong> — total, <strong>AVG()</strong> — mean, <strong>MAX()</strong> — highest value, <strong>MIN()</strong> — lowest value.' },
  { course: 'ibm', q: 'What is an index in a database and why use it?', a: 'A database <strong>index</strong> is a data structure that speeds up row retrieval for specific columns — similar to a book index. It dramatically improves SELECT query performance on large tables. The tradeoff: indexes consume storage and slow down INSERT/UPDATE/DELETE operations.' },
  { course: 'ibm', q: 'What is a view in SQL?', a: 'A <strong>view</strong> is a virtual table based on the result of a stored SQL query. It does not store data itself — it executes the query each time it is accessed. Views simplify complex queries, provide a consistent interface for users, and can restrict access to sensitive columns.' },

  // ─────────────────────────────────────────────────────────────────────────
  // PYTHON FOR DATA ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────
  { course: 'py', q: 'What is pandas and what are its two main data structures?', a: '<strong>Pandas</strong> is a Python library for data manipulation and analysis. Its two main structures are: <strong>DataFrame</strong> — a 2D table with labeled rows and columns (like a spreadsheet), and <strong>Series</strong> — a single labeled column. Nearly all data work in Python uses DataFrames.' },
  { course: 'py', q: 'How do you read a CSV file into a pandas DataFrame?', a: 'Use <code>pd.read_csv("filename.csv")</code>. Common parameters: <code>sep</code> for delimiter, <code>header</code> for row number of column names, <code>index_col</code> to set a column as the index, <code>usecols</code> to load only specific columns, and <code>dtype</code> to specify column types.' },
  { course: 'py', q: 'How do you filter rows in a pandas DataFrame?', a: 'Use boolean indexing: <code>df[df["column"] > 100]</code> returns rows where the condition is True. For multiple conditions use <code>&</code> (and) or <code>|</code> (or) with parentheses: <code>df[(df["age"] > 25) & (df["city"] == "Bangkok")]</code>.' },
  { course: 'py', q: 'What is the difference between loc and iloc in pandas?', a: '<code>loc</code> selects rows and columns by <strong>label</strong> — uses actual index names and column names. <code>iloc</code> selects by <strong>integer position</strong> — 0-based index like a list. Example: <code>df.loc[0, "name"]</code> vs <code>df.iloc[0, 1]</code>.' },
  { course: 'py', q: 'How do you handle missing values in pandas?', a: 'Check with <code>df.isnull().sum()</code>. Options: <code>df.dropna()</code> removes rows with any NaN, <code>df.fillna(value)</code> replaces NaN with a constant, <code>df.fillna(df.mean())</code> fills with column mean, or <code>df.interpolate()</code> for time-series data.' },
  { course: 'py', q: 'What does groupby() do in pandas?', a: '<code>groupby()</code> splits a DataFrame into groups based on column values, then lets you apply aggregate functions to each group. Example: <code>df.groupby("region")["sales"].sum()</code> gives total sales per region. Equivalent to SQL\'s GROUP BY clause.' },
  { course: 'py', q: 'What is NumPy and why is it important for data analytics?', a: '<strong>NumPy</strong> is a Python library for numerical computing. It provides the <strong>ndarray</strong> — a fast, memory-efficient multi-dimensional array. It is the foundation that pandas, scikit-learn, and most data science libraries are built on. NumPy operations run in optimized C code, making them far faster than Python loops.' },
  { course: 'py', q: 'What is Matplotlib used for and what is a basic plot example?', a: '<strong>Matplotlib</strong> is Python\'s core plotting library. Basic example: <code>import matplotlib.pyplot as plt; plt.plot(x, y); plt.xlabel("X"); plt.ylabel("Y"); plt.title("Title"); plt.show()</code>. It supports line, bar, scatter, histogram, pie, and many other chart types.' },
  { course: 'py', q: 'What is Seaborn and how does it differ from Matplotlib?', a: '<strong>Seaborn</strong> is a statistical visualization library built on Matplotlib. It provides higher-level functions for common statistical plots (heatmaps, pair plots, box plots, violin plots) with better default aesthetics. Seaborn is concise; Matplotlib is flexible and lower-level.' },
  { course: 'py', q: 'What is a list comprehension in Python and why use it?', a: 'A <strong>list comprehension</strong> creates a new list in a single readable line: <code>[x*2 for x in range(10) if x % 2 == 0]</code>. It is more concise and often faster than a for loop. Widely used in data processing to transform or filter collections of values quickly.' },
  { course: 'py', q: 'What does value_counts() do in pandas?', a: '<code>value_counts()</code> returns a Series with the count of each unique value in a column, sorted by frequency descending. Example: <code>df["category"].value_counts()</code>. Useful for quickly understanding the distribution of categorical data.' },
  { course: 'py', q: 'What is the difference between merge() and concat() in pandas?', a: '<code>merge()</code> joins DataFrames based on shared key columns — like SQL JOINs. <code>concat()</code> stacks DataFrames vertically (axis=0) or horizontally (axis=1) without key matching. Use merge for relational joins, concat for combining same-structure tables.' },
  { course: 'py', q: 'What does the describe() function do in pandas?', a: '<code>df.describe()</code> generates summary statistics for all numeric columns: <strong>count, mean, std, min, 25th percentile (Q1), median (50%), 75th percentile (Q3), max</strong>. Essential first step for understanding a dataset\'s distribution and spotting anomalies.' },
  { course: 'py', q: 'What is a lambda function in Python?', a: 'A <strong>lambda</strong> is an anonymous one-line function: <code>lambda x: x * 2</code>. Used with <code>apply()</code> in pandas to transform columns: <code>df["price"].apply(lambda x: x * 1.07)</code> adds 7% tax to each price. Useful for simple transformations without defining a full function.' },
  { course: 'py', q: 'What is the apply() function in pandas?', a: '<code>apply()</code> applies a function along an axis of a DataFrame — either row-by-row (axis=1) or column-by-column (axis=0). Example: <code>df["name"].apply(str.upper)</code> converts all names to uppercase. Essential for custom transformations that built-in functions cannot handle.' },

  // ─────────────────────────────────────────────────────────────────────────
  // GENERAL KNOWLEDGE — Data, Programming & Computer Science
  // ─────────────────────────────────────────────────────────────────────────
  { course: 'gen', q: 'What is the difference between supervised and unsupervised machine learning?', a: '<strong>Supervised learning</strong> trains a model on labeled data — the correct answer is provided (e.g. spam/not spam). <strong>Unsupervised learning</strong> finds patterns in unlabeled data without predefined answers (e.g. customer segmentation). Supervised = prediction; unsupervised = discovery.' },
  { course: 'gen', q: 'What is Big O notation and what do O(1), O(n), and O(n²) mean?', a: '<strong>Big O notation</strong> describes how an algorithm\'s runtime scales with input size. <strong>O(1)</strong> = constant time (always same speed). <strong>O(n)</strong> = linear (doubles when input doubles). <strong>O(n²)</strong> = quadratic (4x slower when input doubles). Used to compare algorithm efficiency.' },
  { course: 'gen', q: 'What is an API and how does a REST API work?', a: 'An <strong>API (Application Programming Interface)</strong> lets applications communicate. A <strong>REST API</strong> uses HTTP methods: <strong>GET</strong> (retrieve), <strong>POST</strong> (create), <strong>PUT/PATCH</strong> (update), <strong>DELETE</strong> (remove). Data is typically exchanged in JSON format via URLs called endpoints.' },
  { course: 'gen', q: 'What is version control and what are the core Git commands?', a: '<strong>Version control</strong> tracks code changes over time. Core Git commands: <code>git init</code> (start repo), <code>git add</code> (stage changes), <code>git commit</code> (save snapshot), <code>git push</code> (upload to remote), <code>git pull</code> (download changes), <code>git branch</code> (manage branches).' },
  { course: 'gen', q: 'What is the difference between a relational and non-relational database?', a: '<strong>Relational (SQL)</strong> databases store data in structured tables with fixed schemas and use SQL — great for complex queries and transactions (e.g. PostgreSQL, MySQL). <strong>Non-relational (NoSQL)</strong> store flexible data as documents, key-value pairs, or graphs — great for scale and unstructured data (e.g. MongoDB, Redis).' },
  { course: 'gen', q: 'What is cloud computing and what are the three main service models?', a: '<strong>Cloud computing</strong> delivers computing resources over the internet on-demand. Three models: <strong>IaaS</strong> (Infrastructure as a Service — virtual machines, storage), <strong>PaaS</strong> (Platform as a Service — managed runtimes and databases), <strong>SaaS</strong> (Software as a Service — ready-to-use apps like Google Workspace).' },
  { course: 'gen', q: 'What is the difference between RAM and storage (SSD/HDD)?', a: '<strong>RAM</strong> is temporary, fast memory that holds data actively being used — it clears when powered off. <strong>Storage</strong> (SSD/HDD) is permanent memory that persists data between sessions. More RAM allows more programs to run simultaneously; more storage holds more files and data.' },
  { course: 'gen', q: 'What is a data model and what are the three common types?', a: 'A <strong>data model</strong> defines how data is structured, stored, and related. Three types: <strong>Conceptual</strong> — high-level overview of entities and relationships. <strong>Logical</strong> — detailed structure without implementation specifics. <strong>Physical</strong> — actual database implementation with tables and columns.' },
  { course: 'gen', q: 'What is JSON and why is it widely used in data work?', a: '<strong>JSON (JavaScript Object Notation)</strong> is a lightweight text format for storing and exchanging data using key-value pairs and arrays. It is human-readable, language-agnostic, and natively supported by APIs, databases, and Python. Most web APIs return data as JSON.' },
  { course: 'gen', q: 'What is the difference between a compiler and an interpreter?', a: 'A <strong>compiler</strong> translates the entire source code into machine code before execution (e.g. C++, Java). An <strong>interpreter</strong> executes code line by line at runtime (e.g. Python, R). Python is interpreted — great for interactive analysis; compiled languages run faster but require a build step.' },
  { course: 'gen', q: 'What is open source software? Give examples relevant to data analytics.', a: '<strong>Open source software</strong> has publicly available source code that anyone can view, modify, and distribute. Key data analytics examples: <strong>Python</strong>, <strong>R</strong>, <strong>pandas</strong>, <strong>NumPy</strong>, <strong>Matplotlib</strong>, <strong>PostgreSQL</strong>, <strong>Apache Spark</strong>, <strong>Jupyter Notebook</strong>, <strong>VS Code</strong>.' },
  { course: 'gen', q: 'What is a Jupyter Notebook and why is it popular for data analysis?', a: 'A <strong>Jupyter Notebook</strong> is an interactive document that combines live code, outputs, visualizations, and markdown text in a single file. It allows step-by-step analysis where you can run individual cells, see results immediately, and document your thinking — ideal for exploratory data analysis.' },
  { course: 'gen', q: 'What is the difference between correlation and causation?', a: '<strong>Correlation</strong> means two variables move together — when one changes, the other tends to also. <strong>Causation</strong> means one variable directly causes a change in another. Correlation does not imply causation — ice cream sales and drowning rates both rise in summer, but ice cream does not cause drowning.' },
  { course: 'gen', q: 'What is a data visualization and what makes one effective?', a: 'A <strong>data visualization</strong> represents data graphically to communicate patterns, trends, or comparisons. Effective ones are: <strong>accurate</strong> (not misleading), <strong>simple</strong> (minimal clutter), <strong>appropriate</strong> (right chart type for the data), and <strong>labeled</strong> (clear titles, axes, and legends).' },
  { course: 'gen', q: 'What is the difference between a bar chart and a histogram?', a: 'A <strong>bar chart</strong> compares discrete categories — each bar represents a category (e.g. sales by country). A <strong>histogram</strong> shows the distribution of a single continuous numeric variable — bars represent value ranges (bins). Bar charts have gaps between bars; histograms do not.' },
]

const TAG_LABELS: Record<Course, string> = {
  gda: 'Google Data Analytics',
  ibm: 'IBM Data Analyst',
  py:  'Python for Analytics',
  gen: 'General Knowledge',
}

const TAG_COLORS: Record<Course, { bg: string; color: string }> = {
  gda: { bg: 'var(--green-dim)',  color: 'var(--green)' },
  ibm: { bg: 'var(--blue-dim)',   color: 'var(--blue)' },
  py:  { bg: 'var(--accent-dim)', color: 'var(--accent)' },
  gen: { bg: '#1e2a1e',           color: '#6fcf97' },
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [allCards] = useState<Card[]>(STARTER)
  const [filter, setFilter] = useState<'all' | Course>('all')
  const [queue, setQueue] = useState<Card[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [scores, setScores] = useState<Scores>({ easy: 0, hard: 0, again: 0 })
  const [done, setDone] = useState(false)

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
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
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

  if (status === 'loading' || !session) return null

  const card = queue[index]
  const progress = queue.length ? (index / queue.length) * 100 : 0
  const firstName = session.user?.name?.split(' ')[0] || 'there'

  const filters: Array<{ key: 'all' | Course; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'gda', label: 'Google Data Analytics' },
    { key: 'ibm', label: 'IBM Data Analyst' },
    { key: 'py',  label: 'Python' },
    { key: 'gen', label: 'General Knowledge' },
  ]

  return (
    <>
      <Head><title>Flashcard Study App</title></Head>

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
            onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
            Sign out
          </button>
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

            {/* Flashcard */}
            <div onClick={() => setFlipped(f => !f)} style={{ width: '100%', maxWidth: 560, perspective: '1200px', marginBottom: '1.5rem', cursor: 'pointer' }}>
              <div style={{ position: 'relative', minHeight: 280, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
                {/* Front */}
                <div style={{ position: 'absolute', width: '100%', minHeight: 280, backfaceVisibility: 'hidden', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', borderRadius: 99, padding: '4px 14px', marginBottom: '1.2rem', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: TAG_COLORS[card.course].bg, color: TAG_COLORS[card.course].color }}>{TAG_LABELS[card.course]}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--text)' }}>{card.q}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1.2rem' }}>Tap to reveal answer</div>
                </div>
                {/* Back */}
                <div style={{ position: 'absolute', width: '100%', minHeight: 280, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', borderRadius: 99, padding: '4px 14px', marginBottom: '1.2rem', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: TAG_COLORS[card.course].bg, color: TAG_COLORS[card.course].color }}>{TAG_LABELS[card.course]}</div>
                  <div style={{ fontSize: '0.95rem', lineHeight: 1.75, color: '#c8c4bb', fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: card.a }} />
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
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        code { background: var(--card-bg); border: 1px solid var(--border); border-radius: 4px; padding: 1px 6px; font-size: 0.85em; font-family: monospace; color: var(--accent); }
        strong { color: var(--accent); font-weight: 600; }
      `}</style>
    </>
  )
}
