import UserFarm, { UserFarms } from 'components/UserFarm'
import FarmInvitations from 'components/FarmInvitations'
import H2 from '@comps/Basics/Title2'
import Icon from '@comps/Icon'
import { useState } from 'react'
import Modal from '@comps/modal'
import FarmForm from '@comps/forms/FarmForm'
import useModal from '@comps/hooks/useModal'

const UserHome = () => {
  return (
    <>
      <H2>
        Mis granjas <AddFarm />
      </H2>
      {/* <UserFarm /> */}
      <UserFarms />
      <FarmInvitations />
    </>
  )
}
const AddFarm = () => {
  const modal = useModal()
  return (
    <>
      <button
        className="btn btn-circle btn-xs btn-success"
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
      >
        <Icon name="plus" size="xs" />
      </button>

      <Modal {...modal} title={'Nueva granja'}>
        <div>
          <FarmForm />
        </div>
      </Modal>
    </>
  )
}
export default UserHome
