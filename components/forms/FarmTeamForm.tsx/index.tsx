import { MemberTeam } from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import useFarm from 'components/hooks/useFarm'
import useNotifications from 'components/hooks/useNotifications'
import useSearchUsers from 'components/hooks/useSearchUsers'
import Icon from 'components/Icon'
import ModalDelete from 'components/modal/ModalDelete'
import { deleteField } from 'firebase/firestore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const FarmTeamForm = () => {
  const [showForm, setShowForm] = useState(false)

  const { farm } = useFarm()
  const { sendNotification } = useNotifications()

  const { register, handleSubmit, setValue, watch, reset } = useForm()

  const handleSendInvitation = async ({
    to: { id, name, email }
  }: {
    to: { id: string; name: string; email: string }
  }) => {
    return sendNotification({
      type: 'farm-invitation',
      to: {
        email: email,
        id: id,
        name: name
      },
      from: {
        email: farm?.email ?? '',
        id: farm?.id ?? '',
        name: farm?.name ?? ''
      },
      options: {
        message: `Invitación de ${farm?.name} a colaborar con ellos. `
      }
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const onSubmit = (data: any) => {
    console.log(data)

    farm?.id &&
      updateFarm(farm?.id, { [`team.${data.id}`]: data })
        .then((res) => {
          console.log(res)
          setShowForm(false)
          reset()
        })
        .catch((err) => console.log(err))
  }
  const handleSetMember = (user: MemberTeam | null) => {
    setShowForm(true)
    if (user) {
      setValue('name', user.name)
      setValue('id', user.id)
      setValue('email', user.email)
    }
  }

  const handleUpdateTeamMemberInvitation = (
    index: string,
    { invitation }: any
  ) => {
    farm?.id &&
      updateFarm(farm?.id, { [`team.${index}.invitation`]: invitation })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }

  const handleDeleteMemberTeam = (id: string) => {
    farm?.id &&
      updateFarm(farm?.id, { [`team.${id}`]: deleteField() })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }

  return (
    <div>
      <h3 className="text-center font-bold ">Miembros del equipo</h3>

      {farm &&
        Object.entries(farm?.team).map(
          ([key, { name, email, id, invitation }], index) => (
            <div key={id} className="flex items-center w-full justify-between">
              <div>
                <ModalDelete
                  handleDelete={() => handleDeleteMemberTeam(id)}
                  title={'Eliminar animal'}
                  buttonLabel={null}
                  openModalItem={(props) => (
                    <button
                      {...props}
                      className="btn btn-circle btn-xs btn-error"
                    >
                      <Icon name="delete" size="xs" />
                    </button>
                  )}
                />
              </div>
              <div>{name}</div>
              <div>{email}</div>
              <div className="flex items-center">
                <div>Invitación</div>
                <div>{invitation?.accepted && <Icon name="done" />}</div>
                <div>
                  {invitation?.sent && !invitation?.accepted && (
                    <Icon name="time" />
                  )}
                </div>
                <div>
                  {!invitation?.sent && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleUpdateTeamMemberInvitation(id, {
                          email,
                          id,
                          name: name,
                          invitation: { sent: true, accepted: false }
                        })
                        handleSendInvitation({
                          to: { email, id, name: name || '' }
                        })
                      }}
                    >
                      <Icon name="send" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}

      <SearchUserForm setNewUser={handleSetMember} />

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ">
          <div className="w-full flex gap-2 my-2">
            <div className="form-control w-1/4">
              <input
                className="input input-sm  "
                // important to include key with field's id
                {...register(`name`, {
                  required: 'Este campo es necesario'
                })}
                placeholder="nombre"
              />
            </div>

            <div className="form-control w-full min-w-0">
              <input
                disabled
                className="input input-sm  "
                placeholder="email"
                // important to include key with field's id
                {...register(`email`, {
                  required: 'Este campo es necesario'
                })}
              />
            </div>
            {/* ************************** TODO should add permissions for each team member **************************** */}

            <div className="flex w-24 gap-1  justify-center ">
              <button
                className="btn btn-sm btn-circle btn-warning "
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                <Icon name="close" />
                <span className="hidden">Eliminar</span>
              </button>
              <button
                className="btn btn-sm btn-circle btn-success "
                type="submit"
              >
                <Icon name="done" />
                <span className="hidden">Agregar</span>
              </button>
            </div>
          </div>

          {/* {showButtonSave && (
          <div className="flex w-full justify-center">
            <button className="btn btn-sm btn-info " type="submit">
              <span className="mr-2">Guardar cambios</span>
              <Icon name="done" />
            </button>
          </div>
        )} */}
        </form>
      )}
    </div>
  )
}

const SearchUserForm = ({
  setNewUser
}: {
  setNewUser: (user: MemberTeam | null) => void
}) => {
  interface HelperText {
    type: 'error' | 'success' | 'info'
    message: string
  }
  const { searchUser } = useSearchUsers()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm()
  const [helperText, setHelperText] = useState<HelperText | null>(null)
  const onSubmit = (data: any) => {
    searchUser({ email: data.email }).then((res) => {
      if (res) {
        setHelperText({
          message: 'Encontramos este usuario. ¿Quieres agregarlo?',
          type: 'info'
        })
        setNewUser(res)
      } else {
        console.log('user not found')
        setHelperText({ message: 'Usuario no encontrado', type: 'error' })
      }
      setTimeout(() => {
        setHelperText(null)
      }, 3000)
    })
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" my-2
      "
    >
      <div className="form-control">
        <label htmlFor="member-mail">Agregar miembro</label>
        <div className="flex mb-0">
          <input
            id="member-mail"
            className="input input-sm w-full rounded-r-none "
            placeholder="Buscar usuario"
            {...register('email', { required: 'Este campo es necesario' })}
          />
          <button className="btn btn-info btn-sm rounded-l-none">
            <Icon name="search" />
          </button>
        </div>
        {helperText?.type === 'error' && (
          <span className="text-error label-text  ">{helperText.message}*</span>
        )}
        {errors.email && (
          <span className="text-error label-text  ">
            <>{errors.email.message}*</>
          </span>
        )}
        {helperText?.type === 'success' && (
          <span className="text-success label-text  ">
            {helperText.message}*
          </span>
        )}
        {helperText?.type === 'info' && (
          <span className="text-info label-text  ">{helperText.message}*</span>
        )}
      </div>
    </form>
  )
}

export default FarmTeamForm
