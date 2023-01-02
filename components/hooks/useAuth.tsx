import { authStateChanged } from '@firebase/Users/main'
import { UserType } from '@firebase/Users/user.model'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuthState, setAuthState } from '../../store/slices/authSlice'

const useAuth = () => {
  const user = useSelector(selectAuthState)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user === undefined) {
      authStateChanged((user: UserType) => {
        dispatch(setAuthState(user))
      })
    }
  }, [])
  return { user }
}

export default useAuth
