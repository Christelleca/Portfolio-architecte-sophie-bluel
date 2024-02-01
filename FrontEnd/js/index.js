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
    // variables //
    const loginLink = document.getElementById("get_loged");
    const logoutLink = document.getElementById("logout");
    const modifyButton = document.querySelector(".modify");
    const modify2 = document.getElementById("modify_2");
    const edition = document.querySelector(".edition");

    if (storedToken) {
        loginLink.style.display = "none";

        logoutLink.style.display = "block";

        modifyButton.style.display = "block";

        modify2.style.display = "block";

        edition.style.display = "flex";

        // Récupérer et afficher les projets après connexion //
        const works = await fetchWorks();
        displayWorks(works);
    } else {
        // Si l'utilisateur n'est pas connecté //

        loginLink.style.display = "block";

        logoutLink.style.display = "none";

        modifyButton.style.display = "none";

        modify2.style.display = "none";

        edition.style.display = "none";

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
    // Afficher le conteneur modal
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "flex";

    // Afficher les projets dans le container_galery
    displayWorksInContainerGalery();
});

const modify2 = document.getElementById("modify_2");
modify2.addEventListener("click", () => {
    // Afficher le conteneur modal
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "flex";

    // Afficher les projets dans le container_galery
    displayWorksInContainerGalery();
});

// Evenement lors de la fermeture de modale //
const closeModalButton = document.querySelector(".fa-xmark");
closeModalButton.addEventListener("click", () => {
    // Cacher le conteneur modal
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "none";
});

// Fonction pour afficher les images des projets dans le container_galery
function displayWorksInContainerGalery(projects = worksData) {
    const containerGalery = document.querySelector(".container_galery");
    containerGalery.innerHTML = "";

    projects.forEach((project) => {
        const figure = document.createElement("figure");
        const span = document.createElement("span");
        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        figure.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">`;
        figure.appendChild(span); // Ajoutez le span à la figure
        span.appendChild(trash); // Ajoutez l'icône de la poubelle au span
        containerGalery.appendChild(figure);
    });

    // Ajouter un événement de délégation au parent container_galery
    containerGalery.addEventListener("click", (e) => {
        const trash = e.target.closest(".fa-trash-can");
        if (trash) {
            const id = trash.dataset.id; // Utiliser dataset pour obtenir l'ID stocké dans l'attribut data-id
            deleteWork(id);
        }
    });
}

// Suppression des projets de la modale
// Suppression des projets de la modale
function deleteWork() {
    const trashAll = document.querySelectorAll(".fa-trash-can");
    trashAll.forEach((trash) => {
        trash.addEventListener("click", (e) => {
            const id = 1; // Remplacez 1 par l'ID du projet que vous souhaitez supprimer
            const token = localStorage.getItem("token");

            if (!token) {
                console.error(
                    "Token non trouvé. L'utilisateur n'est probablement pas connecté."
                );
                return;
            }

            const init = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            fetch(`http://localhost:5678/api/works/${id}`, init)
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Suppression réussie:", data);
                        displayWorks();
                        displayProjectAndCategories();
                    } else {
                        const errorMessage = await response.text();
                        throw new Error(
                            `La suppression du projet a échoué. Erreur: ${errorMessage}`
                        );
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                });
        });
    });
}
