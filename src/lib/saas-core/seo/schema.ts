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

export function buildArticleSchema(params: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  author: { name: string; role: string; credentials: string; url?: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: params.url,
    image: params.image,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: {
      '@type': 'Person',
      name: params.author.name,
      jobTitle: params.author.role,
      description: params.author.credentials,
      ...(params.author.url ? { url: params.author.url } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'AftercareGen',
      url: 'https://aftercare.nimblabs.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aftercare.nimblabs.com/logo.png',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildHowToSchema(params: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    step: params.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}
