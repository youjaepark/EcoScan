// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnlAu4RJc4OdwrlJnPEtQlrw1MCvNaa8o",
  authDomain: "ecoscan-c2a93.firebaseapp.com",
  projectId: "ecoscan-c2a93",
  storageBucket: "ecoscan-c2a93.firebasestorage.app",
  messagingSenderId: "568397776817",
  appId: "1:568397776817:web:fd6c5018e7f4969f7fdf90",
  measurementId: "G-7MRJNYCZK3",
};

// Function to update user score
export function updateUserScore(score) {
  const user = getAuth().currentUser; // Get the currently logged-in user
  if (!user) {
    console.error("No user is currently logged in.");
    return; // Exit if no user is logged in
  }

  // Validate score input
  if (typeof score !== "number" || score < 0) {
    console.error("Invalid score input. Score must be a non-negative number.");
    return; // Exit if the score is invalid
  }

  const db = getFirestore();
  const docRef = doc(db, "users", user.uid); // Reference to the user's document

  // Update the user's score
  getDoc(docRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const newScore = (userData.score || 0) + score; // Add the new score to the existing score
        return setDoc(docRef, { score: newScore }, { merge: true }); // Update the score in Firestore
      } else {
        console.error("User document does not exist.");
      }
    })
    .then(() => {
      console.log("User score updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating user score:", error);
    });
}