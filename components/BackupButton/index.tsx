import Icon from '@comps/Icon'
import { saveAs } from 'file-saver'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'

const generateJsonFile = ({
  data,
  fieldName = 'data'
}: {
  data: any
  fieldName: string
}) => {
  const jsonData = JSON.stringify(data)
  const blob = new Blob([jsonData], { type: 'application/json' })
  saveAs(blob, `${fieldName}.json`)
}

const BackupButton = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  return (
    <div className="flex w-full justify-center">
      <button
        className="btn btn-ghost"
        onClick={(e) => {
          e.preventDefault()
          generateJsonFile({ data: farmAnimals, fieldName: 'animales' })
        }}
      >
        Respaldo de animales .json{' '}
        <span className="ml-2">
          <Icon name="download" />
        </span>
      </button>
    </div>
  )
}

export default BackupButton
