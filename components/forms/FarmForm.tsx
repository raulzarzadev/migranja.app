import InfoBadge from '@comps/Badges/InfoBadge'
import ModalDelete from '@comps/modal/ModalDelete'
import { FarmType } from '@firebase/Farm/farm.model'
import { createFarm, deleteFarm, updateFarm } from '@firebase/Farm/main'
import Icon from 'components/Icon'
import InputContainer from 'components/inputs/InputContainer'
import {
  FormProvider,
  RegisterOptions,
  UseFormRegister,
  useForm
} from 'react-hook-form'

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
            <div className="flex w-full justify-end">
              <button
                className="btn  btn-xs btn-ghost"
                onClick={(e) => {
                  e.preventDefault()
                  setEditing(false)
                }}
              >
                <Icon name="close" />
              </button>
            </div>
            <InputContainer type="text" name={'name'} label="Nombre" />
            <div></div>
            <h4 className="w-full max-w-sm mx-auto font-bold">Configuración</h4>
            {/* CONFIG ZONE In this zone you should put all the options to config the farm menu */}
            <div className="form-control input-group w-[250px]">
              <InputContainer
                type="checkbox"
                name={'haveATeam'}
                label="Equipo actívo"
                checked={methods.watch('haveATeam')}
                infoBadge={{
                  title: 'Equipo actívo',
                  text: 'POdras agregar personas a tu equipo de trabajo, asignarles tareas, responsabilidades y mucho más. (Próximamente)'
                }}
                className="flex justify-between"
              />
              <InputContainer
                type="checkbox"
                name={'isPublic'}
                label="Granja pública "
                checked={methods.watch('isPublic')}
                infoBadge={{
                  title: 'Granja pública',
                  text: 'Esta granja sera visible para otros usuarios, podra ser encontrada por otros ususarios y podras publicar en la tienda (Próximamente)'
                }}
                className="flex justify-between "
              />
            </div>
            <div className="flex w-full justify-evenly">
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

const CheckboxInput = ({
  label,
  name,
  register,
  checked,
  infoBadge
}: {
  name: string
  label: string
  register: UseFormRegister<FarmType>
  checked: boolean
  infoBadge?: {
    title: string
    text: string
  }
}) => (
  <label className="label flex">
    <span className="label-text max-w-[200px]  text-end w-full  mx-1">
      {label}
      {infoBadge && (
        <InfoBadge title={infoBadge?.title} text={infoBadge?.text} />
      )}
    </span>
    <input
      {...register}
      checked={checked}
      //checked={methods.watch('haveATeam')}
      type="checkbox"
      className="checkbox checkbox-xs "
    />
  </label>
)

export default FarmForm
