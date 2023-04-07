import UserFarm, { UserFarms } from 'components/UserFarm'
import FarmInvitations from 'components/FarmInvitations'
import H2 from '@comps/Basics/Title2'
import Icon from '@comps/Icon'
import { useState } from 'react'
import Modal from '@comps/modal'
import FarmForm from '@comps/forms/FarmForm'

const UserHome = () => {
  return (
    <>
      <H2>
        Mis granja <AddFarm />
      </H2>
      {/* <UserFarm /> */}
      <UserFarms />
      <FarmInvitations />
    </>
  )
}
const AddFarm = () => {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  return (
    <>
      <button
        className="btn btn-circle btn-xs btn-success"
        onClick={(e) => {
          e.preventDefault()
          handleOpenModal()
        }}
      >
        <Icon name="plus" size="xs" />
      </button>
      <Modal
        handleOpen={handleOpenModal}
        open={openModal}
        title={'Nueva granja'}
      >
        <div>
          <FarmForm
            setEditing={function (bool: boolean): void {
              throw new Error('Function not implemented.')
            }}
          />
        </div>
      </Modal>
    </>
  )
}
export default UserHome
