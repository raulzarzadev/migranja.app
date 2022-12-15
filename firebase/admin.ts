import admin from 'firebase-admin'

const serviceAccount = process.env.NEXT_PUBLIC_ADMIN_FIREBASE_CONFIG ?? ''

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: 'https://ranchito-95fa6-default-rtdb.firebaseio.com'
})
