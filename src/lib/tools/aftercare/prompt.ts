export interface AftercareSheet {
  title: string
  sections: { heading: string; items: string[] }[]
}

export function buildPrompt(params: { procedureName: string; clinicName: string; tone: string; language: string }): string {
  return `You are a medical-aesthetics assistant writing patient-facing AFTERCARE instructions (NOT consent, NOT medical advice).
Procedure: ${params.procedureName}
Clinic name: ${params.clinicName}
Tone: ${params.tone}
Language: ${params.language}

Write practical post-procedure aftercare for the patient to take home.
Respond ONLY with strict JSON matching:
{"title": string, "sections": [{"heading": string, "items": string[]}]}
Include sections: "What to expect", "Do", "Don't", "When to contact ${params.clinicName}".
Keep each item short and clear. Do not include any text outside the JSON.`
}

export function parseAftercare(raw: string): AftercareSheet {
  let text = raw.trim()
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) text = fence[1].trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Failed to parse aftercare output: no JSON found')
  try {
    const obj = JSON.parse(text.slice(start, end + 1))
    if (!obj.title || !Array.isArray(obj.sections)) throw new Error('shape')
    return obj as AftercareSheet
  } catch {
    throw new Error('Failed to parse aftercare output: invalid JSON')
  }
}
