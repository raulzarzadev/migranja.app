import { useEffect, useState } from 'react'
import { authStateChanged } from '../../firebase/Users/main'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuthState, setAuthState } from '../../store/slices/authSlice'
import { UserType } from '../../firebase/Users/user.model'

const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthState)
  useEffect(() => {
    authStateChanged((user: UserType) => {
      dispatch(setAuthState(user))
    })
  }, [dispatch])

  return { user }
}

export default useAuth
