import Icon from '@comps/Icon'
import InputContainer, { SelectOption } from '@comps/inputs/InputContainer'
import AsyncModal from '@comps/modal/AsyncModal'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalState } from 'types/base/AnimalState.model'
export interface AnimalStatuses {}
const FormEarringsSelected = ({ earringsIds }: { earringsIds: string[] }) => {
  const methods = useForm()

  const animalStates: SelectOption[] = Object.entries(AnimalState).map(
    ([value, label]) => ({ value, label })
  )

  const onSubmit = (data: any) => {
    //* just evaluate the form content and set errors
    console.log('submit', data)
  }
  const handleSave = async (): Promise<boolean | number> => {
    return new Promise<boolean | number>((resolve, reject) => {
      setTimeout(() => {
        console.log('pro')
        resolve(true)
      }, 1000)
    })
  }
  const formHasSomeErrors = Object.keys(methods.formState.errors).length

  return (
    <div>
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
            </AsyncModal>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default FormEarringsSelected
