import * as firebase from 'firebase'
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyAFSjtoDEPY2_zfcOEznVO2yFgLX7KbRfw",
    authDomain: "book-club-3999.firebaseapp.com",
    projectId: "book-club-3999",
    storageBucket: "book-club-3999.appspot.com",
    messagingSenderId: "428779754063",
    appId: "1:428779754063:web:930071ba0350a9af60103a"
  };
  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

export default firebase.firestore();