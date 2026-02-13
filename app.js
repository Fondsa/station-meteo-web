// Import des fonctions nécessaires depuis le SDK modulaire
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// 🔹 Initialisation Firebase
const firebaseConfig = {
  apiKey: apiKey: "AIzaSyBw417roqkibO6kPgsrx2T77aquDXMHSMA",
  authDomain: "projetfakirradio.firebaseapp.com",
  databaseURL: "https://projetfakirradio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projetfakirradio",
  storageBucket: "projetfakirradio.firebasestorage.app",
  messagingSenderId: "363899261538",
  appId: "1:363899261538:web:ad30da02b1485f5c2d373b",
  measurementId: "G-EZL8K5CS4Y"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Références BDD
const tempExtRef = ref(db, "capteurs/exterieur/temperature");
const tempIntRef = ref(db, "capteurs/interieur/temperature");
const lampeRef = ref(db, "commande/lampe");

// 🔹 Lecture temps réel
onValue(tempExtRef, (snapshot) => {
  document.getElementById("temp-ext").textContent = snapshot.val();
});

onValue(tempIntRef, (snapshot) => {
  document.getElementById("temp-int").textContent = snapshot.val();
});

const btn = document.getElementById("btn-lampe");

// 🔹 Lecture état lampe et mise à jour du bouton
onValue(lampeRef, (snapshot) => {
  btn.textContent = snapshot.val() ? "Éteindre" : "Allumer";
});

// 🔹 Action du bouton
btn.addEventListener("click", async () => {
  const snap = await get(lampeRef);
  set(lampeRef, !snap.val());
});
