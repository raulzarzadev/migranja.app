import Icon from '@comps/Icon'
import InputContainer, { SelectOption } from '@comps/inputs/InputContainer'
import AsyncModal from '@comps/modal/AsyncModal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { updateAnimal } from '@firebase/Animal/main'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalState } from 'types/base/AnimalState.model'
export interface EarringsSelected {
  id: string
  earring: string
  name?: string
}
const FormEarringsSelected = ({
  earringsSelected
}: {
  earringsSelected: EarringsSelected[]
}) => {
  const methods = useForm()

  const animalStates: SelectOption[] = Object.entries(AnimalState).map(
    ([value, label]) => ({ value, label })
  )

  const onSubmit = (data: any) => {
    //* just evaluate the form content and set errors
    console.log('submit', data)
  }
  console.log(methods.formState.touchedFields)
  const handleSave = async (): Promise<boolean | number> => {
    console.log('start')
    const formData = methods.getValues()
    console.log({ formData })
    return
    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < earringsSelected.length; i++) {
          const { id, earring, name } = earringsSelected[i]
          await updateAnimal(id, { state: formData?.state }).then((res) =>
            console.log({ res })
          )
        }
        resolve(true)
      } catch (error) {
        console.log({ error })
        reject(error)
      }
    })
  }
  const formHasSomeErrors = Object.keys(methods.formState.errors).length

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
              />
            }
            showText="Editar estado actual"
            handleDiscard={() => {
              methods.unregister('state')
            }}
          />
          {/* <InputContainer
            name="birthday"
            type="date"
            selectOptions={animalStates}
            label="Fecha de nacimiento"
          /> */}
          {/* <InputContainer
            name="state"
            type="select"
            selectOptions={animalStates}
            label="Estado actual"
          /> */}
          {/* <InputContainer name="batch" type="text" label="Lote" /> */}
          <div className="flex w-full justify-evenly mt-4">
            <AsyncModal
              openButtonClassName="btn btn-info"
              openIcon="save"
              btnLabel="Guardar cambios"
              handleAccept={handleSave}
              modalTitle={'Guardar cambios'}
              canOpen={!formHasSomeErrors}
            >
              Estos cambios se aplicaran a todos los animales seleccionados:
              <div>Lista de animales:</div>
              <div
                className="flex w-full justify-around flex-wrap my-4
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
    <div className="flex items-end w-full mx-auto justify-center gap-2">
      {showInput ? (
        <>
          {input}
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
