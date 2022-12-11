import { useState } from 'react'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'
import AnimalsTable from '../AnimalsTable'
import AnimalForm from '../forms/AnimalForm'
import SquareOption from '../SquareOption'
import AnimalCard from './AnimalCard'
import MenuOptions from './MenuOptions'

interface BreadCrumb {
  type?: string
  animal?: string
  animalOpt?: string
  animalSelected?: string
}
type BreadCrumbProps = 'type' | 'animal' | 'animalOpt' | 'animalSelected'

const UserHome = () => {
  const [breadcrumb, setBreadcrumb] = useState<BreadCrumb>({})
  const handleRowClick = (id: string) => {
    setBreadcrumb({ ...breadcrumb, animalSelected: id })
  }

  const handleDeleteBreadcrumbProp = (prop: BreadCrumbProps) => {
    const aux = { ...breadcrumb }
    delete aux[prop]
    setBreadcrumb({ ...aux })
  }

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
                handleDeleteBreadcrumbProp('animalSelected')
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

      <div
        className={`bg-base-300 rounded-lg shadow-md overflow-x-auto ${
          breadcrumb?.animalSelected ? 'w-1/8' : 'w-full'
        }`}
      >
        {breadcrumb.animalOpt === 'add' && (
          <div className="p-2">
            <AnimalForm
              animal={{
                type: breadcrumb.animal as AnimalType['type']
              }}
            />
          </div>
        )}
        {breadcrumb.animalOpt === 'showAll' && (
          <AnimalsTable
            onRowClick={(id) => handleRowClick(id)}
            selectedRow={breadcrumb?.animalSelected}
          />
        )}
      </div>
      {breadcrumb?.animalSelected && (
        <div className="bg-base-300 w-full rounded-lg shadow-md">
          <AnimalCard animalId={breadcrumb?.animalSelected} />
        </div>
      )}
    </div>
  )
}

export default UserHome
