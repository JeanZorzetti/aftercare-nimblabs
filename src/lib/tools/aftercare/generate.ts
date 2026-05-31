import Groq from 'groq-sdk'
import { env } from '@/lib/env'
import { buildPrompt, parseAftercare, type AftercareSheet } from './prompt'
import { recordUsage } from '@/lib/saas-core/usage/usage'

export interface GenerateParams {
  userId: string | null
  procedureSlug: string
  procedureName: string
  clinicName: string
  tone: string
  language: string
}

async function callGroq(prompt: string): Promise<string> {
  const groq = new Groq({ apiKey: env.GROQ_API_KEY })
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  })
  return res.choices[0]?.message?.content ?? ''
}

export async function generateAftercare(params: GenerateParams): Promise<AftercareSheet> {
  const prompt = buildPrompt(params)
  let content: string
  try {
    content = await callGroq(prompt)
  } catch {
    content = await callGroq(prompt)
  }
  const sheet = parseAftercare(content)
  await recordUsage({
    userId: params.userId,
    procedureSlug: params.procedureSlug,
    tone: params.tone,
    language: params.language,
  })
  return sheet
}
