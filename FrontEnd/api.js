// api.js : Ce fichier contient les appels API

const BASE_API_URL = "http://localhost:5678/api";

async function getWorks() {
  try {
    const response = await fetch(`${BASE_API_URL}/works`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Impossible de récupérer les œuvres.");
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres :", error);
    throw error;
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${BASE_API_URL}/categories`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Impossible de récupérer les catégories.");
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    throw error;
  }
}

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
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        return data.token;
      }
    }
    throw new Error("Erreur dans l'identifiant ou le mot de passe.");
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    throw error;
  }
}

async function deleteWork(id, authToken) {
  try {
    const response = await fetch(`${BASE_API_URL}/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.ok) {
      return true;
    }
    throw new Error("Impossible de supprimer l'œuvre.");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre :", error);
    throw error;
  }
}

async function addWork(formData, authToken) {
  try {
    const response = await fetch(`${BASE_API_URL}/works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      return true;
    }
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Une erreur est survenue lors de l'ajout de l'œuvre."
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'œuvre :", error);
    throw error;
  }
}

export { getWorks, getCategories, loginUser, deleteWork, addWork };
