// login.js : Ce fichier gère la logique de connexion

import { loginUser } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login form");
  const errorContainer = document.querySelector(".error-container");
  const errorText = document.querySelector(".error-text");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const authToken = await loginUser(email, password);
      localStorage.setItem("authToken", authToken);
      window.location.href = "index.html";
    } catch (error) {
      errorText.textContent = error.message;
      errorContainer.style.display = "block";
    }
  });
});
