import { useState } from 'react'
import AnimalsForm, { NewAnimal } from './AnimalsForm'
import useModal from './hooks/useModal'
import Modal from './modal'
import { TextField } from '@mui/material'
import useCurrentFarm from './hooks/useCurrentFarm'
import { createAnimal } from '@firebase/Animal/main'
import { FarmType } from 'types/base/FarmType.model'
import { AnimalType } from 'types/base/AnimalType.model'
import ProgressButton from './ProgressButton'
import useProgress from './hooks/useProgress'
import AnimalsCompatTable from './AnimalsCompatTable'

const AddMany = () => {
  const [animals, setAnimals] = useState<NewAnimal[]>([])
  const [batch, setBatch] = useState('')
  const { progress, setProgress } = useProgress()
  const farm = useCurrentFarm()
  const modal = useModal()
  const onSubmit = async (data: {
    animals: NewAnimal[]
    batch: string
    farm: AnimalType['farm']
  }) => {
    console.log(data)
    try {
      for (let i = 0; i <= animals.length; i++) {
        await createAnimal({
          ...animals[i],
          weight: { atBirth: animals[i]?.weight || 0 },
          //@ts-ignore
          farm,
          batch
        })
        setProgress((i / animals.length) * 100)
      }
      setProgress(101)
    } catch (error) {
      console.log({ error })
    }
  }
  const handleClear = () => {
    setAnimals([])
    setBatch('')
  }
  return (
    <div>
      <h3 className="text-center">Crear varios animales</h3>
      <AnimalsForm animals={animals} setAnimals={setAnimals} />
      <div className="flex justify-evenly w-full mt-8 mb-4 ">
        <button
          className="btn btn-outline "
          onClick={(e) => {
            e.preventDefault()
            handleClear()
          }}
        >
          Limpiar
        </button>

        <button
          disabled={!animals.length}
          className="btn btn-info "
          onClick={(e) => {
            e.preventDefault()
            modal.handleOpen()
          }}
        >
          Guardar
        </button>
        <Modal {...modal} title="Crear animales">
          <AnimalsCompatTable animals={animals} />
          <div className="flex justify-center w-full my-8">
            <TextField
              onChange={(e) => {
                setBatch(e.target.value)
              }}
              label={'Lote (opcional)'}
            />
          </div>
          <ProgressButton
            progress={progress}
            onClick={(e) => {
              onSubmit({
                animals,
                batch,
                farm: { id: farm?.id || '', name: farm?.name || '' }
              })
            }}
            successButtonLabel="Cerrar"
            onSuccess={() => {
              modal.handleOpen()
              handleClear()
            }}
          />

          {/* <button
            onClick={(e) => {
              e.preventDefault()
              onSubmit({
                animals,
                batch,
                farm: { id: farm?.id || '', name: farm?.name || '' }
              })
            }}
          >
            Guardar
          </button> */}
        </Modal>
      </div>
    </div>
  )
}

export default AddMany
