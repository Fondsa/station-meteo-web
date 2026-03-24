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

// --- LOGIQUE AUTHENTIFICATION ---
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const btnLogout = document.getElementById("btn-logout");
const userInfo = document.getElementById("user-info");
const adminLink = document.getElementById("admin-link");

// Connexion
btnLogin.onclick = () => {
  signInWithEmailAndPassword(auth, emailInput.value, passInput.value).catch(err => alert(err.message));
};

// Inscription (crée aussi le profil dans la DB avec role user)
btnSignup.onclick = async () => {
  try {
    const res = await createUserWithEmailAndPassword(auth, emailInput.value, passInput.value);
    await set(ref(db, 'users/' + res.user.uid), {
      email: emailInput.value,
      role: "user"
    });
    alert("Compte créé !");
  } catch (err) { alert(err.message); }
};

// Déconnexion
btnLogout.onclick = () => signOut(auth);

// Surveillance de l'état de connexion
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userInfo.textContent = "Connecté : " + user.email;
    btnLogin.style.display = "none";
    btnSignup.style.display = "none";
    emailInput.style.display = "none";
    passInput.style.display = "none";
    btnLogout.style.display = "inline-block";

    // Vérifier si Admin
    const snap = await get(ref(db, `users/${user.uid}`));
    if (snap.exists() && snap.val().role === "admin") {
      adminLink.style.display = "block";
    }
  } else {
    userInfo.textContent = "Non connecté";
    btnLogin.style.display = "inline-block";
    btnSignup.style.display = "inline-block";
    emailInput.style.display = "inline-block";
    passInput.style.display = "inline-block";
    btnLogout.style.display = "none";
    adminLink.style.display = "none";
  }
});

// --- LOGIQUE CAPTEURS & RELAIS (Ton code existant adapté) ---
onValue(ref(db, "capteurs/exterieur/temperature"), snap => document.getElementById("temp-ext").textContent = snap.val() ?? "--");
onValue(ref(db, "capteurs/exterieur/humidite"), snap => document.getElementById("hum-ext").textContent = snap.val() ?? "--");
onValue(ref(db, "capteurs/interieur/temperature"), snap => document.getElementById("temp-int").textContent = snap.val() ?? "--");
onValue(ref(db, "capteurs/interieur/humidite"), snap => document.getElementById("hum-int").textContent = snap.val() ?? "--");

const btnLampe = document.getElementById("btn-lampe");
onValue(ref(db, "commande/lampe"), snap => {
  btnLampe.textContent = snap.val() ? "Éteindre Lampe" : "Allumer Lampe";
});
btnLampe.onclick = async () => {
  const snap = await get(ref(db, "commande/lampe"));
  set(ref(db, "commande/lampe"), !snap.val());
};

const modeBtn = document.getElementById("mode-btn");
onValue(ref(db, "ui/mode"), snap => {
  const mode = snap.val() || "jour";
  document.body.className = mode;
  modeBtn.textContent = mode === "jour" ? "Mode Nuit" : "Mode Jour";
});
modeBtn.onclick = async () => {
  const snap = await get(ref(db, "ui/mode"));
  const newMode = (snap.val() === "jour") ? "nuit" : "jour";
  set(ref(db, "ui/mode"), newMode);
};
