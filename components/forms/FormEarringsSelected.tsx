import Icon from '@comps/Icon'
import InputContainer, { SelectOption } from '@comps/inputs/InputContainer'
import AsyncModal from '@comps/modal/AsyncModal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { updateAnimal } from '@firebase/Animal/main'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalState, AnimalStateType } from 'types/base/AnimalState.model'
import { myFormatDate } from 'utils/dates/myDateUtils'
export interface EarringsSelected {
  id: string
  earring: string
  name?: string
}
const FormEarringsSelected = ({
  earringsSelected,
  setAnimalsEarrings
}: {
  earringsSelected: EarringsSelected[]
  setAnimalsEarrings?: (animals: any[]) => void
}) => {
  const methods = useForm()

  const animalStates: SelectOption[] = Object.entries(AnimalState).map(
    ([value, label]) => ({ value, label })
  )

  const onSubmit = (data: any) => {
    //* just evaluate the form content and set errors
  }
  const [updates, setUpdates] = useState({})
  const formValues = methods.getValues()

  type Fields = 'state' | 'birthday'

  const FIELDS_LABELS: Record<Fields, string> = {
    state: 'Nuevo estado',
    birthday: 'Fecha de nacimiento'
  }
  useEffect(() => {
    const _updates: Record<string, any> = {}
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined) {
        _updates[key] = value
      }
    })
    setUpdates(_updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.birthday, formValues.state])
  const handleSave = async (): Promise<boolean | number> => {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < earringsSelected.length; i++) {
          const { id } = earringsSelected[i]
          await updateAnimal(id, { ...updates }).then((res) =>
            console.log({ res })
          )
        }
        resolve(true)
        setAnimalsEarrings?.([])
      } catch (error) {
        console.error({ error })
        reject(error)
      }
    })
  }
  const formHasSomeErrors = Object.keys(methods.formState.errors).length
  const isDate = (value: any): boolean => {
    if (!value) return false
    const d = new Date(value)
    if (d.getTime()) return true
    return false
  }
  return (
    <div>
      <div>Los cambios se realizaran a los siguientes animales</div>
      <div
        className="flex w-full justify-around flex-wrap my-4
      "
      >
        {earringsSelected.map((animal) => (
          <div key={animal.id}>
            <ModalAnimalDetails earring={animal.earring} size="normal" />
          </div>
        ))}
      </div>
      <FormProvider {...methods}>
        <form className="grid gap-2" onSubmit={methods.handleSubmit(onSubmit)}>
          <ShowHiddenInput
            input={
              <InputContainer
                name="birthday"
                type="date"
                rules={{ required: 'Este campo es necesario' }}
                selectOptions={animalStates}
                label="Fecha de nacimiento"
              />
            }
            showText="Editar fecha de nacimiento"
            handleDiscard={() => {
              methods.unregister('birthday')
            }}
          />
          <ShowHiddenInput
            input={
              <InputContainer
                name="state"
                type="select"
                selectOptions={animalStates}
                label="Estado actual"
                size="small"
                fullWidth
              />
            }
            showText="Editar estado actual"
            handleDiscard={() => {
              methods.unregister('state')
            }}
          />
          <div className="flex w-full justify-evenly mt-4">
            <AsyncModal
              openButtonClassName="btn btn-info"
              openIcon="save"
              btnLabel="Guardar cambios"
              handleAccept={handleSave}
              modalTitle={'Guardar cambios'}
              canOpen={!formHasSomeErrors}
            >
              <p className="text-center my-4">
                Estos cambios se aplicaran a todos los animales seleccionados:
              </p>
              <div className="grid place-content-center">
                {Object.entries(updates).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <span>
                      {FIELDS_LABELS[key as Fields]}:
                      {isDate(value) ? (
                        myFormatDate(value as any, 'dd MMM yy')
                      ) : (
                        <span className="font-bold">{` ${
                          AnimalState[value as AnimalStateType]
                        } `}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center font-bold my-4">
                Animales seleccionados:
              </p>
              <div
                className="flex w-full justify-evenly flex-wrap mb-4
      "
              >
                {earringsSelected.map((animal) => (
                  <div key={animal.id}>
                    <ModalAnimalDetails
                      earring={animal.earring}
                      size="normal"
                    />
                  </div>
                ))}
              </div>
            </AsyncModal>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

const ShowHiddenInput = ({
  input,
  showText = '',
  handleDiscard
}: {
  input: React.ReactNode
  showText: string
  handleDiscard: () => void
}) => {
  const [showInput, setShowInput] = useState(false)
  return (
    <div className="flex items-center w-full mx-auto justify-center gap-2 flex-col  ">
      {showInput ? (
        <>
          <div className="w-64">{input}</div>
          <span>
            <button
              className="btn btn-outline btn-sm"
              onClick={(e) => {
                e.preventDefault()
                handleDiscard()
                setShowInput(false)
              }}
            >
              Descartar
              <span>
                <Icon name="delete" />
              </span>
            </button>
          </span>
        </>
      ) : (
        <>
          {/* <span>{showText}</span> */}
          <button
            className="btn btn-outline btn-sm"
            onClick={(e) => {
              e.preventDefault()
              setShowInput(true)
            }}
          >
            {showText} <Icon name="edit" />
          </button>
        </>
      )}
    </div>
  )
}

export default FormEarringsSelected
