import { getFarmBreedings } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import DebouncedInput from 'components/inputs/DebouncedInput'
import InputContainer from 'components/inputs/InputContainer'
import Modal from 'components/modal'
import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import { formatBreedingsAsBreedingsList } from './breeding.helpers'

interface SearchField {
  value: string
  matches: AnimalType[]
}

const BreedingsList = () => {
  const { currentFarm } = useFarm()
  const [animals, setAnimals] = useState<Partial<AnimalType>[]>([])
  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })

  useEffect(() => {
    currentFarm.id &&
      !animals.length &&
      getFarmBreedings(currentFarm.id).then((res) =>
        setAnimals(formatBreedingsAsBreedingsList(res))
      )
  }, [animals.length, currentFarm.id])

  const filterField = (field: string = '', search: string = '') => {
    return field.toLowerCase().includes(search.toLowerCase())
  }

  const animalsFiltered = [...animals].filter(
    (animal) =>
      // filter  earrings
      filterField(animal?.earring, search.value) ||
      // filter  by bull
      filterField(animal?.breeding?.breedingMale?.earring, search.value) ||
      // filter  by batch
      filterField(animal?.batch || '', search.value)
  )

  return (
    <div className="w-full">
      <div className="flex w-full items-center">
        <DebouncedInput
          value={search.value ?? ''}
          onChange={(value) => setSearch({ ...search, value: value as string })}
          className=" input input-sm w-full input-bordered"
          placeholder="Buscar..."
        />
        <div className="whitespace-nowrap ml-1">
          Encontrados {animalsFiltered.length}
        </div>
      </div>
      <AnimalsBreeding animals={animalsFiltered} />
    </div>
  )
}

