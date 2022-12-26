import { deleteAnimal, getAnimal } from '@firebase/Animal/main'
import { FemaleOptions, MaleOptions } from 'components/CONSTANTS/GENDER_OPTIONS'
import AnimalForm from 'components/forms/AnimalForm'

import Icon from 'components/Icon'
import ModalDelete from 'components/modal/ModalDelete'
import {
  AnimalType,
  GenderOptions
} from 'firebase/types.model.ts/AnimalType.model'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'

const AnimalCard = ({ animalId }: { animalId?: string }) => {
  const [animal, setAnimal] = useState<AnimalType | null>(null)
  const [editing, setEditing] = useState<boolean>(false)
  useEffect(() => {
    if (animalId) {
      getAnimal(animalId).then((res: any) => setAnimal(res))
    }

    return () => {
      setAnimal(null)
    }
  }, [animalId, editing])

  if (!animal) return <></>
  return (
    <div className=" p-2">
      {editing ? (
        <div>
          <AnimalForm animal={animal} setEditing={setEditing} />{' '}
        </div>
      ) : (
        <div>
          <Card animal={animal} setEditing={setEditing} />
        </div>
      )}
    </div>
  )
}

const Card = ({
  animal,
  setEditing
}: {
  animal: AnimalType
  setEditing: (boolean: boolean) => void
}) => {
  const {
    earring,
    id,
    lote,
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

  const handleDelete = () => {
    id &&
      deleteAnimal(id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }
  // console.log(animal)
  return (
    <div>
      <div className="flex w-full justify-end">
        {id && (
          <ModalDelete
            handleDelete={handleDelete}
            title={'Eliminar animal'}
            buttonLabel={null}
            openButtonProps={{
              className: ' btn btn-error btn-circle btn-sm text-'
            }}
          />
        )}
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
          {lote && (
            <div>
              <span>lote:</span>{' '}
              <span className="text-2xl font-bold">{lote}</span>
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
                <span>{genderLabel?.[gender]?.label}</span>
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
    </div>
  )
}

export default AnimalCard