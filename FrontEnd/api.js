const BASE_API_URL = "http://localhost:5678/api";

async function getWorks() {
  const response = await fetch(`${BASE_API_URL}/works`);
  const dataWorks = await response.json();
  return dataWorks;
}

async function displayWorks() {
  const works = await getWorks();
  const galleryDiv = document.querySelector(".gallery");

  works.forEach((work) => {
    const workElement = document.createElement("div");
    workElement.classList.add("work-item");
    workElement.innerHTML = `
      <img src="${work.imageUrl}">
      <p>${work.title}</p>
    `;
    galleryDiv.appendChild(workElement);
  });
}

displayWorks();
