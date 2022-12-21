import { MemberTeam } from '@firebase/Farm/farm.model'
import useSearchUsers from 'components/hooks/useSearchUsers'
import Icon from 'components/Icon'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
    reset,
    formState: { errors }
  } = useForm()
  const [helperText, setHelperText] = useState<HelperText | null>(null)
  const onSubmit = (data: any) => {
    searchUser({ email: data.email })
      .then((res) => {
        if (res) {
          setHelperText({
            message: 'Encontramos este usuario. ¿Quieres agregarlo?',
            type: 'info'
          })
          setNewUser(res)
          reset()
        } else {
          console.log('user not found')
          setHelperText({ message: 'Usuario no encontrado', type: 'error' })
        }
        setTimeout(() => {
          setHelperText(null)
        }, 3000)
      })
      .catch((err) => console.log(err))
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

export default SearchUserForm
