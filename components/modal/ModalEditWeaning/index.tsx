import Icon from '@comps/Icon'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import Modal from '..'
import ModalAnimalDetails from '../ModalAnimalDetails'
import WeaningOptions from '@comps/WeaningOptions'
import useModal from '@comps/hooks/useModal'

export interface WeaningType {}

const ModalEditWeaning = ({
  animalEarring
}: {
  eventId: string
  animalEarring?: string
}) => {
  const modal = useModal()
  const farmAnimals = useSelector(selectFarmAnimals)
  const animal = farmAnimals.find((animal) => animal.earring === animalEarring)
  const animalId = animal?.id

  return (
    <>
      <button
        className="text-info btn btn-outline"
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
      >
        <Icon name="bell" />
        {'Destetar'}
      </button>
      <Modal {...modal} title="Editar destete">
        <div className="flex flex-col w-full justify-center items-center my-5">
          <span>
            Destetar arete:
            <ModalAnimalDetails earring={animalEarring} size="normal" />
          </span>
          Mo
          <p>Se realizarán los siguientes movimientos:</p>
          <ul>
            <li className="list-disc">
              {` Estado del animal a  "Engorda / Venta / Vientre"`}
            </li>
            <li className="list-disc">{`Estado del la madre a "Libre"`}</li>
            <li className="list-disc">{`Estado del evento a "Completado"`}</li>
          </ul>
          <div className="flex flex-col sm:flex-row w-full justify-evenly items-center">
            <WeaningOptions animalId={animalId} />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalEditWeaning
