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
    // Afficher le conteneur modal //
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "flex";

    displayWorksInContainerGalery();
});

const modify2 = document.getElementById("modify_2");
modify2.addEventListener("click", () => {
    // Afficher le conteneur modal //
    const modalContainer = document.querySelector(".container_modal");
    modalContainer.style.display = "flex";

    displayWorksInContainerGalery();
});

// Evenement lors de la fermeture de modale //
const closeModalButton = document.querySelector(".fa-xmark");
closeModalButton.addEventListener("click", () => {
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

        trash.dataset.id = project.id;

        trash.classList.add("fa-solid", "fa-trash-can");
        figure.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">`;
        figure.appendChild(span);
        span.appendChild(trash);
        containerGalery.appendChild(figure);
    });

    // Evénement container_galery //
    containerGalery.addEventListener("click", (e) => {
        const trash = e.target.closest(".fa-trash-can");
        if (trash) {
            const id = trash.dataset.id;
            deleteWork(id, e);
        }
    });
}

// Modifier la fonction deleteWork pour utiliser l'ID du projet
function deleteWork(id) {
    const token = localStorage.getItem("token");

    const init = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    fetch(`http://localhost:5678/api/works/${id}`, init);
    async (response) => {
        if (response.ok) {
            const data = await response.json();

            displayWorks();
            displayProjectAndCategories();
        }
    };
}

// Sélection de l'élément bouton "Ajouter une photo"
const addButton = document.querySelector(".container_modal button");

// Sélection de l'élément "container_modal"
const modalContainer = document.querySelector(".container_modal");

// Sélection de l'élément "modale_send_work"
const sendWorkModal = document.querySelector(".modale_send_work");

// Ajout d'un écouteur d'événements au clic sur le bouton
addButton.addEventListener("click", () => {
    // Masquer la modale container_modal
    modalContainer.style.display = "none";

    // Afficher la modale modale_send_work
    sendWorkModal.style.display = "flex";
});

// Sélection de l'icône "fa-xmark"
const closeModalIcon = document.querySelector(".contain_form_modale .fa-xmark");

// Ajout d'un écouteur d'événements au clic sur l'icône "fa-xmark"
closeModalIcon.addEventListener("click", () => {
    // Masquer la modale modale_send_work
    sendWorkModal.style.display = "none";
});

// Sélectionner l'icône de flèche gauche
const arrowLeftIcon = document.querySelector(".fa-solid.fa-arrow-left");

// Ajouter un gestionnaire d'événements pour le clic sur l'icône de flèche gauche
arrowLeftIcon.addEventListener("click", () => {
    // Rendre la modale d'envoi de travail invisible
    const modaleSendWork = document.querySelector(".modale_send_work");
    modaleSendWork.style.display = "none";

    // Rendre la modale principale visible
    const containerModal = document.querySelector(".container_modal");
    containerModal.style.display = "flex";
});

// Sélection du bouton "+ Ajouter photo"
const addPhotoButton = document.querySelector(".contain_btn_add_img button");

// Ajout d'un écouteur d'événements au clic sur le bouton "+ Ajouter photo"
addPhotoButton.addEventListener("click", () => {
    // Ouverture de la fenêtre de sélection de fichiers
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png"; // Définir les types de fichiers acceptés
    fileInput.onchange = () => handleFileSelection(fileInput.files[0]);
    fileInput.click();
});

// Gestion de la sélection de fichier
function handleFileSelection(file) {
    const containerImgImport = document.querySelector(".container_img_import");
    const errorMessage = document.querySelector(".btn_post_img + p.error");
    const addPhotoButton = document.querySelector(
        ".contain_btn_add_img button"
    );

    if (file) {
        // Vérification de la taille du fichier
        if (
            file.size > 4 * 1024 * 1024 ||
            (file.type !== "image/jpeg" && file.type !== "image/png")
        ) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Format ou taille du fichier incorrect.";
            addPhotoButton.style.display = "none";
            return;
        }

        // Affichage de l'aperçu de l'image sélectionnée
        const reader = new FileReader();
        reader.onload = (e) => {
            containerImgImport.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            errorMessage.style.display = "none";
            // Masquer le bouton "Ajouter photo"
            addPhotoButton.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
}

// Sélectionnez le bouton "Valider"
const submitButton = document.querySelector(".btn_post_img");

// Ajoutez un gestionnaire d'événements pour le clic sur le bouton "Valider"
submitButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Récupérez les données du formulaire
    const titre = document.getElementById("titre").value;
    const categorie = document.getElementById("categorie").value;
    const image = document.getElementById("image").files[0]; // Récupérez le fichier image

    // Vérifiez si tous les champs sont remplis
    if (!titre || !categorie || !image) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Créez un objet FormData
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("categorie", categorie);
    formData.append("image", image);

    // Envoyez une requête POST à votre API avec les données du formulaire
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`, // Assurez-vous d'avoir le jeton d'authentification si nécessaire
        },
    });

    // Si la requête est réussie, récupérez les données des projets mises à jour
    const updatedWorks = await response.json();

    // Mettez à jour l'affichage des projets avec les données mises à jour
    displayWorks(updatedWorks);
});

// Chargement des catégories
async function loadCategories() {
    const categoriesSelect = document.getElementById("categorie");
    categoriesSelect.innerHTML = ""; // Effacer les options existantes

    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categoriesSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// Appeler la fonction pour charger les catégories
loadCategories();
