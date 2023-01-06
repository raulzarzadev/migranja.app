import { getUserFarm } from '@firebase/Farm/main'
import { app } from '@firebase/main'
import {
  authStateChanged,
  createUserFromGoogleProvider,
  getUser
} from '@firebase/Users/main'
import { UserType } from '@firebase/Users/user.model'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserFarm } from 'store/slices/farmSlice'
import { selectAuthState, setAuthState } from '../../store/slices/authSlice'

const useAuth = () => {
  const auth = getAuth(app)
  const user = useSelector(selectAuthState)

  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // console.log({ user })
      if (!user) return dispatch(setAuthState(null))
      const dbUser = await getUser(user.uid)
      // console.log({ dbUser })
      if (!dbUser) {
        const createItem = await createUserFromGoogleProvider(user)
        // console.log({ createItem })
        if (createItem?.ok) {
          dispatch(setAuthState(createItem?.res?.item))
        }
      } else {
        dispatch(setAuthState(dbUser))
        getUserFarm(dbUser.id).then((res) => {
          console.log({ res })
          dispatch(setUserFarm(res))
        })
      }
    })
  }, [auth, dispatch])

  return { user }
}

export default useAuth
