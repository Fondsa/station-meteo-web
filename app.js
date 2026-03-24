import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBw417roqkibO6kPgsrx2T77aquDXMHSMA",
  authDomain: "projetfakirradio.firebaseapp.com",
  databaseURL: "https://projetfakirradio-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projetfakirradio",
  storageBucket: "projetfakirradio.firebasestorage.app",
  messagingSenderId: "363899261538",
  appId: "1:363899261538:web:ad30da02b1485f5c2d373b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Éléments DOM
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const btnLogout = document.getElementById("btn-logout");
const adminLink = document.getElementById("admin-link");
const btnLampe = document.getElementById("btn-lampe");
const modeBtn = document.getElementById("mode-btn");

// --- CONNEXION ---
btnLogin.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, emailInput.value, passInput.value)
    .then(() => alert("Connecté !"))
    .catch(err => alert("Erreur: " + err.message));
});

// --- INSCRIPTION ---
btnSignup.addEventListener("click", async () => {
  try {
    const res = await createUserWithEmailAndPassword(auth, emailInput.value, passInput.value);
    await set(ref(db, 'users/' + res.user.uid), {
      email: emailInput.value,
      role: "user"
    });
    alert("Compte créé !");
  } catch (err) { alert(err.message); }
});

// --- DÉCONNEXION ---
btnLogout.addEventListener("click", () => signOut(auth));

// --- SURVEILLANCE AUTH ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("auth-title").textContent = "Session active";
    document.getElementById("user-info").textContent = user.email;
    btnLogin.style.display = "none"; btnSignup.style.display = "none";
    emailInput.style.display = "none"; passInput.style.display = "none";
    btnLogout.style.display = "block";
    
    const snap = await get(ref(db, `users/${user.uid}`));
    if (snap.exists() && snap.val().role === "admin") adminLink.style.display = "block";
  } else {
    document.getElementById("auth-title").textContent = "Connexion";
    document.getElementById("user-info").textContent = "";
    btnLogin.style.display = "inline-block"; btnSignup.style.display = "inline-block";
    emailInput.style.display = "inline-block"; passInput.style.display = "inline-block";
    btnLogout.style.display = "none"; adminLink.style.display = "none";
  }
});

// --- CAPTEURS ET RELAIS ---
onValue(ref(db, "capteurs/exterieur/temperature"), s => document.getElementById("temp-ext").textContent = s.val());
onValue(ref(db, "capteurs/exterieur/humidite"), s => document.getElementById("hum-ext").textContent = s.val());
onValue(ref(db, "capteurs/interieur/temperature"), s => document.getElementById("temp-int").textContent = s.val());
onValue(ref(db, "capteurs/interieur/humidite"), s => document.getElementById("hum-int").textContent = s.val());

onValue(ref(db, "commande/lampe"), s => {
  btnLampe.textContent = s.val() ? "Éteindre" : "Allumer";
});
btnLampe.addEventListener("click", async () => {
  const s = await get(ref(db, "commande/lampe"));
  set(ref(db, "commande/lampe"), !s.val());
});

onValue(ref(db, "ui/mode"), s => {
  const m = s.val() || "jour";
  document.body.className = m;
  modeBtn.textContent = m === "jour" ? "Mode Nuit" : "Mode Jour";
});
modeBtn.addEventListener("click", async () => {
  const s = await get(ref(db, "ui/mode"));
  set(ref(db, "ui/mode"), s.val() === "jour" ? "nuit" : "jour");
});
