import { MemberTeam } from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import Icon from 'components/Icon'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'
export interface TeamMemberFormType
  extends Pick<MemberTeam, 'email' | 'name' | 'id'> {}

const FarmTeamForm = ({
  teamMember,
  handleHideFrom
}: {
  teamMember?: TeamMemberFormType
  handleHideFrom?: () => void
}) => {
  const farm = useSelector(selectFarmState)
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: teamMember
  })

  const onSubmit = (data: any) => {
    farm?.id &&
      updateFarm(farm?.id, {
        [`team.${data.id}`]: {
          ...data,
          invitation: { status: 'PENDING_TO_SEND' }
        }
      })
        .then((res) => {
          reset()
        })
        .catch((err) => console.error(err))
    handleReset()
  }

  const handleReset = () => {
    setValue('email', '')
    setValue('name', '')
    setValue('id', '')
    handleHideFrom?.()
  }

  return (
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
              handleReset()
            }}
          >
            <Icon name="close" />
            <span className="hidden">Eliminar</span>
          </button>
          <button className="btn btn-sm btn-circle btn-success " type="submit">
            <Icon name="done" />
            <span className="hidden">Agregar</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default FarmTeamForm
