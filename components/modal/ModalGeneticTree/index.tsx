import useModal from '@comps/hooks/useModal'
import Modal from '..'
import ModalAnimalDetails from '../ModalAnimalDetails'
import { AnimalType } from 'types/base/AnimalType.model'
import useAnimal from '@comps/hooks/useAnimal'
import GeneticTree from '@comps/GeneticTree'
import MyTable from '@comps/MyTable'
import { useEffect, useState } from 'react'
import useFarmAnimals from '@comps/hooks/useFarmAnimals'
import StatCardWithModalAnimalsList from '@comps/FarmNumbers/StatCardWithModalAnimalsList'

const ModalGeneticTree = ({ animalId }: { animalId: AnimalType['id'] }) => {
  const modal = useModal()
  const { findAnimal } = useAnimal()
  const animal = findAnimal({ animalId })
  const parents = animal?.parents
  return (
    <div className="flex justify-center items-center">
      <GeneticTree
        parents={{
          father: {
            id: parents?.father?.id || '',
            label: parents?.father?.earring || ''
          },
          mother: {
            id: parents?.mother?.id || '',
            label: parents?.mother?.earring || ''
          }
        }}
      />
      <button
        onClick={() => {
          modal.handleOpen()
        }}
        className="link"
      >
        mas
      </button>
      <Modal {...modal} title="Genetica">
        <div>
          <h3>Arbol genealogico completo de {animal?.earring}</h3>
          <GeneticTree
            parents={{
              father: {
                id: parents?.father?.id || '',
                label: parents?.father?.earring || ''
              },
              mother: {
                id: parents?.mother?.id || '',
                label: parents?.mother?.earring || ''
              }
            }}
          />
        </div>
        <div>Descendecia</div>
        <LambingHistory animalId={animalId} />
      </Modal>
    </div>
  )
}

const LambingHistory = ({ animalId }: { animalId: AnimalType['id'] }) => {
  const [lambs, setLambs] = useState<AnimalType[]>([])
  const animals = useFarmAnimals()

  const searchLambs = ({ animalId }: { animalId: AnimalType['id'] }) => {
    return animals.filter((animal) => {
      return (
        animal.parents?.father?.id === animalId ||
        animal.parents?.mother?.id === animalId
      )
    })
  }
  useEffect(() => {
    const res = searchLambs({ animalId })
    setLambs(res)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-wrap">
      <StatCardWithModalAnimalsList
        animals={lambs.filter(({ gender }) => gender === 'female')}
        description="Hembras"
        title="Hijas"
      />
      <StatCardWithModalAnimalsList
        animals={lambs.filter(({ gender }) => gender === 'male')}
        description="Machos"
        title="Hijos"
      />
    </div>
  )
}

export default ModalGeneticTree
