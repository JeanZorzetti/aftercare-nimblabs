import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from '@react-pdf/renderer'
import type { AftercareSheet } from './prompt'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logo: { width: 48, height: 48, marginRight: 12, objectFit: 'contain' },
  clinic: { fontSize: 18, fontWeight: 'bold' },
  title: { fontSize: 14, marginBottom: 12 },
  heading: { fontSize: 12, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  item: { marginBottom: 2 },
  watermark: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', color: '#9ca3af', fontSize: 9 },
})

export interface PdfParams {
  sheet: AftercareSheet
  clinicName: string
  brandColor?: string
  logoUrl?: string
  watermark: boolean
}

export async function renderAftercarePdf(params: PdfParams): Promise<Buffer> {
  const color = params.brandColor || '#111827'
  const doc = (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          {params.logoUrl ? <Image style={styles.logo} src={params.logoUrl} /> : null}
          <Text style={[styles.clinic, { color }]}>{params.clinicName}</Text>
        </View>
        <Text style={[styles.title, { color }]}>{params.sheet.title}</Text>
        {params.sheet.sections.map((s, i) => (
          <View key={i}>
            <Text style={[styles.heading, { color }]}>{s.heading}</Text>
            {s.items.map((it, j) => (
              <Text key={j} style={styles.item}>• {it}</Text>
            ))}
          </View>
        ))}
        {params.watermark ? <Text style={styles.watermark}>Made with AftercareGen — aftercare.nimblabs.com</Text> : null}
      </Page>
    </Document>
  )
  return renderToBuffer(doc)
}
