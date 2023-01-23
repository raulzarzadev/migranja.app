import ModalDelete from '@comps/modal/ModalDelete'
import { FarmType } from '@firebase/Farm/farm.model'
import { createFarm, deleteFarm, updateFarm } from '@firebase/Farm/main'
import useDebugInformation from 'components/hooks/useDebugInformation'
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
  // useDebugInformation('FarmForm', { farm, setEditing })
  const methods = useForm({ defaultValues: farm })
  const { handleSubmit, register, setValue } = methods
  const onSubmit = (data: any) => {
    data.id
      ? updateFarm(data.id, data).then((res) => {
          setEditing(false)
        })
      : createFarm(data).then((res) => {
          const newFormId = res?.res?.id
          setValue('id', newFormId)
          setEditing(false)
        })
  }
  const handleDeleteFarm = (farmId: string | undefined) => {
    if (farmId)
      return deleteFarm(farmId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex w-full'}>
          <div className="flex justify-evenly w-full items-center ">
            <ModalDelete
              title="Eliminar granja"
              text="Eliminar granja de forma permanente. Solo eliminaras los datos de la granja como nombre y equipo. No afecta a los animales, o eventos previamente creados bajo le nombre de esta granja "
              handleDelete={() => handleDeleteFarm(farm?.id)}
              buttonLabel={'Eliminar'}
            />
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
              <Icon name="save" size="sm" />
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default FarmForm
