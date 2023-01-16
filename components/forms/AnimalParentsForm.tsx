import { useFormContext } from 'react-hook-form'

import ParentForm from './ParentForm'

export const AnimalParentsForm = () => {
  const { setValue, watch } = useFormContext()
  // console.log(watch('parents'))
  const parents = watch('parents')
  return (
    <>
      <div className=" flex w-full justify-around">
        <div className="flex flex-col justify-center text-center">
          <span>Madre: </span>
          <span>{parents?.mother?.earring ?? 'sin'}</span>
        </div>
        <div className="flex flex-col justify-center text-center">
          <span>Padre: </span>
          <span>{parents?.father?.earring ?? 'sin'}</span>
        </div>
      </div>
      <div className="flex w-full justify-around my-2">
        <ParentForm
          gender="female"
          setValue={(value) => setValue(`parents.mother`, value)}
          value={parents?.mother}
        />
        <ParentForm
          gender="male"
          setValue={(value) => setValue(`parents.father`, value)}
          value={parents?.father}
        />
      </div>
    </>
  )
}

export default AnimalParentsForm
