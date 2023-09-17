// index.js : Ce fichier gère l'affichage des œuvres et des filtres par catégorie et la modal

import { getWorks, getCategories, deleteWork, addWork } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.querySelector("#login-link");
  const portfolioSection = document.getElementById("portfolio");
  const siteOptions = document.querySelector("#options-bar");
  const modifyButton = portfolioSection.querySelector(".modify-button");
  const authToken = localStorage.getItem("authToken");

  let selectedCategory = null;

  async function displayWorks() {
    const works = await getWorks();
    const galleryDiv = document.querySelector(".gallery");
    galleryDiv.innerHTML = "";

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
        galleryDiv.appendChild(workElement);
      });
  }

  async function displayCategories() {
    const categories = await getCategories();
    const filtersDiv = document.createElement("div");
    filtersDiv.classList.add("filters");

    const filterButtonAll = document.createElement("button");
    filterButtonAll.textContent = "Tous";
    filterButtonAll.addEventListener("click", async () => {
      selectedCategory = "Tous";
      await displayWorks();
    });
    filtersDiv.appendChild(filterButtonAll);

    categories.forEach((category) => {
      const filterButton = document.createElement("button");
      filterButton.textContent = category.name;
      filterButton.addEventListener("click", async () => {
        selectedCategory = category.id;
        await displayWorks();
      });
      filtersDiv.appendChild(filterButton);
    });
    return filtersDiv;
  }
  async function setupPage() {
    const filtersDiv = await displayCategories();
    if (authToken) {
      filtersDiv.style.display = "none";
    }
    const galleryDiv = portfolioSection.querySelector(".gallery");
    portfolioSection.insertBefore(filtersDiv, galleryDiv);
  }
  await setupPage();
  await displayWorks();

  loginButton.addEventListener("click", () => {
    window.location.href = "login.html";
  });
  if (authToken) {
    loginButton.textContent = "Logout";
    siteOptions.style.display = "block";
    if (modifyButton) {
      modifyButton.style.display = "block";
    }
  } else {
    loginButton.textContent = "Login";
    siteOptions.style.display = "none";
    if (modifyButton) {
      modifyButton.style.display = "none";
    }
  }

  loginButton.addEventListener("click", () => {
    if (authToken) {
      localStorage.removeItem("authToken");
      window.location.href = "index.html";
    } else {
      window.location.href = "login.html";
    }
  });

  // Modal
  const modal = document.getElementById("myModal");
  modifyButton.addEventListener("click", async () => {
    modal.style.display = "block";
    await displayWorksInModal();
  });
  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    initialState.style.display = "block";
    addPhotoState.style.display = "none";
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      initialState.style.display = "block";
      addPhotoState.style.display = "none";
    }
  });

  const galleryContainer = modal.querySelector(".gallery-container");

  async function displayWorksInModal() {
    const works = await getWorks();
    galleryContainer.innerHTML = "";
    works.forEach((work) => {
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("thumbnail");
      const editContainer = document.createElement("div");
      editContainer.classList.add("edit-container");
      const editSpan = document.createElement("span");
      editSpan.textContent = "éditer";
      editContainer.appendChild(editSpan);
      const img = document.createElement("img");
      img.src = work.imageUrl;
      thumbnail.appendChild(img);
      thumbnail.appendChild(editContainer);
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");

      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can");
      trashIcon.style.color = "#fffef8";
      deleteButton.appendChild(trashIcon);
      deleteButton.setAttribute("data-work-id", work.id);
      thumbnail.appendChild(deleteButton);
      galleryContainer.appendChild(thumbnail);

      deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const response = await deleteWork(work.id, authToken);
        if (response) {
          const thumbnailToDelete = document.querySelector(
            `.thumbnail[data-work-id="${work.id}"]`
          );
          if (thumbnailToDelete) {
            thumbnailToDelete.remove();
          }
          await displayWorksInModal();
          await displayWorks();
        }
      });
    });
  }

  const initialState = modal.querySelector(".initial-state");
  const addPhotoState = modal.querySelector(".add-photo-state");
  const addPhotoButton = modal.querySelector("#addPhotoButton");
  const backToInitialStateButton = modal.querySelector(
    "#backToInitialStateButton"
  );
  addPhotoButton.addEventListener("click", () => {
    initialState.style.display = "none";
    addPhotoState.style.display = "block";
  });
  backToInitialStateButton.addEventListener("click", async () => {
    addPhotoState.style.display = "none";
    initialState.style.display = "block";
    await displayWorksInModal();
  });

  const photoUpload = document.getElementById("photoUpload");
  const photoTitle = document.getElementById("photoTitle");
  const photoCategory = document.getElementById("photoCategory");
  const uploadPhotoButton = document.getElementById("uploadPhotoButton");
  const addPhotoContainer = document.querySelector(".add-photo-container");
  const uploadPhotoForm = document.getElementById("uploadPhoto");

  const categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    photoCategory.appendChild(option);
  });

  photoUpload.addEventListener("change", () => {
    const selectedImage = photoUpload.files[0];
    if (selectedImage) {
      const hiddenElements = document.querySelectorAll(".hidden");
      hiddenElements.forEach((element) => {
        element.style.display = "none";
      });

      const imagePreview = document.createElement("img");
      imagePreview.src = URL.createObjectURL(selectedImage);
      imagePreview.style.width = "25%";
      imagePreview.style.height = "100%";
      imagePreview.style.objectFit = "cover";

      addPhotoContainer.appendChild(imagePreview);
    }
    updateUploadButtonState();
  });

  document
    .getElementById("backToInitialStateButton")
    .addEventListener("click", () => {
      const imagePreview = addPhotoContainer.querySelector("img");
      if (imagePreview) {
        addPhotoContainer.removeChild(imagePreview);
      }
      const hiddenElements = document.querySelectorAll(".hidden");
      hiddenElements.forEach((element) => {
        element.style.display = "inline-block";
      });
      photoUpload.value = "";
      updateUploadButtonState();
    });

  photoTitle.addEventListener("input", () => {
    updateUploadButtonState();
  });

  photoCategory.addEventListener("change", () => {
    updateUploadButtonState();
  });

  function updateUploadButtonState() {
    if (
      photoUpload.files.length > 0 &&
      photoTitle.value.trim() !== "" &&
      photoCategory.value !== "0"
    ) {
      uploadPhotoButton.removeAttribute("disabled");
      uploadPhotoButton.style.backgroundColor = "#1d6154";
    } else {
      uploadPhotoButton.setAttribute("disabled", true);
      uploadPhotoButton.style.backgroundColor = "#ccc";
    }
  }

  uploadPhotoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("image", photoUpload.files[0]);
    formData.append("title", photoTitle.value);
    formData.append("category", photoCategory.value);

    const success = await addWork(formData, authToken);
    if (success) {
      photoUpload.value = "";
      photoTitle.value = "";
      photoCategory.value = "";
      updateUploadButtonState();

      const imagePreview = document.querySelector(".add-photo-container img");
      if (imagePreview) {
        imagePreview.remove();
      }

      const hiddenElements = document.querySelectorAll(".hidden");
      hiddenElements.forEach((element) => {
        element.style.display = "inline-block";
      });
    }
    await displayWorks();
  });
});
