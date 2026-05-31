export function buildFaqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function buildSoftwareAppSchema(params: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: params.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: params.url,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}
