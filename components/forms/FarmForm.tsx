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
  console.log({ farm })
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
    <div className="flex  w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex w-full'}>
          <div className="flex flex-col justify-evenly w-full items-center ">
            <InputContainer type="text" name={'name'} label="Nombre" />

            <div className="form-control">
              <label className="label flex">
                <span className="label-text max-w-[150px]  text-end w-full  mx-1">
                  Equipo activo
                </span>
                <input
                  {...register('haveATeam')}
                  checked={methods.watch('haveATeam')}
                  type="checkbox"
                  className="checkbox"
                />
              </label>
              <label className="label flex">
                <span className="label-text max-w-[150px] text-end w-full mx-1">
                  Visible
                </span>
                <input
                  {...register('isPublic')}
                  type="checkbox"
                  className="checkbox"
                />
              </label>
            </div>
            <div className="flex w-full justify-evenly">
              <button
                className="btn  btn-outline "
                onClick={(e) => {
                  e.preventDefault()
                  setEditing(false)
                }}
              >
                Cancelar{' '}
              </button>
              <ModalDelete
                title="Eliminar granja"
                text="Eliminar granja de forma permanente. Solo eliminaras los datos de la granja como nombre y equipo. No afecta a los animales, o eventos previamente creados bajo le nombre de esta granja "
                handleDelete={() => handleDeleteFarm(farm?.id)}
                buttonLabel={'Eliminar'}
              />
              <button className="btn  btn-outline btn-info">
                Guardar{' '}
                <span className="ml-2">
                  <Icon name="save" size="sm" />
                </span>
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default FarmForm
