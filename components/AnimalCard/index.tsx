import { deleteAnimal, getAnimal } from '@firebase/Animal/main'
import AnimalEvents from 'components/AnimalEvents'
import { FemaleOptions, MaleOptions } from 'components/CONSTANTS/GENDER_OPTIONS'
import AnimalForm from 'components/forms/AnimalForm'
import useAnimal from 'components/hooks/useAnimal'

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
import { myFormatDate } from 'utils/dates/myDateUtils'

const AnimalCard = ({ animalId }: { animalId?: string }) => {
  const [editing, setEditing] = useState<boolean>(false)
  const ovines = useSelector(selectFarmOvines)

  const animal = ovines.find(({ id }) => id === animalId)
  if (!animal) return <></>
  return (
    <div className="p-2 ">
      {editing ? (
        <AnimalForm animal={animal} setEditing={setEditing} />
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
  console.log(animal)
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
    name
  } = animal

  const genderLabel: Record<AnimalType['gender'], GenderOptions> = {
    male: MaleOptions,
    female: FemaleOptions
  }

  const { handleDelete } = useAnimal()
  // console.log(animal)
  return (
    <div className="">
      <div className="flex w-full justify-end ">
        {id && (
          <ModalDelete
            handleDelete={() => handleDelete(id)}
            title={'Eliminar animal'}
            buttonLabel={null}
            openButtonProps={{
              className: ' btn btn-error btn-circle btn-sm text-'
            }}
          />
        )}
        {setEditing && (
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
        )}
      </div>
      <header className="flex w-full justify-between">
        <div>
          Detalles de animal
          <div>
            <div className="text-xs">
              <span>id:</span> <span className="">{id}</span>
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
              <span className="text-2xl font-bold">{batch}</span>
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
            <div className="w-full">
              <figure className=" w-full aspect-video flex justify-center items-center bg-base-200 shadow-sm">
                {images?.[0] ? (
                  <Image src={images[0].url} fill alt="animal-photo" />
                ) : (
                  <>
                    <Icon name="camera" />
                  </>
                )}
              </figure>
            </div>
          </div>
        </div>
        <div>
          <div className="">
            Genetica
            <div className=" flex w-full justify-around">
              <div className="flex flex-col justify-center text-center">
                <span>Padre: </span>
                <span>{parents?.father?.earring ?? 'sin'}</span>
              </div>

              <div className="flex flex-col justify-center text-center">
                <span>Sexo: </span>
                <span>{parents?.mother?.earring ?? 'sin'}</span>
              </div>
            </div>
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
        <EventsSection animalEarring={animal.earring} />
      </footer>
    </div>
  )
}
const EventsSection = ({ animalEarring }) => {
  const [openEvents, setOpenEvents] = useState(false)
  const handleOpen = () => setOpenEvents(!openEvents)
  return (
    <div>
      <div>
        <button
          className="btn btn-ghost w-full"
          onClick={() => {
            setOpenEvents(!openEvents)
          }}
        >
          {openEvents ? 'Ocultar events' : 'Mostrar eventos'}{' '}
          <span className="ml-2">
            <Icon name={!openEvents ? `down` : 'up'} />
          </span>
        </button>
      </div>
      {openEvents && (
        <Modal
          title="Eventos realcionados"
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
