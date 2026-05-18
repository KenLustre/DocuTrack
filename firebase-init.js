// In firebase-init.js

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSy...",
  // ... paste the rest of your config here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make auth and firestore services easily accessible
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
