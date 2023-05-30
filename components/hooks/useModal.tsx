import { useState } from 'react'

const useModal = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(!open)
  }
  const onOpen = () => {
    handleOpen()
  }

  return { open, handleOpen, onOpen }
}

export default useModal
