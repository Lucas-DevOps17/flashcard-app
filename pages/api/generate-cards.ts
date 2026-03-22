import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, category } = req.body

  if (!text || typeof text !== 'string' || text.trim().length < 20) {
    return res.status(400).json({ error: 'Text too short' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' })
  }

  const categoryLabel = category || 'General Knowledge'

  const parts = [
    'You are a flashcard generator for data analytics and Python students.',
    'Generate 5 flashcard question/answer pairs from these study notes.',
    'Category: ' + categoryLabel,
    '',
    'Rules:',
    '- Test understanding, not memorization',
    '- Answers: 2-4 sentences max',
    '- Use <strong> tags for key terms',
    '- Return ONLY a JSON array, nothing else, no backticks, no markdown',
    '- Response MUST start with [ and end with ]',
    '',
    'Format: [{"q": "question", "a": "answer with <strong>terms</strong>"}, ...]',
    '',
    'Study notes:',
    text.trim(),
  ]

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: parts.join('\n') }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text()
      return res.status(500).json({ error: `Gemini API error ${geminiRes.status}: ${errBody.substring(0, 200)}` })
    }

    const data = await geminiRes.json()
    const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!raw) {
      return res.status(500).json({ error: 'Gemini returned an empty response.' })
    }

    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')

    if (start === -1 || end === -1 || end <= start) {
      console.error('No JSON array. Raw:', raw.substring(0, 400))
      return res.status(500).json({ error: 'AI did not return a JSON array. Got: ' + raw.substring(0, 150) })
    }

    let cards
    try {
      cards = JSON.parse(raw.substring(start, end + 1))
    } catch {
      return res.status(500).json({ error: 'Failed to parse AI response as JSON.' })
    }

    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(500).json({ error: 'AI returned an empty cards array.' })
    }

    const validCards = cards.filter(
      (c: unknown) =>
        c !== null &&
        typeof c === 'object' &&
        typeof (c as Record<string, unknown>).q === 'string' &&
        typeof (c as Record<string, unknown>).a === 'string'
    )

    return res.status(200).json({ cards: validCards, category: categoryLabel })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Handler error:', message)
    return res.status(500).json({ error: message })
  }
}
