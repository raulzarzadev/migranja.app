import { EventsList } from '@comps/FarmEvents/EventsList'
import GeneticTree from '@comps/GeneticTree'
import useCreateBirth from '@comps/hooks/useCreateBirth'
import ImagesDisplay from '@comps/ImagesDisplay'
import ModalBreedingDetails from '@comps/modal/ModalBreedingDetails'
import ModalGeneticTree from '@comps/modal/ModalGeneticTree'
import AnimalsOptions from '@comps/OvinesTable/AnimalsOptions'
import { deleteAnimal, updateAnimal } from '@firebase/Animal/main'
import AnimalEvents from 'components/AnimalEvents'
import { FemaleOptions, MaleOptions } from 'components/CONSTANTS/GENDER_OPTIONS'
import AnimalForm from 'components/forms/AnimalForm'

import Icon from 'components/Icon'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import {
  AnimalType,
  GenderOptions
} from 'firebase/types.model.ts/AnimalType.model'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmOvines } from 'store/slices/farmSlice'
import { AnimalState, AnimalStateType } from 'types/base/AnimalState.model'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { FarmEvent } from 'types/base/FarmEvent.model'
import { ImageType } from 'types/base/ImageType.model'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const AnimalCard = ({ animalId }: { animalId?: string }) => {
  const [editing, setEditing] = useState<boolean>(false)
  const ovines = useSelector(selectFarmOvines)

  const animal = ovines.find(
    ({ id, earring }) => id === animalId || earring === animalId
  )
  if (!animal)
    return (
      <>
        Este animal no esta. Puede que el arete haya sido modificado o haya sido
        eliminado de la granja de forma permanente
      </>
    )
  return (
    <div className="p-2  ">
      {editing ? (
        <AnimalForm animal={animal} setEditing={setEditing} checkFarmEarrings />
      ) : (
        <AnimalDetails animal={animal} setEditing={setEditing} />
      )}
    </div>
  )
}

