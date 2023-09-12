// api.js : Ce fichier contient les appels API

const BASE_API_URL = "http://localhost:5678/api";

async function getWorks() {
  const response = await fetch(`${BASE_API_URL}/works`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Impossible de récupérer les œuvres.");
}

async function getCategories() {
  const response = await fetch(`${BASE_API_URL}/categories`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Impossible de récupérer les catégories.");
}

async function loginUser(email, password) {
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
    throw new Error("Le token n'a pas été renvoyé par le serveur.");
  }
  throw new Error("Erreur dans l'identifiant ou le mot de passe.");
}

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
    return true;
  }
  throw new Error("Impossible de supprimer l'œuvre.");
}

async function addWork(formData, authToken) {
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
}

export {
  BASE_API_URL,
  getWorks,
  getCategories,
  loginUser,
  deleteWork,
  addWork,
};
