// index.js

// Charger le fichier JSON
const jsonData = require('./translationTemplateEmaling.json'); 

// Utiliser les données
console.log(jsonData);

// Exemple d'accès aux messages pour la langue avec l'ID 27
const messagesLang27 = jsonData[47]["messages"];
console.log("messagesLang47",messagesLang27["msg5"]); // Affiche "Vous recevez cet e-mail car vous avez récemment effectué un achat sur"
