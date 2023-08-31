const BASE_API_URL = "http://localhost:5678/api";
let selectedCategory = null; // Aucune categorie selectionner

async function getWorks() {
  const response = await fetch(`${BASE_API_URL}/works`);
  const dataWorks = await response.json();
  return dataWorks;
}

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

async function getCategories() {
  const response = await fetch(`${BASE_API_URL}/categories`);
  const categories = await response.json();
  return categories;
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
  const portfolioSection = document.getElementById("portfolio");
  const galleryDiv = portfolioSection.querySelector(".gallery");
  portfolioSection.insertBefore(filtersDiv, galleryDiv);
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayWorks();
  await displayCategories();
});
