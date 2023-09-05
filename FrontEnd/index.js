// index.js : Ce fichier gère l'affichage des œuvres et des filtres par catégorie et la modal

// Importez les fonctions et la constante depuis api.js
import { BASE_API_URL, getWorks, getCategories } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.querySelector("#login-link");
  // Code pour afficher les œuvres et gérer les filtres par catégorie
  let selectedCategory = null; // Initialement aucune catégorie sélectionnée

  async function displayWorks() {
    // Récupérer la liste des œuvres depuis l'API
    const works = await getWorks();
    const galleryDiv = document.querySelector(".gallery");
    // Vider le contenu actuel de la galerie
    galleryDiv.innerHTML = "";

    // Filtrer les œuvres en fonction de la catégorie sélectionnée ou afficher toutes les œuvres
    works
      .filter(
        (work) =>
          selectedCategory === null ||
          selectedCategory === "Tous" ||
          work.categoryId === selectedCategory
      )
      .forEach((work) => {
        const workElement = document.createElement("div");
        workElement.classList.add("work-item");
        workElement.innerHTML = `
          <img src="${work.imageUrl}">
          <p>${work.title}</p>
        `;
        // Ajouter l'élément à la galerie
        galleryDiv.appendChild(workElement);
      });
  }

  async function displayCategories() {
    // Récupérer la liste des catégories depuis l'API
    const categories = await getCategories();
    const filtersDiv = document.createElement("div");
    filtersDiv.classList.add("filters");

    // Créer un bouton "Tous" pour afficher toutes les œuvres
    const filterButtonAll = document.createElement("button");
    filterButtonAll.textContent = "Tous";
    filterButtonAll.addEventListener("click", async () => {
      selectedCategory = "Tous";
      await displayWorks();
    });
    filtersDiv.appendChild(filterButtonAll);

    // Parcourir chaque catégorie et créer un bouton pour chaque catégorie
    categories.forEach((category) => {
      const filterButton = document.createElement("button");
      filterButton.textContent = category.name;
      filterButton.addEventListener("click", async () => {
        selectedCategory = category.id;
        await displayWorks();
      });
      filtersDiv.appendChild(filterButton);
    });

    // Renvoyer l'élément div contenant les boutons de filtre de catégorie
    return filtersDiv;
  }
  async function setupPage() {
    const filtersDiv = await displayCategories();
    // Attacher filtersDiv à la section du portfolio
    const portfolioSection = document.getElementById("portfolio");
    const galleryDiv = portfolioSection.querySelector(".gallery");
    portfolioSection.insertBefore(filtersDiv, galleryDiv);
  }
  await setupPage();
  await displayWorks();
  // Gérer le clic sur le bouton "Login" / "Logout"
  loginButton.addEventListener("click", () => {
    window.location.href = "login.html";
  });
});
