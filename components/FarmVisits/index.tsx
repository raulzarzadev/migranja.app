import { FarmState } from 'store/slices/farmSlice'

const FarmVisits = ({ farm }: { farm?: FarmState }) => {
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
