import {
  createAnimal,
  updateAnimal,
  updateAnimalState
} from '@firebase/Animal/main'
import {
  createGenericBreedingEvent,
  updateEventBreedingBatch
} from '@firebase/Events/main'
import InputContainer, {
  ColorizeRangeDates
} from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { formatNewGenericFarmEvent } from './birth.helper'
import { BirthDetailsEvent } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import ProgressButton from '@comps/ProgressButton'
import { creteAnimalWeaning } from '@firebase/Events/weaning.event'
import { addDays, subDays } from 'date-fns'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import {
  AnimalBreedingEventCard,
  OtherBreedingMale
} from 'types/base/FarmEvent.model'
import Modal from '@comps/modal'
import { AnimalDetails } from '@comps/AnimalCard'
import { AnimalType } from 'types/base/AnimalType.model'
import { MalesTable } from '@comps/MalesTable'
import { calculatePossibleBirth } from '../breeding.helpers'
import HelperText from '@comps/HelperText'
import useCreateBirth from '@comps/hooks/useCreateBirth'
import useEvent from '@comps/hooks/useEvent'

const BirthForm = ({
  animal,
  possibleBirth,
  breedingId
}: {
  animal: AnimalBreedingEventCard
  possibleBirth?: number | Date
  breedingId?: string
}) => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEarrings = useSelector(selectFarmAnimals)?.map(
    ({ earring }) => earring
  )
  const { event } = useEvent({ eventId: breedingId })

  const sortByCreatedDate = (a: any, b: any) => b?.createdAt - a?.createdAt

  // Show the last male earring to have a reference for the next earrings
  const lastMaleCalfEarring = farmAnimals
    .filter(({ gender }) => gender === 'male')
    .sort(sortByCreatedDate)
    .shift()
  // Show the last female earring to have a reference for the next earrings
  const lastFemaleCalfEarring = farmAnimals
    .filter(({ gender }) => gender === 'female')
    .sort(sortByCreatedDate)
    .shift()
  const defaultCalf = {
    isAlive: true,
    gender: '',
    earring: '',
    weight: {
      atBirth: 0
    }
  }

  const methods = useForm({
    defaultValues: {
      calfs: [defaultCalf],
      birthType: 0,
      date: possibleBirth || new Date(),
      male: '' //* should be a earring
    }
  })
  const {
    watch,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors }
  } = methods

  const formValues = watch()

  useEffect(() => {
    let calfs = []
    for (let i = 0; i < parseInt(`${formValues?.birthType}`); i++) {
      calfs.push(defaultCalf)
    }
    setValue('calfs', calfs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, formValues?.birthType])

  const [labelStatus, setLabelStatus] = useState('')
  const breedingEventId = animal.eventData?.id
  const breedingBatchId = animal.eventData?.breedingId
  const breedingMale = animal.eventData?.breedingMale

  const breedingMaleSelected = farmAnimals.find(
    ({ earring }) => earring === formValues.male
  )
  const { handleCreateBirth, status, progress } = useCreateBirth({
    breedingId,
    fatherId: breedingMaleSelected?.id,
    motherId: animal.id
  })

  const onSubmit = async (data) => {
    await handleCreateBirth({
      breeding: { id: breedingId || '', name: event?.eventData?.batch },
      calfs: data.calfs,
      date: data.date,
      batch: event?.eventData?.batch
    })
  }
  const [finishView, setFinishView] = useState(false)

  const [openAlreadyExist, setOpenAlreadyExist] = useState(false)
  const handleOpenAlreadyExist = () => {
    setOpenAlreadyExist(!openAlreadyExist)
  }
  const [alreadyExist, setAlreadyExist] = useState<
    AnimalType | null | undefined
  >(null)
  const handleSeeAlreadyExist = (earring: string) => {
    setAlreadyExist(farmAnimals.find((animal) => animal.earring === earring))
    handleOpenAlreadyExist()
  }

  const breeding = animal.eventData
  const sortByStartAt = (a: any, b: any) => a.startAt - b.finishAt
  const breedingMales: OtherBreedingMale[] = [
    {
      earring: breedingMale?.earring || '',
      finishAt: breeding?.finishAt || '',
      startAt: breeding?.startAt || '',
      breed: breedingMale?.breed || '',
      id: breedingMale?.id || '',
      name: breedingMale?.name || ''
    },
    ...(breeding.otherMales || []).sort(sortByStartAt)
  ]

  const breedingMalesWithPossibleDates = breedingMales.map((male) => {
    return {
      ...male,
      possibleDates: calculatePossibleBirth({
        breedingFinishAt: male.finishAt as number,
        breedingStartAt: male.startAt as number
      })
    }
  })

  const possibleMaleDependsOfDate = (date: number | string | Date): string => {
    const _date = new Date(date).getTime()
    return (
      breedingMales.find((animal) => {
        //* get possible birth dates for each male
        const possibleBirthDates = calculatePossibleBirth({
          breedingFinishAt: animal.finishAt as number,
          breedingStartAt: animal.startAt as number
        })
        //* determinate if date is in middle of possibleBirthDates
        if (
          _date >
            subDays(
              possibleBirthDates.startAt,
              OVINE_DAYS.gestationTolerance
            ).getTime() &&
          _date <
            addDays(
              possibleBirthDates.finishAt,
              OVINE_DAYS.gestationTolerance
            ).getTime()
        ) {
          return animal.earring
        }
      })?.earring || ''
    )
  }
  useEffect(() => {
    setValue('male', possibleMaleDependsOfDate(formValues?.date))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.date, setValue])
  interface MaleStyle {
    table: string
    calendar: string
  }
  const MALE_COLORS_STYLE: Record<number, MaleStyle> = {
    0: {
      table: 'border-green-300',
      calendar: ' bg-green-300 '
    },
    1: {
      table: ' border-red-300 ',
      calendar: ' bg-red-300 '
    },
    2: {
      table: ' border-blue-300 ',
      calendar: ' bg-blue-300 '
    },
    3: {
      table: 'border-yellow-300',
      calendar: 'bg-yellow-300'
    },
    4: {
      table: 'border-gray-300',
      calendar: 'bg-gray-300'
    }
  }
  const datesRangeColor: ColorizeRangeDates[] =
    breedingMalesWithPossibleDates.map((male, i) => {
      return {
        color: MALE_COLORS_STYLE[i]?.calendar || '',
        start: male.possibleDates.startAt,
        end: male.possibleDates.finishAt
      }
    })
  const dateTouched = methods.formState.dirtyFields.date
  const birthTypeTouched = formValues.birthType
  const buttonSaveDisabled = !formValues.calfs.length
  return (
    <div>
      <Modal
        open={openAlreadyExist}
        handleOpen={handleOpenAlreadyExist}
        title="Este arete ya existe"
      >
        {alreadyExist && <AnimalDetails animal={alreadyExist} />}
      </Modal>

      <div>
        <MalesTable
          showColor
          males={[
            ...breedingMales.map((male, i) => {
              return {
                ...male,
                className: MALE_COLORS_STYLE[i]?.calendar
              }
            })
          ]}
        />
      </div>

      <FormProvider {...methods}>
        <h4 className="text-center text-xl ">Crear parto </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex justify-center ">
            <InputContainer
              type="date"
              name="date"
              label="Fecha"
              className=""
              datesRangeColor={datesRangeColor}
            />
          </div>
          <HelperText
            text="Verifica si las crías nacidas se parecen al macho seleccionado para garantizar que son desendecia"
            type="info"
          />

          {dateTouched && (
            <div className=" ">
              <div className="grid ">
                <InputContainer
                  className="w-[150px] mx-auto my-4"
                  label="Macho"
                  name="male"
                  type="select"
                  selectOptions={[
                    ...breedingMales.map((male, i) => {
                      return {
                        label: `${i + 1}.- ${male?.earring} ${
                          male?.name || ''
                        }`,
                        value: male.earring
                      }
                    })
                  ]}
                />
                <div>
                  <div className="flex w-full justify-center gap-4 items-center">
                    Camada:{' '}
                    <span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setValue('birthType', 1)
                        }}
                        className={`btn btn-sm btn-square btn-outline ${
                          formValues.birthType === 1 && 'btn-active'
                        }`}
                      >
                        1
                      </button>
                    </span>
                    <span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setValue('birthType', 2)
                        }}
                        className={`btn btn-sm btn-square btn-outline ${
                          formValues.birthType === 2 && 'btn-active'
                        }`}
                      >
                        2
                      </button>
                    </span>
                    <span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setValue('birthType', 3)
                        }}
                        className={`btn btn-sm btn-square btn-outline ${
                          formValues.birthType === 3 && 'btn-active'
                        }`}
                      >
                        3
                      </button>
                    </span>
                  </div>
                </div>

                {!!birthTypeTouched && (
                  <div className="">
                    <div className="flex justify-end mt-6 text-sm italic">
                      <span className="mr-1">
                        ultimo macho:
                        <strong>{lastMaleCalfEarring?.earring}</strong>{' '}
                      </span>
                      <span>
                        ultima hembra:{' '}
                        <strong>{lastFemaleCalfEarring?.earring}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-4 place-items-center mb-3  font-bold  ">
                      <span>Vivo</span>
                      <span className="w-[120px] text-center">Sexo</span>
                      <span className="w-[100px] text-center">Arete</span>
                      {/* <span className="w-[120px] text-center">Nombre</span> */}
                      <span className="w-[120px] text-center">Peso</span>
                    </div>
                    {formValues?.calfs?.map((_newAnimal: any, i: number) => (
                      <div
                        key={i}
                        className="grid  grid-cols-4 place-items-center "
                      >
                        <InputContainer
                          name={`calfs.${i}.isAlive`}
                          type="checkbox"
                          inputClassName="checkbox-success"
                          defaultChecked
                        />
                        <div>
                          <div className="flex justify-center">
                            <label className="flex flex-col">
                              <span>Macho</span>
                              <input
                                {...register(`calfs.${i}.gender`, {
                                  required: 'Selecciona el sexo'
                                })}
                                type={'radio'}
                                value="male"
                              />
                            </label>
                            <label className="flex flex-col">
                              <span>Hembra</span>
                              <input
                                {...register(`calfs.${i}.gender`, {
                                  required: 'Selecciona el sexo'
                                })}
                                type={'radio'}
                                value="female"
                              />
                            </label>
                          </div>
                          {errors.calfs?.[i]?.gender?.type === 'required' && (
                            <span className="text-error label-text ">
                              Selecciona el sexo
                            </span>
                          )}
                        </div>
                        <InputContainer
                          rules={{
                            // required: 'Este campo es necesario',
                            validate: {
                              alreadyExist: (value) =>
                                ![...farmEarrings].includes(value) ||
                                'Ya existe!',
                              isRequired: (value) => !!value || 'Es necesario',
                              min: (value) =>
                                String(value).length >= 3 ||
                                'Al menos 3 numeros'
                            }
                          }}
                          onClickAlreadyExist={handleSeeAlreadyExist}
                          name={`calfs.${i}.earring`}
                          type="text"
                          placeholder="Arete"
                          className="w-[100px] my-1"
                        />

                        {/* <InputContainer
                name={`calfs.${i}.name`}
                type="text"
                placeholder="Nombre"
                className="w-[120px] my-1"
              /> */}
                        <InputContainer
                          name={`calfs.${i}.weight.atBirth`}
                          type="number"
                          placeholder="Peso"
                          className="w-[120px] my-1"
                          min="0"
                          max="10"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-10">
            <ProgressButton
              disabled={buttonSaveDisabled}
              label={status}
              progress={progress}
            />
          </div>
          {/* {progress > 0 && (
            <progress className="progress w-full" value={progress} max={100} />
          )}
          <div className="flex justify-center w-full mt-6">
            <button disabled={progress > 0} className="btn btn-info">
              Guardar
            </button>
          </div> */}
          {/* {finishView && (
            <div className="flex justify-center w-full mt-6">
              <Link href={`/${currentFarm?.id}`}>Ver parto</Link>
            </div>
          )} */}
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