const AnimalsBreeding = ({ animals }: { animals: any[] }) => {
  const { arraySorted, handleSortBy, reverse } = useSortByField(animals)
  const sortByButtons = [
    { field: 'possibleBirthStartIn', label: 'Parto' },
    { field: 'earring', label: 'Arete' }
  ]
  return (
    <>
      <div>
        <div>Ordenar por:</div>
        <div className="flex w-full justify-evenly">
          {sortByButtons.map(({ field, label }) => (
            <button
              key={label}
              onClick={() => handleSortBy(field)}
              className="btn btn-sm btn-ghost"
            >
              {label}
              <span className="ml-1">
                <Icon name={reverse ? 'down' : 'up'} size="xs" />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="  overflow-y-auto p-1 shadow-inner rounded-md event-list">
        {arraySorted.map((animal, i) => (
          <AnimalBreeding key={`${animal?.id}-${i}`} animal={animal} />
        ))}
      </div>
    </>
  )
}

const AnimalBreedingOptions = ({
  animal,
  openModal,
  handleOpenModal
}: {
  animal: AnimalType
  openModal: boolean
  handleOpenModal: () => void
}) => {
  const { currentFarmEarrings } = useFarm()
  const methods = useForm()
  const {
    watch,
    handleSubmit,
    setValue,
    register,
    formState: { errors }
  } = methods
  const formValues = watch()
  const defaultBirthValues = {
    birthday: formValues.date,
    parents: {
      father: {
        earring: animal.breeding?.breedingMale.earring || '',
        name: animal.breeding?.breedingMale.name || '',
        id: animal.breeding?.breedingMale.id || ''
      },
      mother: {
        earring: animal.earring || '',
        name: animal.name || '',
        id: animal.id || ''
      }
    }
  }
  useEffect(() => {
    let calfs = []
    for (let i = 0; i < parseInt(formValues?.birthType || 0); i++) {
      calfs.push(defaultBirthValues)
    }
    setValue('calfs', calfs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, formValues?.birthType, formValues.date])

  const onSubmit = (data) => {
    console.log(data)
  }

  console.log({ errors })

  return (
    <Modal
      handleOpen={handleOpenModal}
      open={openModal}
      title="Opciones de monta "
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer
            label="Opción"
            name="option"
            type="select"
            selectOptions={[
              {
                label: 'Parto',
                value: 'birth'
              },
              {
                label: 'Aborto',
                value: 'abort'
              },
              {
                label: 'No preña',
                value: 'notPregnant'
              }
            ]}
          />

          <div className="flex justify-evenly">
            <InputContainer type="date" name="date" label="Fecha" />
            {formValues.option === 'birth' && (
              <InputContainer
                label="Tipo de parto"
                name="birthType"
                type="select"
                selectOptions={[
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 }
                ]}
              />
            )}
          </div>
          {formValues.option === 'birth' &&
            formValues?.calfs?.map((newAnimal, i) => (
              <div
                key={i}
                className="flex w-full items-center justify-evenly flex-col sm:flex-row my-2 "
              >
                <div className="divider" />

                <InputContainer
                  rules={{
                    required: 'Este campo es necesario',
                    validate: (value) => {
                      return (
                        !currentFarmEarrings.includes(value) || 'Ya existe!'
                      )
                    }
                  }}
                  name={`calfs.${i}.earring`}
                  type="text"
                  placeholder="Arete"
                  className="w-[120px] my-1"
                />
                <InputContainer
                  name={`calfs.${i}.name`}
                  type="text"
                  placeholder="Nombre"
                  className="w-[120px] my-1"
                />
                <InputContainer
                  name={`calfs.${i}.weight`}
                  type="number"
                  placeholder="Peso"
                  className="w-[120px] my-1"
                />
                <div>
                  <div className="flex">
                    <label className="flex flex-col">
                      <span>Macho</span>
                      <input
                        {...register(`calfs.${i}.gender`)}
                        type={'radio'}
                        value="male"
                        checked
                      />
                    </label>
                    <label className="flex flex-col">
                      <span>Hembra</span>
                      <input
                        {...register(`calfs.${i}.gender`)}
                        name={`calfs.${i}.gender`}
                        type={'radio'}
                        value="female"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          <div className="flex justify-center w-full">
            <button className="btn btn-info">Guardar</button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

const AnimalBreeding = ({ animal }: { animal: Partial<AnimalType> }) => {
  const possibleBirthStartAt = animal?.breeding?.possibleBirth?.startAt
  const possibleBirthFinishAt = animal?.breeding?.possibleBirth?.finishAt
  const iconStyle: 'error' | 'warning' | 'success' =
    // @ts-ignore
    animal.possibleBirthStartIn < 0
      ? 'error'
      : // @ts-ignore
      animal.possibleBirthStartIn < 5
      ? 'warning'
      : 'success'
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  return (
    <>
      {openModal && (
        <AnimalBreedingOptions
          animal={animal}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
        />
      )}
      <div
        className="bg-base-300 my-2 rounded-md shadow-md  "
        onClick={() => handleOpenModal()}
      >
        <header className="flex w-full justify-between p-2 bg-base-200 rounded-t-md">
          <div className="flex items-center ">
            <span className="pr-1">
              {iconStyle === 'error' && (
                <span className="text-error ">
                  <Icon name="baned" size="xs" />
                </span>
              )}
              {iconStyle === 'success' && (
                <span className="text-success ">
                  <Icon name="done" size="xs" />
                </span>
              )}
              {iconStyle === 'warning' && (
                <span className="text-warning ">
                  <Icon name="info" size="xs" />
                </span>
              )}
            </span>
            <span className="flex flex-col">
              <span>
                Parto: del{' '}
                <span className="font-bold">
                  {possibleBirthStartAt &&
                    myFormatDate(possibleBirthStartAt, 'dd-MMM')}
                </span>{' '}
                al{' '}
                <span className="font-bold">
                  {possibleBirthFinishAt &&
                    myFormatDate(possibleBirthFinishAt, 'dd-MMM yyyy')}
                </span>
              </span>
              <span className="text-xs italic">
                {fromNow(possibleBirthStartAt, { addSuffix: true })}
              </span>
            </span>
          </div>

          <span className="flex flex-col">
            <span>
              Arete:{' '}
              <span className="font-bold whitespace-nowrap">
                {animal.earring}
              </span>
            </span>
            <span className="text-xs">
              Lote: <span className="font-bold">{animal.batch}</span>
            </span>
          </span>
        </header>
        <main className="p-2">
          <div className="flex w-full justify-evenly">
            <div className="flex flex-col text-center">
              <span>Fecha Monta</span>
              <div>
                <span>
                  {myFormatDate(animal?.breeding?.startAt, 'dd-MMM-yy')}
                </span>
                <span className="mx-2">al</span>
                <span>
                  {myFormatDate(animal?.breeding?.finishAt, 'dd-MMM-yy')}
                </span>
              </div>
            </div>
            <div className="flex flex-col text-center">
              <span>Macho</span>
              <div>
                <span className="mx-2 font-bold">
                  {animal.breeding?.breedingMale?.earring}
                </span>
                <span>{animal.breeding?.breedingMale?.name || ''}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default BreedingsList
