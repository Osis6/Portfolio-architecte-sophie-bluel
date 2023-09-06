// login.js : Ce fichier gère la logique de connexion

// Importez les fonctions et la constante depuis api.js
import { loginUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // Sélectionnez le formulaire de connexion
  const loginForm = document.querySelector("#login form");
  // Sélectionnez les éléments d'erreur
  const errorMessage = document.querySelector(".error-message");
  const errorText = document.querySelector(".error-text");
  // Sélectionnez le bouton pour fermer la popup d'erreur
  const closeErrorPopup = document.querySelector("#closeErrorPopup");

  // Écoutez l'événement de soumission du formulaire de connexion
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupérez l'email et le mot de passe saisis par l'utilisateur
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Utilisez la nouvelle fonction loginUser pour effectuer la connexion
    const loginResult = await loginUser(email, password);

    if (loginResult.success) {
      window.location.href = "index.html";
    } else {
      errorText.textContent = loginResult.message;
      errorMessage.style.display = "flex";
    }
  });

  // Écoutez l'événement de clic sur le bouton pour fermer la pop-up d'erreur
  closeErrorPopup.addEventListener("click", () => {
    errorMessage.style.display = "none";
  });
});
