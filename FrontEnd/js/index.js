// Déclaration de variables globales pour stocker les données des projets et des catégories
let worksData;
let categoriesData;

// Sélection de l'élément du portfolio par son ID
const portFolio = document.getElementById("portfolio");

// Fonction asynchrone pour récupérer les données des catégories depuis l'API
async function fetchCategory() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    categoriesData = categories;
    return categories;
}

// Fonction asynchrone pour récupérer les données des projets depuis l'API
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    worksData = works;
    return works;
}

// Fonction asynchrone pour attendre la récupération des données des catégories et des projets
async function fetchData() {
    const works = await fetchWorks();
    const categories = await fetchCategory();
    // Affichage des projets et des catégories
    displayProjectAndCategories(categories, works);
}

// Fonction pour rafraîchir les projets
function refreshWorks() {
    // Récupération des projets et actualisation de l'affichage
    fetchWorks().then((works) => {
        worksData = works;
        displayWorks();
    });
}

// Appel initial pour récupérer les données et afficher les projets et les catégories
fetchData();

// Fonction pour afficher les images des projets
function displayWorks(projects = worksData) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    projects.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}

// Fonction pour afficher les catégories et les projets
function displayProjectAndCategories() {
    // Sélection de la section des filtres par son ID
    const filterSection = document.getElementById("filter-section");

    // Nettoyage du contenu existant de la section des filtres
    filterSection.innerHTML = "";

    // Création du bouton "Tous" avec la classe "filter_selected" par défaut
    const buttonAll = createCategoryButton("Tous", displayWorks, true);
    filterSection.appendChild(buttonAll);

    // Boucle à travers les catégories pour créer les boutons correspondants
    categoriesData.forEach((category) => {
        const buttonCategory = createCategoryButton(category.name, () => {
            // Filtrer les projets par catégorie et afficher
            const filterWorks = worksData.filter(
                (work) => work.category.name === category.name
            );
            displayWorks(filterWorks);
        });
        filterSection.appendChild(buttonCategory);
    });

    // Insertion de la section des filtres avant le deuxième enfant de portFolio
    const secondChild = portFolio.children[1];
    portFolio.insertBefore(filterSection, secondChild);

    // Affichage de tous les projets par défaut
    displayWorks();
}

// Fonction pour créer un bouton de catégorie
function createCategoryButton(name, clickHandler, isSelected = false) {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("button_category");

    // Ajout de la classe "filter_selected" si le bouton est sélectionné
    if (isSelected) {
        button.classList.add("filter_selected");
    }

    // Ajout du gestionnaire d'événements pour le clic sur le bouton
    button.addEventListener("click", () => {
        // Exécution de la fonction associée au bouton
        clickHandler();
        // Définition du bouton comme actif
        setActiveButton(button);
    });

    return button;
}

// Fonction pour définir un bouton comme actif et désactiver les autres
function setActiveButton(activeButton) {
    // Sélection de tous les boutons de catégorie
    const categoryButtons = document.querySelectorAll(".button_category");

    // Suppression de la classe "filter_selected" de tous les boutons
    categoryButtons.forEach((button) => {
        button.classList.remove("filter_selected");
    });

    // Ajout de la classe "filter_selected" au bouton actif
    activeButton.classList.add("filter_selected");
}
