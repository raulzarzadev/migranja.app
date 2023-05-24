import { getUserFarm } from '@firebase/Farm/main'
import { app } from '@firebase/main'
import { createUserFromGoogleProvider, getUser } from '@firebase/Users/main'
import { UserType } from '@firebase/Users/user.model'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserFarm } from 'store/slices/farmSlice'
import { selectAuthState, setAuthState } from '../../store/slices/authSlice'
import { useRouter } from 'next/router'

const useAuth = () => {
  const auth = getAuth(app)
  const user = useSelector(selectAuthState)
  const router = useRouter()
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
      }
      if (user) router.push('/home')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, dispatch])

  return { user }
}

export default useAuth
