import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { AnimalDetails } from 'components/AnimalCard'
import AnimalsTable from 'components/AnimalsTable'

import Modal from 'components/modal'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmOvines } from 'store/slices/farmSlice'

const BatchTable = ({
  animals,
  setAnimals
}: {
  animals: Partial<AnimalType>[]
  setAnimals?: (animals: Partial<AnimalType>[]) => void
}) => {
  const handleSaveBatch = () => {}
  const [animalSelected, setAnimalSelected] =
    useState<Partial<AnimalType | null>>(null)

  const handleOpenAnimal = ({ id, earring }: any) => {
    handleOpenAnimalForm()
    const animal = animals?.find((animal) => animal.earring === earring) || null
    setAnimalSelected(animal)
  }

  const [openAnimalForm, setOpenAnimalForm] = useState(false)
  const handleOpenAnimalForm = () => {
    setOpenAnimalForm(!openAnimalForm)
  }
  const someAreDuplicated = animals.some((animal) => animal.isDuplicated)

  const handleSetDuplicatedAnimal = (
    option: 'FORWARD' | 'DELETE' | 'REPLACE',
    animal: any
  ) => {
    if (option === 'DELETE') {
      setAnimals?.([
        ...animals.filter(({ earring }) => earring !== animal.earring)
      ])
    } else if (option === 'REPLACE') {
      const animalAux = [...animals]
      const animalIndex = animalAux.findIndex(
        ({ earring }) => earring === animal.earring
      )
      const newAnimal = {
        ...animal,
        earring: animal.newEarring
      }
      delete newAnimal.newEarring
      animalAux.splice(animalIndex, 1, newAnimal)
      console.log({ animalAux })
      setAnimals?.([...animalAux])
    } else if (option === 'FORWARD') {
      const animalAux = [...animals]
      const animalIndex = animalAux.findIndex(
        ({ earring }) => earring === animal.earring
      )
      animalAux.splice(animalIndex, 1)
      const lastEarring = animalAux[animalAux.length - 1].earring
      const earringNum = parseInt(lastEarring?.split('-')[0])
      const earringSuffix = lastEarring?.split('-')[1]
      setAnimals?.([
        ...animalAux,
        {
          ...animal,
          earring: `${earringNum + 1}${
            earringSuffix ? '-' + earringSuffix : ''
          }`
        }
      ])
    }
  }

  const ovines = useSelector(selectFarmOvines)
  const findDuplicatesAnimals = (animals: Partial<AnimalType[]>) => {
    return animals.map((animal) => {
      const animalMatch = ovines.some(
        (ovine) => ovine.earring === animal?.earring
      )
      if (animalMatch) {
        return { ...animal, isDuplicated: true }
      } else {
        return { ...animal, isDuplicated: false }
      }
    })
  }
  const [animalsData, setAnimalsData] = useState([...animals])
  useEffect(() => {
    setAnimalsData(findDuplicatesAnimals(animals))
  }, [animals])
  return (
    <div>
      <div className="flex w-full justify-center flex-col items-center mt-4">
        <button
          disabled={someAreDuplicated}
          className="btn my-2 btn-info"
          onClick={(e) => {
            e.preventDefault()
            handleSaveBatch()
          }}
        >
          Guardar lote
        </button>
        <div className="text-center">
          {someAreDuplicated && (
            <span className="text-sm italic">
              **Alguno de los aretes esta duplicado. Accede a cada uno para
              decidir que hacer con el**
            </span>
          )}
        </div>
      </div>
      <Modal
        title="Detalles"
        open={openAnimalForm}
        handleOpen={handleOpenAnimalForm}
      >
        <div>
          {animalSelected && (
            <div>
              <EarringOptions
                animal={animalSelected}
                setOption={handleSetDuplicatedAnimal}
              />
              <AnimalDetails animal={animalSelected} />
            </div>
          )}
        </div>
      </Modal>

      <AnimalsTable
        animalsData={animalsData || []}
        onRowClick={handleOpenAnimal}
      />
    </div>
  )
}

const EarringOptions = ({
  setOption,
  animal
}: {
  animal: Partial<AnimalType>
  setOption: (option: 'FORWARD' | 'DELETE' | 'REPLACE', animal?: any) => void
}) => {
  console.log(animal)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex w-full border border-error rounded-md p-2 justify-between">
      <label>
        <input
          value={value}
          onChange={({ target: { value } }) => {
            setError(null)
            setValue(value)
          }}
          type={'text'}
          placeholder={animal.earring}
          className="input input-sm btn-outline "
        />
        {error && <span className="text-error text-sm">{error}</span>}
      </label>
      <button
        className="btn btn-sm btn-error btn-outline"
        onClick={(e) => {
          setOption('DELETE', { ...animal, earring: animal.earring })
          setValue('')
        }}
      >
        Borrar
      </button>
      <button
        className="btn btn-sm btn-info btn-outline"
        onClick={(e) => {
          if (!value) return setError('Asinga un nuevo arete')
          if (value == animal.earring)
            return setError('Asinga un valor diferente al anterior')

          setOption('REPLACE', { ...animal, newEarring: value })
          setValue('')
        }}
      >
        Reemplazar
      </button>
      <button
        className="btn btn-sm btn-info btn-outline"
        onClick={(e) => {
          setOption('FORWARD', { ...animal })
          setValue('')
        }}
      >
        Adelantar
      </button>
    </div>
  )
}

export default BatchTable
