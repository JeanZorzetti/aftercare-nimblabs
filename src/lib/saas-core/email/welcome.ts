import { PROCEDURES } from '@/lib/tools/aftercare/procedures'

const BASE_URL = 'https://aftercare.nimblabs.com'

function buildWelcomeHtml(): string {
  const links = PROCEDURES.map(
    (p) =>
      `<li style="margin-bottom:6px"><a href="${BASE_URL}/aftercare/${p.slug}" style="color:#6B8E7F">${p.name} aftercare generator</a></li>`
  ).join('')

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2C2A28">
    <h1 style="font-size:22px">Your aftercare template pack is ready</h1>
    <p>Thanks for subscribing to AftercareGen. Here is your starting kit: a generator for every procedure your clinic offers. Each one produces a branded, patient-ready aftercare sheet in seconds — the first 3 each day are free.</p>
    <ul style="padding-left:18px">${links}</ul>
    <p>Two resources clinics find useful on day one:</p>
    <p>
      <a href="${BASE_URL}/blog/aftercare-instructions-template-for-clinics" style="color:#6B8E7F">How to structure aftercare instructions for your clinic</a><br/>
      <a href="${BASE_URL}/blog/switching-from-paper-aftercare-to-digital" style="color:#6B8E7F">Switching from paper aftercare to digital</a>
    </p>
    <p style="margin-top:24px">— The AftercareGen team</p>
    <p style="font-size:12px;color:#7A736B">You received this because you subscribed at ${BASE_URL}. Reply to unsubscribe.</p>
  </div>`
}

// No-op when SMTP isn't configured — the subscriber row is still stored.
export async function sendWelcomeEmail(to: string): Promise<void> {
  const server = process.env.EMAIL_SERVER
  if (!server) return
  const { createTransport } = await import('nodemailer')
  const transport = createTransport(server)
  await transport.sendMail({
    to,
    from: process.env.EMAIL_FROM ?? 'AftercareGen <no-reply@nimblabs.com>',
    subject: 'Your aftercare template pack — 13 procedure generators inside',
    html: buildWelcomeHtml(),
  })
}
