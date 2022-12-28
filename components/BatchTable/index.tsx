import { createAnimal } from '@firebase/Animal/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { async } from '@firebase/util'
import { AnimalDetails } from 'components/AnimalCard'
import AnimalsTable from 'components/AnimalsTable'
import useFarm from 'components/hooks/useFarm'

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
      const lastEarring = animalAux[animalAux.length - 1].earring || ''
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
  const findDuplicatesAnimals = (animals: Partial<AnimalType>[]) => {
    return animals.map((animal) => {
      const animalMatch = [...ovines].some(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animals])

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { currentFarm } = useFarm()

  const handleSaveBatch = async () => {
    console.log('save', { animalsData })
    setLoading(true)
    setProgress(1)
    const farmData = {
      id: currentFarm.id,
      name: currentFarm.name
    }

    try {
      for (let animal = 0; animal < animalsData.length; animal++) {
        const element = animalsData[animal]
        await createAnimal({ ...element, farm: farmData })
        setProgress((animal * 100) / animalsData.length)
      }
      setProgress(100)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      <div className="flex w-full justify-center flex-col items-center mt-4">
        {progress === 1 && <span>Preparando</span>}
        {progress > 1 && progress < 100 && (
          <span className="flex flex-col justify-center w-full mx-auto text-center">
            Subiendo
            <progress
              max={100}
              value={progress}
              className="progress w-[200px] mx-auto"
            ></progress>
          </span>
        )}
        {progress === 100 && (
          <span className="flex flex-col justify-center  mx-auto text-center ">
            Listo
            <button
              onClick={() => {
                setProgress(0)
                setAnimalsData([])
              }}
              className="btn btn-sm"
            >
              limpiar
            </button>
          </span>
        )}
        <button
          disabled={someAreDuplicated || loading || progress === 100}
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
        setSelectedRow={handleOpenAnimal}
        // onRowClick={handleOpenAnimal}
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
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex w-full border border-error rounded-md p-2 justify-between flex-col">
      <div className="form-control w-full ">
        <label className="label">
          <span className="label-text">Arete:</span>
        </label>
        <input
          value={value}
          onChange={({ target: { value } }) => {
            setError(null)
            setValue(value)
          }}
          type={'text'}
          placeholder={animal.earring}
          className="input input-sm input-bordered "
        />
        {error && <span className="text-error text-sm">{error}</span>}
      </div>
      <button
        className="btn btn-sm btn-error btn-outline my-2"
        onClick={(e) => {
          setOption('DELETE', { ...animal, earring: animal.earring })
          setValue('')
        }}
      >
        Borrar
      </button>
      <button
        className="btn btn-sm btn-info btn-outline my-2"
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
        className="btn btn-sm btn-info btn-outline my-2"
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
