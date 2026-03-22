import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { text } = req.body
  if (!text || text.length < 20) return res.status(400).json({ error: 'Text too short' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a flashcard generator for data analytics and Python students.
Read the following study notes and generate 5 high-quality flashcard question/answer pairs.

Rules:
- Questions should test understanding, not just memorization
- Answers should be concise but complete (2-4 sentences max)
- Use <strong> tags for key terms in answers
- Return ONLY a valid JSON array, no markdown, no backticks, no preamble

Format exactly like this:
[{"q": "question text", "a": "answer with <strong>key terms</strong>"}, ...]

Study notes:
${text}`,
        }],
      }),
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))

    const raw = (data.content || []).map((b) => b.text || '').join('')
    const jsonMatch = raw.match(/\[.*\]/s)
    if (!jsonMatch) throw new Error('No JSON array in response: ' + raw.substring(0, 200))
    const cards = JSON.parse(jsonMatch[0])
    return res.status(200).json({ cards })
  } catch (err) {
    console.error('Generate cards error:', err.message)
    return res.status(500).json({ error: err.message || 'Generation failed' })
  }
}
