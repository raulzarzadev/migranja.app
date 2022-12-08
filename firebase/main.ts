import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? ''

export const app = initializeApp(JSON.parse(firebaseConfig))
export const db = getFirestore(app)
