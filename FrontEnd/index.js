// index.js : Ce fichier gère l'affichage des œuvres et des filtres par catégorie et la modal

// Importez les fonctions et la constante depuis api.js
import { getWorks, getCategories, deleteWork } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.querySelector("#login-link");
  const authToken = localStorage.getItem("authToken");
  const portfolioSection = document.getElementById("portfolio");
  const siteOptions = document.querySelector("#options-bar");
  const modifyButton = portfolioSection.querySelector(".modify-button");
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
    // Si l'utilisateur est connecté, masquer les boutons de filtre
    if (authToken) {
      filtersDiv.style.display = "none";
    }
    // Attacher filtersDiv à la section du portfolio
    const galleryDiv = portfolioSection.querySelector(".gallery");
    portfolioSection.insertBefore(filtersDiv, galleryDiv);
  }
  await setupPage();
  await displayWorks();
  // Gérer le clic sur le bouton "Login" / "Logout"
  loginButton.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // Vérifier si l'utilisateur est connecté (a un token d'authentification)
  if (authToken) {
    // L'utilisateur est connecté, afficher le bouton "Logout" et la barre d'options,
    loginButton.textContent = "Logout";
    siteOptions.style.display = "block";
    // Vérifier si le bouton "Modifier" est déjà présent
    if (modifyButton) {
      modifyButton.style.display = "block"; // Afficher le bouton "Modifier"
    }
  } else {
    // L'utilisateur n'est pas connecté, afficher le bouton "Login" et masquer la barre d'options
    loginButton.textContent = "Login"; // Remettre le texte à "Login"
    siteOptions.style.display = "none";
    // Vérifier si le bouton "Modifier" est déjà présent
    if (modifyButton) {
      modifyButton.style.display = "none"; // Masquer le bouton "Modifier"
    }
  }

  // Gérer le clic sur le bouton "Login" / "Logout"
  loginButton.addEventListener("click", () => {
    if (authToken) {
      // Si l'utilisateur est connecté (a un token), alors il clique pour se déconnecter
      localStorage.removeItem("authToken");
      // Rediriger vers la page de connexion
      window.location.href = "index.html";
    } else {
      // Sinon, l'utilisateur clique pour se connecter
      // Rediriger vers la page de connexion
      window.location.href = "login.html";
    }
  });

  // Modal
  const modal = document.getElementById("myModal");
  // Gérez le clic sur le bouton "éditer"
  modifyButton.addEventListener("click", async () => {
    // Affichez la modal
    modal.style.display = "block";
    // Appelez la fonction pour afficher les photos
    await displayWorksInModal();
  });
  // Sélectionnez le bouton "x" pour fermer la modal
  const closeButton = modal.querySelector(".close");
  // Gérez le clic sur le bouton "x"
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
  // Gérez le clic en dehors du contenu de la modal pour la fermer
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Sélectionnez l'élément qui contiendra les miniatures de la galerie de photos
  const galleryContainer = modal.querySelector(".gallery-container");

  async function displayWorksInModal() {
    // Récupérez la liste de toutes les photos depuis l'API
    const works = await getWorks();

    // Effacez le contenu actuel de la galerie
    galleryContainer.innerHTML = "";

    works.forEach((work) => {
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("thumbnail");

      // Créez un conteneur pour le texte "Éditer"
      const editContainer = document.createElement("div");
      editContainer.classList.add("edit-container");

      // Ajoutez le texte "Éditer" au conteneur
      const editSpan = document.createElement("span");
      editSpan.textContent = "éditer";
      editContainer.appendChild(editSpan);

      // Ajoutez l'image en miniature
      const img = document.createElement("img");
      img.src = work.imageUrl;

      // Ajoutez le conteneur du texte "Éditer" sous l'image
      thumbnail.appendChild(img);
      thumbnail.appendChild(editContainer);

      // Créez le bouton de suppression avec l'icône de la poubelle
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");

      // Créez l'icône de la poubelle et définissez ses styles
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can");
      trashIcon.style.color = "#fffef8";

      // Ajoutez l'icône de la poubelle au bouton de suppression
      deleteButton.appendChild(trashIcon);
      deleteButton.setAttribute("data-work-id", work.id);

      // Ajoutez le bouton de suppression à la miniature
      thumbnail.appendChild(deleteButton);

      // Ajoutez la miniature à la galerie
      galleryContainer.appendChild(thumbnail);
      // Gérez le clic sur le bouton supprimer img
      deleteButton.addEventListener("click", async (event) => {
        // Empêchez le comportement par défaut du bouton (rechargement de la page)
        event.preventDefault();
        event.stopPropagation();

        const response = await deleteWork(work.id, authToken);
        if (response) {
          // Supprimez l'élément du DOM après la suppression réussie
          const thumbnailToDelete = document.querySelector(
            `.thumbnail[data-work-id="${work.id}"]`
          );
          if (thumbnailToDelete) {
            thumbnailToDelete.remove(); // Masquez la miniature
          }
          // Mise à jour du contenu de la modal sans la fermer
          await displayWorksInModal();
          await displayWorks();
        }
      });
    });
  }
});
