import MyTable from '@comps/MyTable'
import { myFormatDate } from 'utils/dates/myDateUtils'

const Vaccines = () => {
  return (
    <>
      <MyTable
        data={[
          {
            Nombre: 'Vacuna alfa',
            Fecha: myFormatDate(new Date(), 'dd MMM yy'),
            Aplico: 'Felix Ortega',
            Animales: 34,
            Covertura: '25%'
          },
          {
            Nombre: 'Vacuna beta',
            Fecha: myFormatDate(new Date(), 'dd MMM yy'),
            Aplico: 'Felix Ortega',
            Animales: 204,
            Covertura: '95%'
          }
        ]}
        title="Vacunas aplicadas"
      />
    </>
  )
}

export default Vaccines
