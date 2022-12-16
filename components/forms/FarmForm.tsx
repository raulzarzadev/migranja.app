import { FarmType } from '@firebase/Farm/farm.model'
import { createFarm, updateFarm } from '@firebase/Farm/main'
import Icon from 'components/Icon'
import InputContainer from 'components/inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'

const FarmForm = ({
  farm,
  setEditing
}: {
  farm?: FarmType
  setEditing: (bool: boolean) => void
}) => {
  const methods = useForm({ defaultValues: farm })
  const { handleSubmit, register, setValue } = methods
  const onSubmit = (data: any) => {
    data.id
      ? updateFarm(data.id, data).then((res) => {
          console.log(res)
          setEditing(false)
        })
      : createFarm(data).then((res) => {
          const newFormId = res?.res?.id
          setValue('id', newFormId)
          setEditing(false)
        })
  }
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex w-full'}>
          <div className="flex justify-evenly w-full items-center ">
            <InputContainer type="text" name={'name'} label="Nombre" />

            <div className="form-control">
              <label className="label flex-col">
                <span className="label-text max-w-[150px] text-center">
                  Equipo activo
                </span>
                <input
                  {...register('haveATeam')}
                  type="checkbox"
                  className="checkbox"
                />
              </label>
            </div>
            <button className="btn btn-circle btn-sm btn-success">
              <Icon name="done" />
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default FarmForm
