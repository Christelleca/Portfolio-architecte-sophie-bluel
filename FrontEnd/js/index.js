// variables //

let worksData;
let categoriesData;

// Fonction asynchrone pour récupérer les catégories//
async function fetchCategory() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    categoriesData = categories;
    return categories;
}

// Fonction asynchrone pour récupérer les projets //
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    worksData = works;
    return works;
}

// Fonction asynchrone pour attendre la récupération des données //
async function fetchData() {
    const [works, categories] = await Promise.all([
        fetchWorks(),
        fetchCategory(),
    ]);
    displayProjectAndCategories(categories, works);
}

// Fonction pour afficher les projets //
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

// Fonction pour afficher les catégories et les projets //
function displayProjectAndCategories(categories, works) {
    const filterSection = document.getElementById("filter-section");

    // Ajout du bouton "Tous" avec la classe "filter_selected" par défaut //
    const buttonAll = createCategoryButton("Tous", () => displayWorks(), true);
    filterSection.appendChild(buttonAll);

    // Ajout des boutons de catégorie dynamiquement //
    categories.forEach((category) => {
        const buttonCategory = createCategoryButton(category.name, () => {
            const filterWorks = works.filter(
                (work) => work.category.name === category.name
            );
            displayWorks(filterWorks);
        });
        filterSection.appendChild(buttonCategory);
    });

    // Affichage de tous les projets par défaut //
    displayWorks();
}

// Fonction pour créer un bouton de catégorie //
function createCategoryButton(name, clickHandler, isSelected = false) {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("button_category");

    if (isSelected) {
        button.classList.add("filter_selected");
    }

    button.addEventListener("click", () => {
        clickHandler();
        setActiveButton(button);
    });

    return button;
}

function setActiveButton(activeButton) {
    const categoryButtons = document.querySelectorAll(".button_category");

    categoryButtons.forEach((button) => {
        button.classList.remove("filter_selected");
    });

    activeButton.classList.add("filter_selected");
}

//..
//..
//..             Modale et connexion
//..
// Fonction asynchrone pour gérer la connexion//
async function handleLogin() {
    const storedToken = localStorage.getItem("token");

    // Si l'utilisateur est connecté //
    if (storedToken) {
        const loginLink = document.getElementById("get_loged");
        loginLink.style.display = "none";

        const logoutLink = document.getElementById("logout");
        logoutLink.style.display = "block";

        const modifyButton = document.querySelector(".modify");
        modifyButton.style.display = "block";

        // Récupérer et afficher les projets après connexion //
        const works = await fetchWorks();
        displayWorks(works);
    } else {
        // Si l'utilisateur n'est pas connecté //
        const loginLink = document.getElementById("get_loged");
        loginLink.style.display = "block";

        const logoutLink = document.getElementById("logout");
        logoutLink.style.display = "none";

        const modifyButton = document.querySelector(".modify");
        modifyButton.style.display = "none";

        fetchData();
    }
}

// Fonction pour gérer la déconnexion //
function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}

handleLogin();

// Evenement lors de la déconnexion //
const logoutLink = document.getElementById("logout");
logoutLink.addEventListener("click", handleLogout);

// Bouton de modification //
const modifyButton = document.querySelector(".modify");
modifyButton.addEventListener("click", () => {
    // Afficher le conteneur modal //
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "flex";

    // Afficher les projets dans la modal//
    displayWorksInModal();
});

// Evenement lors de la fermeture de modale //
const closeModalButton = document.querySelector(".fa-xmark");
closeModalButton.addEventListener("click", () => {
    // Cacher le conteneur modal
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "none";
});

// Fonction pour afficher les images des projets dans modal //
function displayWorksInModal(projects = worksData) {
    const modalGallery = document.querySelector(".modale");
    modalGallery.innerHTML = "";

    projects.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        `;
        modalGallery.appendChild(figure);
    });
}
