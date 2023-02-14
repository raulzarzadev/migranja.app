import Icon from '@comps/Icon'
import InputContainer, { SelectOption } from '@comps/inputs/InputContainer'
import AsyncModal from '@comps/modal/AsyncModal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { updateAnimal } from '@firebase/Animal/main'
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
  const handleSave = async (): Promise<boolean | number> => {
    console.log('start')
    const formData = methods.getValues()
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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputContainer
            name="state"
            type="select"
            selectOptions={animalStates}
            label="Estado actual"
          />
          {/* <InputContainer name="batch" type="text" label="Lote" /> */}
          <div className="flex w-full justify-center mt-4">
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

export default FormEarringsSelected
