import { initializeApp } from 'firebase/app'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? ''

export const app = initializeApp(JSON.parse(firebaseConfig))
export const db = getFirestore(app)

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
