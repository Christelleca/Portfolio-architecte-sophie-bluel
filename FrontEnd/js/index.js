// Déclaration des variables globales
let worksData;
let categoriesData;
const portFolio = document.getElementById("portfolio");

// Fonction asynchrone pour récupérer les données depuis l'API
async function fetchData(apiEndpoint, setData) {
    const response = await fetch(`http://localhost:5678/api/${apiEndpoint}`);
    const data = await response.json();
    setData(data);
    return data;
}

// Fonction pour afficher les projets
function displayWorks(projects = worksData) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    projects.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}"><figcaption>${project.title}</figcaption>`;
        gallery.appendChild(figure);
    });
}

// Fonction pour afficher les catégories et les projets
function displayProjectAndCategories() {
    const filterSection = document.getElementById("filter-section");
    filterSection.innerHTML = "";

    const buttonAll = createCategoryButton("Tous", () => displayWorks(), true);
    filterSection.appendChild(buttonAll);

    categoriesData.forEach((category) => {
        const buttonCategory = createCategoryButton(category.name, () => {
            const filterWorks = worksData.filter(
                (work) => work.category.name === category.name
            );
            displayWorks(filterWorks);
        });
        filterSection.appendChild(buttonCategory);
    });

    displayWorks();
}

// Fonction pour créer un bouton de catégorie
function createCategoryButton(name, clickHandler, isSelected = false) {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("button_category", isSelected && "filter_selected");

    button.addEventListener("click", () => {
        clickHandler();
        setActiveButton(button);
    });

    return button;
}

// Fonction pour définir un bouton comme actif et désactiver les autres
function setActiveButton(activeButton) {
    const categoryButtons = document.querySelectorAll(".button_category");
    categoryButtons.forEach((button) =>
        button.classList.toggle("filter_selected", button === activeButton)
    );
}

// Fonction principale pour récupérer les données et initialiser l'affichage
async function init() {
    worksData = await fetchData("works", (data) => (worksData = data));
    categoriesData = await fetchData(
        "categories",
        (data) => (categoriesData = data)
    );
    displayProjectAndCategories();
}

// Appel initial pour récupérer les données et initialiser l'affichage
init();
