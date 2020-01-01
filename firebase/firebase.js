import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const config = {
  apiKey: "AIzaSyBXH7J69ze3HQSgvoYGWN8hZL1RjA7GpHc",
  authDomain: "project-644089455457",
  databaseURL: "https://getbar-26a78.firebaseio.com",
  projectId: "getbar-26a78",
};
firebase.initializeApp(config);

export default firebase;