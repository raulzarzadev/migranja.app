import Icon from '@comps/Icon'
import { updateAnimalState } from '@firebase/Animal/main'
import { updateEvent } from '@firebase/Events/main'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalStateType } from 'types/base/AnimalState.model'
import { AnimalType } from 'types/base/AnimalType.model'
import Modal from '..'
import ModalAnimalDetails from '../ModalAnimalDetails'
import WeaningOptions from '@comps/WeaningOptions'

const onWeaning = async ({
  state,
  animalId,
  motherId,
  eventId,
  animalPastState
}: {
  state: AnimalStateType
  animalId: string
  eventId: string
  animalPastState: AnimalType['state']
  motherId?: string
}) => {
  try {
    //* Update animal state
    await updateAnimalState(animalId, state, animalPastState)
    //* Update mother animal state
    if (motherId) {
      //* TODO: Check if have more children weaning
      await updateAnimalState(motherId, 'FREE', 'SUCKLE')
    }
    //* Update event status to done
    //@ts-ignore
    await updateEvent(eventId, { 'eventData.status': 'DONE' })
  } catch (error) {
    console.log({ error })
  }
}

export interface WeaningType {}

const ModalEditWeaning = ({
  eventId,
  animalEarring
}: {
  eventId: string
  animalEarring?: string
}) => {
  const [openEditEvent, setOpenEditEvent] = useState(false)
  const handleOpenEditEvent = () => {
    setOpenEditEvent(!openEditEvent)
  }
  const farmAnimals = useSelector(selectFarmAnimals)
  const animal = farmAnimals.find((animal) => animal.earring === animalEarring)
  const animalId = animal?.id
  // const animalMotherId = animal?.parents?.mother?.id
  const [error, setError] = useState('')
  // const handleWeaning = async (state: AnimalStateType) => {
  //   if (!animalId) return setError('No animalId')
  //   try {
  //     //* Update animal state
  //     await updateAnimalState(animalId, state, animal.state)
  //     //* Update mother animal state
  //     if (animalMotherId) {
  //       //* TODO: Check if have more children weaning
  //       await updateAnimalState(animalMotherId, 'FREE', 'SUCKLE')
  //     }
  //     //* Update event status to done
  //     //@ts-ignore
  //     await updateEvent(eventId, { 'eventData.status': 'DONE' })
  //   } catch (error) {
  //     console.log({ error })
  //   }
  // }
  console.log({ eventId, animalEarring, genero: animal?.gender })

  return (
    <>
      <button
        className="text-info btn btn-outline"
        onClick={(e) => {
          e.preventDefault()
          handleOpenEditEvent()
        }}
      >
        <Icon name="bell" />
        {'Destetar'}
      </button>
      <Modal
        open={openEditEvent}
        handleOpen={handleOpenEditEvent}
        title="Editar destete"
      >
        <div className="flex flex-col w-full justify-center items-center my-5">
          <span>
            Destetar arete:
            <ModalAnimalDetails earring={animalEarring} size="normal" />
          </span>
          <p>Se realizarán los siguientes movimientos:</p>
          <ul>
            <li className="list-disc">
              {` Estado del animal a  "Engorda / Venta / Vientre"`}
            </li>
            <li className="list-disc">{`Estado del la madre a "Libre"`}</li>
            <li className="list-disc">{`Estado del evento a "Completado"`}</li>
          </ul>
          {error && (
            <div className="bg-error text-error-content p-1 text-sm rounded-md">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row w-full justify-evenly items-center">
            <WeaningOptions animalId={animalId} />
            {/* <ButtonOption
              onClick={(e) => {
                e.preventDefault()
                handleWeaning('FATTEN')
              }}
              label="Para engorda"
              helperText="* Aun no esta listo para vender. Puede ser hembra o macho"
            />
            <ButtonOption
              onClick={(e) => {
                e.preventDefault()
                handleWeaning('FOR_SALE')
              }}
              label="Para venta"
              helperText="* Puede ser vendido ahora."
            />
            {animal?.gender === 'female' && (
              <ButtonOption
                onClick={(e) => {
                  e.preventDefault()
                  handleWeaning('FOR_SALE')
                }}
                label="Para vientre"
                helperText="* Una hembra que formara parte del ganado principal."
              />
            )} */}
          </div>
        </div>
      </Modal>
    </>
  )
}

// export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
//   helperText: string
//   label: string
//   type?: any
// }

// const ButtonOption: React.FC<ButtonProps> = ({ ...props }) => {
//   const { label, helperText, ...rest } = props
//   return (
//     <div className="sm:w-1/3 flex justify-start  flex-col items-center ">
//       <button className="btn btn-info mt-5 btn-outline  " {...rest}>
//         <span className="truncate">{label}</span>
//       </button>
//       <p className="whitespace-pre-wrap text-xs ">{helperText}</p>
//     </div>
//   )
// }

export default ModalEditWeaning
