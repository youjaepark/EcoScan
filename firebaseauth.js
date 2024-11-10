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
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnlAu4RJc4OdwrlJnPEtQlrw1MCvNaa8o",
  authDomain: "ecoscan-c2a93.firebaseapp.com",
  projectId: "ecoscan-c2a93",
  storageBucket: "ecoscan-c2a93.firebasestorage.app",
  messagingSenderId: "568397776817",
  appId: "1:568397776817:web:fd6c5018e7f4969f7fdf90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Helper function to display messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
      messageDiv.style.opacity = 0;
    }, 5000);
  }
}

// Function to update authentication button and display based on auth state
function updateAuthButton() {
  const authButton = document.querySelector(".navbar__btn");
  const startText = document.getElementById("startText") || document.querySelector(".main__content p");
  const startCameraBtn = document.getElementById("startCameraBtn");
  const auth = getAuth();

  if (authButton) authButton.classList.remove("visible"); // Hide initially

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authButton.innerHTML = `<button class="button" id="logoutBtn">Log Out</button>`;
      if (startText) startText.style.display = "block";
      if (startCameraBtn) startCameraBtn.style.display = "block";
      
      document.getElementById("logoutBtn")?.addEventListener("click", () => {
        auth.signOut().then(() => {
          window.location.href = "/";
        });
      });
    } else {
      authButton.innerHTML = `<a href="/login.html" class="button">Sign In</a>`;
      if (startText) startText.style.display = "none";
      if (startCameraBtn) startCameraBtn.style.display = "none";
    }

    if (authButton) setTimeout(() => authButton.classList.add("visible"), 50); // Show after update
  });
}

// Ensure DOM is fully loaded
document.addEventListener("DOMContentLoaded", updateAuthButton);

// Signup event listener
const signUp = document.getElementById("submitSignUp");
if (signUp) {
  signUp.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email,
          firstName,
          lastName,
          score: 5,
          itemsRecycled: 0,
        };
        showMessage("Account Created Successfully! You've earned 5 points for signing up!", "signUpMessage");
        return setDoc(doc(db, "users", user.uid), userData);
      })
      .then(() => setTimeout(() => window.location.href = "/login.html", 2000))
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          showMessage("Email Address Already Exists !!!", "signUpMessage");
        } else {
          showMessage("Unable to create user", "signUpMessage");
        }
      });
  });
}

// Signin event listener
const signIn = document.getElementById("submitSignIn");
if (signIn) {
  signIn.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        showMessage("Login successful", "signInMessage");
        window.location.href = "/";
      })
      .catch((error) => {
        const errorCode = error.code;
        if (["auth/invalid-email", "auth/wrong-password"].includes(errorCode)) {
          showMessage("Incorrect Email or Password", "signInMessage");
        } else {
          showMessage("Account does not exist", "signInMessage");
        }
      });
  });
}
