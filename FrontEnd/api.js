// api.js : Ce fichier contient les appels API

// Définition de la constante BASE_API_URL
const BASE_API_URL = "http://localhost:5678/api";

// Fonction pour obtenir les œuvres depuis l'API
async function getWorks() {
  const response = await fetch(`${BASE_API_URL}/works`);
  const dataWorks = await response.json();
  return dataWorks;
}

// Fonction pour obtenir les catégories depuis l'API
async function getCategories() {
  const response = await fetch(`${BASE_API_URL}/categories`);
  const categories = await response.json();
  return categories;
}

// Fonction pour effectuer la connexion de l'utilisateur
async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token;
      localStorage.setItem("authToken", token);
      return { success: true };
    } else {
      return {
        success: false,
        message: "Erreur dans l'identifiant ou le mot de passe.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Une erreur s'est produite lors de la connexion.",
    };
  }
}

// Fonction pour supprimer une œuvre par son ID
async function deleteWork(id, authToken) {
  const response = await fetch(`${BASE_API_URL}/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    return true; // La suppression a réussi
  } else {
    return false; // La suppression a échoué
  }
}

// Export des fonctions et de la constante
export { BASE_API_URL, getWorks, getCategories, loginUser, deleteWork };
