import { updateFarm } from '@firebase/Farm/main'
import useFarm from 'components/hooks/useFarm'
import useSearchUsers from 'components/hooks/useSearchUsers'
import Icon from 'components/Icon'
import { useFieldArray, useForm } from 'react-hook-form'
import { v4 as uidGenerator } from 'uuid'

const FarmTeamForm = () => {
  const { farm } = useFarm()
  const { searchUser } = useSearchUsers()
  const { control, register, handleSubmit } = useForm({
    defaultValues: { team: farm?.team || [] }
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'team' // unique name for your Field Array
    }
  )
  console.log(farm)
  const handleAddMember = () => {
    const uid = uidGenerator()
    append([{ id: uid, name: '', email: '' }])
  }
  console.log(fields)
  const onSubmit = (data: any) => {
    searchUser({ email: data.email }).then((res) => {
      if (res) return append(res)
      console.log('user not found')
    })
  }
  return (
    <div>
      <h3 className="text-center font-bold ">Miembros del equipo</h3>
      {!!fields.length || (
        <div>
          <div>
            <span>No hay miembros del equipo aún</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="buscar usuario" {...register('email')} />
        <button className="btn">
          <Icon name="search" />
        </button>
      </form>

      <form onSubmit={handleSubmit(onSubmit)}></form>
    </div>
  )
}

export default FarmTeamForm
