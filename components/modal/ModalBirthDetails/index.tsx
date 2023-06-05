import useModal from '@comps/hooks/useModal'
import useEvent from '@comps/hooks/useEvent'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import Modal from '..'
import ModalRevertBirth from '../ModalRevertBirth'
import BirthDetails from '@comps/BirthDetails'
import { ReactNode } from 'react'

const ModalBirthDetails = ({
  birthId,
  children
}: {
  birthId: string
  children?: ReactNode
}) => {
  const { event } = useEvent({ eventId: birthId })
  const events = useSelector(selectFarmEvents)
  const modal = useModal()
  const breedingId = events?.find(
    ({ eventData }) => eventData.breedingId === event?.eventData.breedingId
  )?.id
  const motherId = event?.eventData?.parents?.mother?.id
  // const canRevert = birthId && breedingId && motherId
  const defaultButton = 'Detalles de parto'
  if (!birthId) return <span>Parto no encontrado</span>
  return (
    <>
      <button
        onClick={(e) => {
          // console.log({ e })
          modal.handleOpen()
        }}
        className=""
      >
        {children || defaultButton}
      </button>
      {modal.open && (
        <Modal
          open={modal.open}
          handleOpen={modal.handleOpen}
          title="Detalles de parto"
        >
          <div>
            <div>{birthId && <BirthDetails birthId={birthId} />}</div>
            <ModalRevertBirth
              birthId={birthId}
              breedingId={breedingId || ''}
              motherId={motherId || ''}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalBirthDetails
