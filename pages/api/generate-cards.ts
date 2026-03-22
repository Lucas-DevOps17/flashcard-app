import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, category } = req.body

  if (!text || typeof text !== 'string' || text.trim().length < 20) {
    return res.status(400).json({ error: 'Text too short — paste at least a sentence or two.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })
  }

  const categoryLabel = category || 'General Knowledge'

  const prompt = `You are a flashcard generator for data analytics and Python students.
Read the following study notes and generate 5 high-quality flashcard question/answer pairs.
These cards are for the category: ${categoryLabel}

Rules:
- Questions should test understanding, not just memorization
- Answers should be concise but complete (2-4 sentences max)
- Use <strong> tags to highlight key terms in answers
- Return ONLY a raw JSON array — no markdown, no backticks, no explanation, nothing else

The response must start with [ and end with ]

Format:
[{"q": "question text here", "a": "answer with <strong>key terms</strong> highlighted"}, ...]

Study notes to turn into flashcards:
${text.trim()}`

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text()
      console.error('Anthropic API error:', anthropicRes.status, errBody)
      return res.status(500).json({ error: `Anthropic API error ${anthropicRes.status}: ${errBody.substring(0, 200)}` })
    }

    const data = await anthropicRes.json()

    if (data.error) {
      console.error('Anthropic returned error:', JSON.stringify(data.error))
      return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) })
    }

    const raw = (data.content || [])
      .map((block: { type: string; text?: string }) => (block.type === 'text' ? block.text || '' : ''))
      .join('')
      .trim()

    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')

    if (start === -1 || end === -1 || end <= start) {
      console.error('No JSON array found. Raw:', raw.substring(0, 300))
      return res.status(500).json({ error: 'AI did not return valid JSON. Raw: ' + raw.substring(0, 150) })
    }

    let cards
    try {
      cards = JSON.parse(raw.substring(start, end + 1))
    } catch (parseErr) {
      console.error('JSON parse failed:', parseErr)
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
    console.error('Generate cards handler error:', message)
    return res.status(500).json({ error: message })
  }
}
