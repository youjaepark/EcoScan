import { 
    getAuth, 
    onAuthStateChanged 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
  import { 
    getFirestore, 
    doc, 
    getDoc, 
    getDocs, 
    collection 
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
  import { updateUserScore } from "./score.js"; 
  
  let currentPoints = 0;
  const maxPoints = 1000;
  let itemsRecycled = 0;
  
  // Fetch top 5 leaderboard data
  async function fetchLeaderboardData() {
    const db = getFirestore();
    const leaderboardRef = collection(db, "users");
    const leaderboardData = [];
  
    try {
      const querySnapshot = await getDocs(leaderboardRef);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboardData.push({
          username: `${data.firstName} ${data.lastName}`,
          points: data.score || 0,
          level: Math.floor((data.score || 0) / 1000) + 1,
        });
      });
  
      leaderboardData.sort((a, b) => b.points - a.points);
      return leaderboardData.slice(0, 5);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      return [];
    }
  }
  
  // Populate leaderboard in the DOM
  async function populateLeaderboard() {
    const tbody = document.getElementById("leaderboardBody");
    const leaderboardData = await fetchLeaderboardData();
    tbody.innerHTML = ""; // Clear previous rows
  
    leaderboardData.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.points}</td>
        <td>${entry.level}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Update UI based on authentication state
  function updateAuthStateUI(user) {
    const leaderboard = document.querySelector(".leaderboard");
    const progressContainer = document.querySelector(".progress-container");
    const levelIndicator = document.querySelector(".level-indicator");
    const authButton = document.querySelector(".navbar__btn");
  
    if (user) {
      authButton.innerHTML = `<button class="button" id="logoutBtn">Log Out</button>`;
      document.getElementById("logoutBtn").addEventListener("click", () => {
        auth.signOut().then(() => {
          window.location.href = "/";
        });
      });
  
      leaderboard.style.display = "block";
      progressContainer.style.display = "block";
      levelIndicator.style.display = "block";
  
      const signInMessage = document.getElementById("signInMessage");
      if (signInMessage) signInMessage.remove();
    } else {
      authButton.innerHTML = `<a href="/login.html" class="button">Sign In</a>`;
      leaderboard.style.display = "none";
      progressContainer.style.display = "none";
      levelIndicator.style.display = "none";
  
      if (!document.getElementById("signInMessage")) {
        const message = document.createElement("div");
        message.id = "signInMessage";
        message.innerHTML = `<h1 style="text-align: center; margin: 50px 0; font-size: 2rem; font-weight: bold;">Sign in to see the leaderboard and your stats!</h1>`;
        document.body.appendChild(message);
      }
    }
  }
  
  // Fetch and display user stats
  async function displayUserStats() {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
  
    if (user) {
      const docRef = doc(db, "users", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const points = userData.score || 0;
          const itemsRecycled = userData.itemsRecycled || 0;
  
          document.getElementById("loggedUserScore").textContent = points;
          document.getElementById("itemsRecycled").textContent = itemsRecycled;
  
          const currentLevel = Math.floor(points / maxPoints) + 1;
          document.getElementById("currentLevel").textContent = currentLevel;
  
          const percentage = ((points % maxPoints) / maxPoints) * 100;
          const progressBar = document.querySelector(".progress-bar");
          if (progressBar) {
            progressBar.style.width = `${percentage}%`;
          }
  
          const levelIndicator = document.querySelector(".level-indicator");
          if (levelIndicator) {
            levelIndicator.textContent = `Level ${currentLevel} - ${percentage.toFixed(1)}%`;
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }
  
  // Monitor authentication state
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    updateAuthStateUI(user);
    if (user) {
      displayUserStats();
      const scoreToAdd = 10;
      updateUserScore(scoreToAdd);
    } else {
      console.warn("User is not authenticated. Cannot update score.");
    }
  });
  
  // Initialize page content
  document.addEventListener("DOMContentLoaded", () => {
    populateLeaderboard();
    const user = getAuth().currentUser;
    if (user) {
      const scoreToAdd = 10;
      updateUserScore(scoreToAdd);
    } else {
      console.warn("User is not authenticated. Cannot update score.");
    }
    currentPoints = 0;
    itemsRecycled = 0;
    document.getElementById("itemsRecycled").textContent = "0";
  });
  
  // Mobile menu functionality
  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".navbar__menu");
  
  menu.addEventListener("click", function () {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
  });
  