import { initializeApp, getApps } from 'firebase/app'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

const devVitestMode = process.env.VITE_USER_NODE_ENV
let firebaseConfig = ''

if (devVitestMode === 'development') {
  firebaseConfig = process.env.VITE_NEXT_PUBLIC_FIREBASE_CONFIG || ''
  console.log('test mode', { firebaseConfig })
} else {
  firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG || ''
}
//const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? ''
const apps = getApps()

export const app = initializeApp(JSON.parse(firebaseConfig))

export const db = getFirestore(app)

// call to enable persistence just when any app has been created
apps[0] ||
  enableIndexedDbPersistence(db)
    .then(() => console.log('Enabled offline persistence'))
    .catch((error) => {
      if (error.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (error.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    })
