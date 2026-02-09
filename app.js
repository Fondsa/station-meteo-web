// CONFIG FIREBASE (à remplir plus tard)
const firebaseConfig = {
  apiKey: "A_REMPLACER",
  authDomain: "A_REMPLACER",
  databaseURL: "A_REMPLACER",
  projectId: "A_REMPLACER",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// Références BDD
const tempExtRef = db.ref("capteurs/exterieur/temperature");
const tempIntRef = db.ref("capteurs/interieur/temperature");
const lampeRef = db.ref("commande/lampe");

// Lecture temps réel
tempExtRef.on("value", snap => {
  document.getElementById("temp-ext").textContent = snap.val();
});

tempIntRef.on("value", snap => {
  document.getElementById("temp-int").textContent = snap.val();
});

// Bouton lampe
const btn = document.getElementById("btn-lampe");

lampeRef.on("value", snap => {
  btn.textContent = snap.val() ? "Éteindre" : "Allumer";
});

btn.addEventListener("click", () => {
  lampeRef.get().then(snap => {
    lampeRef.set(!snap.val());
  });
});
