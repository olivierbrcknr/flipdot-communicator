import firebase from 'firebase/app';
import 'firebase/database';

let firebaseDB = null;
let messagesDB = null;

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {

  let firebaseApp = firebase.initializeApp(config);
  firebaseDB = firebaseApp.database();
  messagesDB = firebaseApp.database().ref('flipMessages/');

  console.log('🔥 Firebase initialised')
}


export {messagesDB,firebaseDB};
