import { createAnimal } from '@firebase/Animal/main'
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
import { addDays, intervalToDuration, subDays } from 'date-fns'
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

const BirthForm = ({
  animal,
  possibleBirth
}: {
  animal: AnimalBreedingEventCard
  possibleBirth?: number | Date
}) => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEarrings = useSelector(selectFarmAnimals)?.map(
    ({ earring }) => earring
  )

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
    gender: 'male',
    earring: '',
    weight: {
      atBirth: 0
    }
  }

  const methods = useForm({
    defaultValues: {
      calfs: [defaultCalf],
      birthType: 1,
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

  const [progress, setProgress] = useState(0)
  const [labelStatus, setLabelStatus] = useState('')
  const breedingEventId = animal.eventData?.id
  const breedingBatchId = animal.eventData?.breedingId
  const breedingMale = animal.eventData?.breedingMale
  console.log({ breedingMale })
  const onSubmit = async (data: any) => {
    setProgress(1)
    const breedingMaleSelected = farmAnimals.find(
      ({ earring }) => earring === formValues.male
    )
    const { formatBirthEvent } = formatNewGenericFarmEvent<BirthDetailsEvent>({
      eventType: 'BIRTH',
      animal,
      calfs: data.calfs,
      currentFarm,
      farmAnimals,
      formValues,
      breeding: {
        breedingId: breedingBatchId,
        breedingMale: {
          inTheFarm: breedingMale?.inTheFarm || false,
          ...breedingMaleSelected
        }
      }
    })

    if (!breedingEventId) return console.log('no eventId')
    try {
      const newCalfs = formatBirthEvent.eventData.calfs || []
      // ****************************************************   create birth
      setLabelStatus('Creando evento')
      setProgress(10)
      //  console.log({ formatBirthEvent })

      const event = await createGenericBreedingEvent(formatBirthEvent)
      // console.log({ event })

      // *************************************************   create animals/calfs
      setLabelStatus('Creando animales')
      setProgress(30)

      const newAnimalsPromises = newCalfs.map((calf) => {
        return createAnimal({ ...calf, status: 'ACTIVE' })
      })

      const newAnimals = await Promise.all(newAnimalsPromises)
      // console.log({ newAnimals })

      setLabelStatus('Creando detetes')
      setProgress(60)
      // *************************************************   create animals weaning
      const newWeaningsPromises = newCalfs.map((calf) => {
        return creteAnimalWeaning({
          type: 'WEANING',
          eventData: {
            status: 'PENDING',
            earring: calf.earring || '',
            date: addDays(data.date, OVINE_DAYS.finishWeaning).getTime()
          },
          farm: {
            id: currentFarm?.id || '',
            name: currentFarm?.name || ''
          }
        })
      })
      const newWeanings = await Promise.all(newWeaningsPromises)
      //console.log({ newWeanings })

      // ***************************************************   update breeding, move from batch to already done

      setLabelStatus('Actualizando monta')
      setProgress(80)

      const birthEventData = {
        birthEventId: event?.res?.id,
        newCalfsIds: newAnimals.map((animal) => animal?.res?.id),
        calfsWeaningsIds: newWeanings.map((weaning) => weaning?.res.id)
      }

      // console.log({ birthEventData })
      const breeding = await updateEventBreedingBatch({
        eventId: breedingEventId || '',
        animalId: animal?.id as string,
        eventType: 'BIRTH',
        birthEventData
      })

      setProgress(100)
      setFinishView(true)
      reset()
    } catch (error) {
      setProgress(0)
      console.log(error)
    }
  }
  const [finishView, setFinishView] = useState(false)
  // console.log({ formValues })

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
  //console.log({ breeding })
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
  console.log(formValues.male)
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
          <div className="w-full flex justify-center">
            <InputContainer
              type="date"
              name="date"
              label="Fecha"
              className="w-[150px]"
              datesRangeColor={datesRangeColor}
            />
          </div>
          <HelperText
            text="Verifica si las crias nacidas se parecen al macho seleccionado para garantizar que son desendecia"
            type="info"
            show
          />
          <InputContainer
            className="w-[150px] mx-auto my-4"
            label="Macho"
            name="male"
            type="select"
            selectOptions={[
              ...breedingMales.map((male, i) => {
                return {
                  label: `${male?.earring} ${male?.name || ''}-${i}`,
                  value: male.earring
                }
              })
            ]}
          />

          {!!formValues?.date && (
            <>
              <div className="flex justify-evenly my-2">
                <InputContainer
                  className="w-[150px]"
                  label="Tipo de parto"
                  name="birthType"
                  type="select"
                  selectOptions={[
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 }
                  ]}
                />
              </div>
            </>
          )}

          {formValues?.birthType && (
            <div>
              <div className="flex justify-end mt-6 text-sm italic">
                <span className="mr-1">
                  ultimo macho:<strong>{lastMaleCalfEarring?.earring}</strong>{' '}
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
            </div>
          )}

          {formValues?.calfs?.map((_newAnimal: any, i: number) => (
            <div key={i} className="grid grid-cols-4 place-items-center">
              <InputContainer
                name={`calfs.${i}.isAlive`}
                type="checkbox"
                inputClassName="checkbox-success"
                defaultChecked
              />
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
                      required: true
                    })}
                    type={'radio'}
                    value="female"
                  />
                </label>
              </div>
              <InputContainer
                rules={{
                  // required: 'Este campo es necesario',
                  validate: {
                    alreadyExist: (value) =>
                      ![...farmEarrings].includes(value) || 'Ya existe!',
                    isRequired: (value) => !!value || 'Es necesario',
                    min: (value) =>
                      String(value).length >= 3 || 'Al menos 3 numeros'
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
              <div>
                <div>
                  {errors?.calfs?.[i]?.gender && (
                    <span className="label-text text-error">
                      {errors?.calfs[i]?.gender?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <ProgressButton label={labelStatus} progress={progress} />
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
