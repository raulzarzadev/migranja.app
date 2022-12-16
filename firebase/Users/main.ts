import { MemberTeam } from '@firebase/Farm/farm.model'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import { CreateUserDTO, UserType } from './user.model'

const auth = getAuth(app)
const storage = getStorage(app)

// CREATE A MAIN INSTANCE FOR USERS
const usersCRUD = new FirebaseCRUD('users', db, storage, 'number')

export const setUser = async (itemId: string, newItem: object) =>
  await usersCRUD.setItem(itemId, newItem)

export const createUser = async (newItem: any) =>
  await usersCRUD.createItem(newItem)
export const createUserFromGoogleProvider = async (newItem: any) => {
  const { uid, photoURL, emailVerified, email, displayName } = newItem
  const userFormatted: CreateUserDTO = {
    id: uid,
    image: photoURL,
    photoURL: photoURL,
    email,
    images: [],
    emailVerified,
    displayName
  }
  return await usersCRUD.setItem(uid, userFormatted)
}
export const updateUser = async (itemId: string, newItem: Partial<UserType>) =>
  await usersCRUD.updateItem(itemId, newItem)

export const deleteUser = async (itemId: string) =>
  await usersCRUD.deleteItem(itemId)

export const getUser = async (itemId: string) => await usersCRUD.getItem(itemId)

export const listenUser = async (itemId: string, cb: CallableFunction) =>
  await usersCRUD.listenItem(itemId, cb)

export function authStateChanged(cb: CallableFunction) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log(user)
      // console.log('not logged');
      return cb(null)
    } else {
      getUser(user.uid).then((res) => {
        cb(res)
      })
    }
  })
}

export async function findUserByEmail({ email }: { email: string }) {
  const formatTeamMember = (user: UserType): MemberTeam => {
    return {
      name: user?.displayName,
      email: user?.email,
      id: user?.id
    }
  }
  return await usersCRUD.getItems([where('email', '==', email)]).then((res) => {
    if (res?.length) return formatTeamMember(res[0])
    return null
  })
}

export async function googleLogin() {
  const provider = new GoogleAuthProvider()
  const user = await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      // The signed-in user info.
      const user = result.user
      return user
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.error({ error })
      return null
      // ...
    })
  console.log(user?.uid)
  const a = await getUser(user?.uid)
  console.log(a)
  // const dbUser = user?.uid && (await getUser(user?.uid))
  // if (!dbUser) {
  //   //create user
  //   createUserFromGoogleProvider(user)
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err))
  // } else {
  //   console.log('user already exists')
  //   // nothing
  // }
}

export async function logout() {
  return await signOut(auth)
}
