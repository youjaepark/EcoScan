// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
 getAuth,
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();


// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // If not authenticated, redirect to index.html
    window.location.href = "./index.html";
  }
});


function showMessage(message, divId) {
 var messageDiv = document.getElementById(divId);
 messageDiv.style.display = "block";
 messageDiv.innerHTML = message;
 messageDiv.style.opacity = 1;
 setTimeout(function () {
   messageDiv.style.opacity = 0;
 }, 5000);
}


// Existing signup and sign-in code remains unchanged


// Function to display user data
function displayUserData() {
 const userId = localStorage.getItem("loggedInUserId");
 if (userId) {
   const docRef = doc(db, "users", userId);
   getDoc(docRef)
     .then((docSnap) => {
       if (docSnap.exists()) {
         const userData = docSnap.data();
         document.getElementById("loggedUserFName").textContent =
           userData.firstName || "";
         document.getElementById("loggedUserLName").textContent =
           userData.lastName || "";
         document.getElementById("loggedUserEmail").textContent =
           userData.email || "";
        document.getElementById("loggedUserScore").textContent =
           userData.score|| "";
       } else {
         console.error("No user data found!");
       }
     })
     .catch((error) => {
       console.error("Error fetching user data:", error);
     });
 } else {
   console.log("User not logged in.");
 }
}


// Trigger the data display function when on homepage
if (window.location.pathname.endsWith("homepage.html")) {
 displayUserData();
}
