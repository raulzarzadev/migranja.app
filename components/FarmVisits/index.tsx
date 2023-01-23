import Link from 'next/link'
import Home from 'pages'
import { FarmState } from 'store/slices/farmSlice'

const FarmVisits = ({ farm }: { farm?: FarmState }) => {
  if (!farm)
    return (
      <div>
        <div className="text-center my-16 text-xl">
          <div>Esta granja ya no es publica</div>
          <Link className="btn btn-outline btn-sm mt-10" href={'/'}>
            Regresar
          </Link>
        </div>
        <Home></Home>
      </div>
    )
  return (
    <div>
      <div className="text-center">
        <span>{farm?.name}</span>
      </div>
      <div></div>
    </div>
  )
}

export default FarmVisits
