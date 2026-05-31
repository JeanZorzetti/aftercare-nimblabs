import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from '@react-pdf/renderer'
import type { AftercareSheet } from './prompt'

// Sage Spa palette for PDF (must use hex, react-pdf doesn't use CSS vars)
const SAGE = '#6B8E7F'
const NUDE = '#C9A98C'
const OFF_WHITE = '#FBFAF8'
const FOREGROUND = '#2C2A28'
const MUTED = '#7A736B'
const BORDER = '#E7E1D8'

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    backgroundColor: OFF_WHITE,
  },
  // Accent bar at top
  topBar: {
    backgroundColor: SAGE,
    height: 6,
  },
  content: {
    padding: 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: 'solid',
  },
  logo: {
    width: 44,
    height: 44,
    marginRight: 12,
    objectFit: 'contain',
  },
  clinicName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: FOREGROUND,
    letterSpacing: 0.3,
  },
  clinicTagline: {
    fontSize: 9,
    color: MUTED,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: FOREGROUND,
    marginBottom: 20,
    lineHeight: 1.3,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: SAGE,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  item: {
    fontSize: 10.5,
    color: FOREGROUND,
    marginBottom: 4,
    lineHeight: 1.5,
    paddingLeft: 10,
  },
  bullet: {
    color: NUDE,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: 'solid',
    marginVertical: 14,
  },
  watermark: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    textAlign: 'center',
    color: BORDER,
    fontSize: 8.5,
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8.5,
    color: MUTED,
  },
})

export interface PdfParams {
  sheet: AftercareSheet
  clinicName: string
  brandColor?: string
  logoUrl?: string
  watermark: boolean
}

export async function renderAftercarePdf(params: PdfParams): Promise<Buffer> {
  const accentColor = params.brandColor || SAGE

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top accent bar */}
        <View style={[styles.topBar, { backgroundColor: accentColor }]} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            {params.logoUrl ? (
              <Image style={styles.logo} src={params.logoUrl} />
            ) : null}
            <View>
              <Text style={[styles.clinicName, { color: accentColor }]}>
                {params.clinicName}
              </Text>
              <Text style={styles.clinicTagline}>AFTERCARE INSTRUCTIONS</Text>
            </View>
          </View>

          {/* Sheet title */}
          <Text style={styles.title}>{params.sheet.title}</Text>

          {/* Sections */}
          {params.sheet.sections.map((s, i) => (
            <View key={i} style={styles.sectionBlock}>
              <Text style={[styles.sectionHeading, { color: accentColor }]}>
                {s.heading}
              </Text>
              {s.items.map((it, j) => (
                <Text key={j} style={styles.item}>
                  <Text style={styles.bullet}>• </Text>
                  {it}
                </Text>
              ))}
              {i < params.sheet.sections.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* Footer / watermark */}
        {params.watermark ? (
          <Text style={styles.watermark}>
            Made with AftercareGen — aftercare.nimblabs.com
          </Text>
        ) : (
          <View style={styles.footer}>
            <Text style={styles.footerText}>{params.clinicName}</Text>
            <Text style={styles.footerText}>aftercare.nimblabs.com</Text>
          </View>
        )}
      </Page>
    </Document>
  )

  return renderToBuffer(doc)
}
