import { FarmType } from '@firebase/Farm/farm.model'
import {
  createFarm,
  getFarm,
  getUserFarm,
  updateFarm
} from '@firebase/Farm/main'
import useAuth from 'components/hooks/useAuth'
import Icon from 'components/Icon'
import InputContainer from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const Farm = () => {
  const { user } = useAuth()
  const [farm, setFarm] = useState<FarmType | null>(null)
  useEffect(() => {
    /** ************** LISTEN ONE ********** */
    getUserFarm().then((res) => {
      setFarm(res)
    })
  }, [user])

  const [editing, setEditing] = useState(false)

  return (
    <div>
      {editing ? (
        <FarmForm farm={farm || undefined} setEditing={setEditing} />
      ) : (
        <FarmInfo farm={farm} setEditing={setEditing} />
      )}
    </div>
  )
}

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
    console.log(data)
    alert(JSON.stringify(data))
    data.id
      ? updateFarm(data.id, data).then((res) => {
          console.log(res)
          setEditing(false)
        })
      : createFarm(data).then((res) => {
          const newFormId = res?.res?.id
          console.log({ newFormId })
          setValue('id', newFormId)
          setEditing(false)
        })
  }
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={'flex w-full'}>
          <div className="flex justify-evenly w-full items-center border">
            <InputContainer type="text" name={'name'} label="Nombre" />

            <div className="form-control">
              <label className="label flex-col">
                <span className="label-text max-w-[150px] text-center">
                  Incuir equipo de personas
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

const FarmInfo = ({
  farm,
  setEditing
}: {
  farm: FarmType | null
  setEditing: (bool: boolean) => void
}) => {
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2 items-center">
      {farm ? (
        <>
          <div>{farm?.images?.[0]?.url}</div>
          <div>{farm?.name}</div>
          <div>
            {farm?.team?.map((member) => (
              <div key={member.id}>
                <div>{member.name}</div>
                <div>{member.email}</div>
                <div>{'member permissions'}</div>
              </div>
            ))}
          </div>
          <button
            className="btn btn-circle btn-sm btn-info"
            onClick={() => setEditing(true)}
          >
            <Icon name="edit" size="xs" />
          </button>
        </>
      ) : (
        <div className="flex w-full items-center">
          <div>No haz configurado una granja aún </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setEditing(true)}
          >
            Configurar
          </button>
        </div>
      )}
    </div>
  )
}

export default Farm
