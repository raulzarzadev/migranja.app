import HelperText from '@comps/HelperText'
import ProgressButton from '@comps/ProgressButton'
import useFarmWeather from '@comps/hooks/useFarmWeather'
import useProgress from '@comps/hooks/useProgress'
import Modal from '@comps/modal'
import ModalDelete from '@comps/modal/ModalDelete'
import ModalLocationPicker from '@comps/modal/ModalLocationPicker'
import { FarmType } from '@firebase/Farm/farm.model'
import { createFarm, deleteFarm, updateFarm } from '@firebase/Farm/main'
import InputContainer from 'components/inputs/InputContainer'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const FarmForm = ({
  farm,
  setEditing,
  onCancel
}: {
  farm?: FarmType
  setEditing?: (bool: boolean) => void
  onCancel?: () => void
}) => {
  // console.log({ farm })
  // useDebugInformation('FarmForm', { farm, setEditing })
  const [error, setError] = useState(false)
  const router = useRouter()
  const defaultValues = farm || {
    haveATeam: false,
    isPublic: false,
    name: 'Nueva granja'
  }
  const methods = useForm({ defaultValues })
  const { handleSubmit, setValue } = methods
  const { progress, setProgress } = useProgress()
  const onSubmit = async (data: any) => {
    setProgress(20)
    try {
      const res = data.id
        ? await updateFarm(data.id, data).then((res) => {
            setEditing?.(false)
            return res
          })
        : await createFarm(data).then((res) => {
            const newFormId = res?.res?.id
            setValue('id', newFormId)
            setEditing?.(false)
            return res
          })
      setProgress(100)
    } catch (error) {
      setProgress(-1)
      console.error(error)
    }
  }

  const handleDeleteFarm = (farmId: string | undefined) => {
    if (farmId)
      return deleteFarm(farmId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }
  const [openDelete, setOpenDelete] = useState(false)
  const handleOpenDelete = () => {
    setOpenDelete(!openDelete)
  }
  const farmWeather = useFarmWeather({
    farmCoordinates: methods.watch('coordinates')
  })

  return (
    <div className="flex w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex w-full'}>
          <div className="flex flex-col justify-evenly w-full items-center ">
            <InputContainer type="text" name={'name'} label="Nombre" />
            <h4 className="w-full max-w-sm mx-auto font-bold text-center">
              Configuración
            </h4>
            {/* CONFIG ZONE In this zone you should put all the options to config the farm menu */}
            <div className="text-center">
              <span>
                La ubicación es aproximada y solo es usada para determinar el
                clima de tu granja
              </span>
              <div className="text-center font-bold">
                {farmWeather?.city?.name || 'Sin ubicación'}
              </div>
              <ModalLocationPicker
                location={methods.watch('coordinates') || { lat: 19, lng: -99 }}
                setLocation={(coor) => {
                  methods.setValue('coordinates.lat', coor.lat)
                  methods.setValue('coordinates.lng', coor.lng)
                }}
              />
            </div>
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
              <button
                className="btn btn-error btn-outline
              "
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenDelete()
                }}
              >
                Eliminar Granja
              </button>
              <button
                className="btn btn-outline
              "
                onClick={(e) => {
                  e.preventDefault()
                  onCancel?.()
                }}
              >
                Cancelar
              </button>
              <Modal
                open={openDelete}
                handleOpen={handleOpenDelete}
                title={`Eliminar granja`}
              >
                <p className="text-center my-2">{`Eliminar esta granja de forma permanente. `}</p>
                <p className="text-center font-bold"> {farm?.name}</p>
                <div className="flex w-full justify-center mt-2">
                  <ModalDelete
                    title="Eliminar granja"
                    text={`Esta acción no es reversible, eliminaras esta granja`}
                    handleDelete={() => {
                      handleDeleteFarm(farm?.id)?.then((res) => {
                        setOpenDelete(false)
                        router.replace('/home')
                      })
                    }}
                    buttonLabel={'Eliminar'}
                  />
                </div>
              </Modal>
              <ProgressButton
                errorLabel={
                  progress === -1
                    ? ' Hubo un error, recarga la página e intentalo de nuevo'
                    : ''
                }
                progress={progress}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default FarmForm
