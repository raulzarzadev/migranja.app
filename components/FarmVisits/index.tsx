import { FarmType } from 'types/base/FarmType.model'

const FarmVisits = ({ farm }: { farm?: FarmType }) => {
  return (
    <div>
      <div className="text-center">
        <span>Bienvenido a: {farm?.name}</span>
      </div>
      <div>Detalles e informacion publica de esta granja</div>
    </div>
  )
}

export default FarmVisits
