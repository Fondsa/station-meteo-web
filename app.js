// App.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// 🔹 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBw417roqkibO6kPgsrx2T77aquDXMHSMA",
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
const modeRef = ref(db, "ui/mode");

// 🔹 Températures en temps réel
onValue(tempExtRef, snap => {
  document.getElementById("temp-ext").textContent = snap.val() ?? "--";
});
onValue(tempIntRef, snap => {
  document.getElementById("temp-int").textContent = snap.val() ?? "--";
});

// 🔹 Lampe
const btnLampe = document.getElementById("btn-lampe");
onValue(lampeRef, snap => {
  btnLampe.textContent = snap.val() ? "Éteindre" : "Allumer";
});
btnLampe.addEventListener("click", async () => {
  const snap = await get(lampeRef);
  set(lampeRef, !snap.val());
});

// 🔹 Mode Jour/Nuit persistant
const modeBtn = document.getElementById("mode-btn");

// Lecture initiale depuis Firebase
onValue(modeRef, snap => {
  const mode = snap.val() || "jour";
  document.body.className = mode;
  modeBtn.textContent = mode === "jour" ? "Mode Nuit" : "Mode Jour";
});

// Toggle et mise à jour Firebase
modeBtn.addEventListener("click", async () => {
  const snap = await get(modeRef);
  const currentMode = snap.val() || "jour";
  const newMode = currentMode === "jour" ? "nuit" : "jour";

  // Update Firebase
  set(modeRef, newMode);

  // Update style
  document.body.className = newMode;
  modeBtn.textContent = newMode === "jour" ? "Mode Nuit" : "Mode Jour";
});