export const AnimalDetails = ({
  animal,
  setEditing
}: {
  animal: Partial<AnimalType>
  setEditing?: (boolean: boolean) => void
}) => {
  const {
    earring,
    id,
    batch,
    gender,
    parents,
    images,
    birthday,
    birthType,
    weight,
    breed,
    joinedAt,
    name,
    state
    //currentStatus
  } = animal
  const genderLabel: Record<AnimalType['gender'], GenderOptions> = {
    male: MaleOptions,
    female: FemaleOptions
  }

  // const { handleDelete } = useAnimal()
  const handleDelete = async () => {
    const res = await deleteAnimal(id as string)
    console.log(res)
    return res
  }
  const handleSetImages = (images: string[]) => {
    const auxImages: ImageType[] = images.map((image) => ({
      url: image,
      metadata: ''
    }))
    if (animal.id)
      updateAnimal(animal?.id, { images: auxImages })
        .then((res) => console.log({ res }))
        .catch((err) => console.log({ err }))
  }

  //useDebugInformation('AnimalDetails', animal)
  return (
    <div className="font-normal">
      <div className="flex w-full justify-end ">
        {setEditing && id && (
          <>
            <ModalDelete
              handleDelete={() => handleDelete()}
              title={'Eliminar animal'}
              buttonLabel={null}
              openButtonProps={{
                className: ' btn btn-error btn-circle btn-sm text-'
              }}
            />
            <span className="mx-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setEditing(true)
                }}
                className="text-info btn btn-ghost btn-circle btn-sm"
              >
                <Icon size="sm" name="edit" />
              </button>
            </span>
          </>
        )}
      </div>
      <header className="flex w-full justify-between">
        <div>
          <div>
            <div className="text-xs flex flex-col whitespace-nowrap">
              <span className="flex flex-col">
                <span>
                  Estado actual:
                  <span className="font-bold capitalize">
                    {' '}
                    {AnimalState[state as AnimalStateType] || 'Sin estado '}
                  </span>
                </span>
              </span>
              <span>
                Actualizado:{' '}
                <span className="">
                  {fromNow(animal.updatedAt, { addSuffix: true })}
                </span>
              </span>
              <span>
                id: <span className="">{id}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="text-right ">
          <div>
            <span>Arete:</span>
            <span className="text-2xl font-bold">{earring}</span>
          </div>
          {batch && (
            <div>
              <span>lote:</span>{' '}
              <span className="text-2xl">
                <ModalBreedingDetails breedingBatchId={batch} />
              </span>
            </div>
          )}
          {name && (
            <div>
              <span>Nombre:</span> <span className=" font-bold">{name}</span>
            </div>
          )}
          {breed && (
            <div>
              <span>Raza:</span> <span className=" font-bold">{breed}</span>
            </div>
          )}
          {joinedAt && (
            <div>
              <span>Incorporado:</span>{' '}
              <span className=" font-bold">
                {myFormatDate(joinedAt, 'dd MMM yy')}
              </span>
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="flex w-full">
          <div className="w-1/2">
            Nacimiento
            <div className="pl-2">
              <div>
                <span>Edad: </span>
                <span>{birthday ? fromNow(birthday) : ''}</span>
              </div>
              <div>
                <span>Fecha: </span>
                <span>
                  {birthday ? myFormatDate(birthday, 'dd-MMM-yy') : ''}
                </span>
              </div>

              <div>
                <span>Sexo: </span>
                <span>{genderLabel?.[gender || 'male']?.label}</span>
              </div>
              <div>
                <span>Parto: </span>
                <span>{birthType ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <ImagesDisplay
              images={images?.map((image) => image.url) || []}
              setImages={handleSetImages}
            />
          </div>
        </div>
        <div>
          <div className="my-4 mt-8">
            <ModalGeneticTree animalId={animal?.id || ''} />
            {/* <GeneticTree
              parents={{
                father: {
                  label: parents?.father?.earring || '',
                  id: parents?.father?.id || ''
                },
                mother: {
                  label: parents?.mother?.earring || '',
                  id: parents?.mother?.id || ''
                }
              }}
            /> */}
          </div>
          <div className="">
            Peso
            <div className=" flex w-full justify-around">
              <div className="flex flex-col justify-center text-center">
                <span>Al nacer: </span>
                <span>{weight?.atBirth ?? '-'}</span>
              </div>

              <div className="flex flex-col justify-center text-center">
                <span>Al destete: </span>
                <span>{weight?.atWeaning ?? '-'}</span>
              </div>
              <div className="flex flex-col justify-center text-center">
                <span>A los 6m: </span>
                <span>{weight?.at6Month ?? '-'}</span>
              </div>
              <div className="flex flex-col justify-center text-center">
                <span>A los 12m: </span>
                <span>{weight?.at12Month ?? '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <PendingEvents animalId={animal.id} />
        <AnimalsOptions animalsEarrings={[animal?.earring || '']} />
        <EventsSection animalEarring={animal?.earring || ''} />
      </footer>
    </div>
  )
}
const PendingEvents = ({ animalId }: { animalId?: string }) => {
  const { femalePendingBreedings } = useCreateBirth()
  const [pendingEvents, setPendingEvents] = useState<
    AnimalFormattedWhitGenericEvenData[]
  >([])
  useEffect(() => {
    const breedings = femalePendingBreedings({ femaleId: animalId || '' })
    setPendingEvents([...breedings])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log({ pendingEvents })

  return <EventsList events={pendingEvents} title="Pendientes" />
}
const EventsSection = ({ animalEarring }: { animalEarring: string }) => {
  const [openEvents, setOpenEvents] = useState(false)
  const handleOpen = () => setOpenEvents(!openEvents)
  return (
    <div>
      <button
        className="btn btn-ghost w-full"
        onClick={(e) => {
          e.preventDefault()
          setOpenEvents(!openEvents)
        }}
      >
        {openEvents ? 'Ocultar events' : 'Mostrar eventos'}{' '}
        <span className="ml-2">
          <Icon name="event" />
        </span>
      </button>
      {openEvents && (
        <Modal
          title={`Eventos de ${animalEarring}`}
          open={openEvents}
          handleOpen={handleOpen}
        >
          <AnimalEvents animalEarring={animalEarring} />
        </Modal>
      )}
    </div>
  )
}

export default AnimalCard
