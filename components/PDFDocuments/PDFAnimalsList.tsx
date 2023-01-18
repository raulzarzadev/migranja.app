import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import PDFReportTable from './PDFReportTable'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

// Create Document Component
const PDFAnimalsList = ({ animals, title }: any) => (
  <Document author="ranchito.digital" title={`lista-de-animales_${title}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Lista de animles {title}</Text>
        <PDFReportTable
          data={animals.map((animal: any) => {
            return { earring: animal.earring, name: animal.name }
          })}
        />
        {/* {animals.map((animal, i) => (
          <Text key={`${animal.id}-${i}`}>{animal.earring}</Text>
        ))} */}
      </View>
    </Page>
  </Document>
)

export default PDFAnimalsList
