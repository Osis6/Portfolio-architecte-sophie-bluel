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

// Export des fonctions et de la constante
export { BASE_API_URL, getWorks, getCategories };
