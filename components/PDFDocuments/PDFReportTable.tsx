import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  table: {
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 8,
    paddingBottom: 8
  },
  header: {
    borderTop: 'none'
  },
  bold: {
    fontWeight: 'bold'
  },
  // So Declarative and unDRY 👌
  row1: {
    width: '10%'
  },
  row2: {
    width: '20%'
  },
  row3: {
    width: '10%'
  },
  row4: {
    width: '30%'
  },
  row5: {
    width: '27%'
  }
})

const PDFReportTable = ({
  data
}: {
  data: {
    earring: string
    name: string
  }[]
}) => {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <Text style={styles.row1}>No.</Text>
        <Text style={styles.row2}>Existe</Text>
        <Text style={styles.row3}>Arete</Text>
        <Text style={styles.row4}>Nombre</Text>
        <Text style={styles.row5}>Comentarios</Text>
      </View>
      {data.map((row, i) => (
        <View key={i} style={styles.row} wrap={false}>
          <Text style={styles.row1}>
            <Text style={styles.bold}>{i + 1}</Text>
          </Text>
          <Text style={styles.row2}>{}</Text>
          <Text style={styles.row3}>{row.earring}</Text>
          <Text style={styles.row4}>{row.name}</Text>
          <Text style={styles.row5}></Text>
        </View>
      ))}
    </View>
  )
}

export default PDFReportTable
