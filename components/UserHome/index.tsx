import { useState } from 'react'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'
import AnimalsTable from '../AnimalsTable'
import AnimalForm from '../forms/AnimalForm'
import SquareOption from '../SquareOption'
import MenuOptions from './MenuOptions'

interface BreadCrumb {
  type?: string
  animal?: string
  animalOpt?: string
}
const UserHome = () => {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumb>({})
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        {MenuOptions.options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setBreadcrumb((state) => {
                return { type: option.id }
              })
            }}
          >
            <SquareOption
              selected={breadcrumb.type === option.id}
              option={{ title: option.label }}
            />
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {MenuOptions?.options
          ?.find(({ id }) => id === breadcrumb?.type)
          ?.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setBreadcrumb((state) => {
                  return { ...state, animal: option.id }
                })
              }}
            >
              <SquareOption
                selected={breadcrumb.animal === option.id}
                option={{ title: option.label }}
              />
            </button>
          ))}
      </div>
      <div className="flex flex-col gap-2">
        {MenuOptions.options
          .find(({ id }) => id === breadcrumb?.type)
          ?.options?.find(({ id }) => id === breadcrumb?.animal)
          ?.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setBreadcrumb((state) => {
                  return { ...state, animalOpt: option.id }
                })
              }}
            >
              <SquareOption
                selected={breadcrumb.animalOpt === option.id}
                option={{ title: option.label }}
              />
            </button>
          ))}
      </div>
      <div className="bg-base-300 w-full rounded-lg shadow-md">
        {breadcrumb.animalOpt === 'add' && (
          <AnimalForm
            animal={{
              type: breadcrumb.animal as AnimalType['type']
            }}
          />
        )}
        {breadcrumb.animalOpt === 'showAll' && <AnimalsTable />}
      </div>
    </div>
  )
}

export default UserHome
