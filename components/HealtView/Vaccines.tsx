import MenuSection from '@comps/MenuSection'
import MyTable from '@comps/MyTable'
import { myFormatDate } from 'utils/dates/myDateUtils'

const Vaccines = () => {
  return (
    <MenuSection title="Vacunas">
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
    </MenuSection>
  )
}

export default Vaccines
