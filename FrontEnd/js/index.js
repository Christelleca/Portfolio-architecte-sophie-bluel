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

// Sélection de la modale
const modalContainer = document.querySelector(".container_modal");

// Evenement lors de la fermeture de la modale en cliquant sur .fa-xmark ou .container_modal
modalContainer.addEventListener("click", (event) => {
    if (
        event.target.classList.contains("fa-xmark") ||
        event.target === modalContainer
    ) {
        modalContainer.style.display = "none";
    }
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

    // Evénement suppression des projets //
    containerGalery.addEventListener("click", (e) => {
        const trash = e.target.closest(".fa-trash-can");
        if (trash) {
            const id = trash.dataset.id;
            deleteWork(id);
        }
    });
}

// Modifier la fonction deleteWork pour utiliser l'ID du projet

async function deleteWork(id) {
    const token = localStorage.getItem("token");

    const init = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`http://localhost:5678/api/works/${id}`, init);
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression du work");
    }

    const figureToDelete = document.querySelector(`.gallery [data-id="${id}"]`);
    if (figureToDelete) {
        figureToDelete.remove();
    }

    const modalWorkToDelete = document.querySelector(
        `.modale_send_work [data-id="${id}"]`
    );
    if (modalWorkToDelete) {
        modalWorkToDelete.remove();
    }

    const updatedWorks = await fetchWorks();
    displayWorksInContainerGalery(updatedWorks);
    displayWorks(updatedWorks);
}

// Variable des éléments d'ajout des nouveaux projets
const addButton = document.querySelector(".container_modal button");
const sendWorkModal = document.querySelector(".modale_send_work");
const arrowLeftIcon = document.querySelector(".fa-solid.fa-arrow-left");
const submitButton = document.querySelector(".btn_post_img");
const errorMessage = document.querySelector(".error_data");

// Ecouteur d'événements au clic sur le bouton "ajouter une photo"
addButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
    sendWorkModal.style.display = "flex";
});

// Sélection de l'icône "fa-xmark" de la modale d'envoi de travail
const closeModalIcon = document.querySelector(".contain_form_modale .fa-xmark");

// Ecouteur d'événements pour la modale d'envoi de travail
sendWorkModal.addEventListener("click", (event) => {
    if (event.target === closeModalIcon || event.target === sendWorkModal) {
        sendWorkModal.style.display = "none";
    }
});

// Evénements pour le clic sur l'icône de flèche gauche
arrowLeftIcon.addEventListener("click", () => {
    const modaleSendWork = document.querySelector(".modale_send_work");
    modaleSendWork.style.display = "none";
    const containerModal = document.querySelector(".container_modal");
    containerModal.style.display = "flex";
});

// Fonction pour envoyer l'image sélectionnée
async function uploadImage(file) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'image.");
    }
    const imageData = await response.json();
    return imageData.url;
}

// Gestion de la sélection de fichier
async function handleFileSelection(event) {
    const file = event.target.files[0];

    if (file) {
        // Vérification de la taille du fichier
        if (
            file.size > 4 * 1024 * 1024 ||
            (file.type !== "image/jpeg" && file.type !== "image/png")
        ) {
            errorMessage.textContent = "Format ou taille du fichier incorrect.";
            return;
        }

        // Envoyer l'image et obtenir son URL
        try {
            const imageUrl = await uploadImage(file);
            // Affichage de l'image téléchargée
            const imagePreview = document.createElement("img");
            imagePreview.src = imageUrl;
            containerBtnAddImg.innerHTML = "";
            containerBtnAddImg.appendChild(imagePreview);
        } catch (error) {
            errorMessage.textContent = "Format ou taille du fichier incorrect.";
        }
    }
}

// Événement pour le changement de fichier sélectionné
const fileInput = document.getElementById("image");
fileInput.addEventListener("change", function (event) {
    const previewImage = document.querySelector(".contain_btn_add_img img");
    const previewForm = document.querySelector(".form_preview_img");
    const file = event.target.files[0];
    const reader = new FileReader();

    // Événement lorsque la lecture du fichier est terminée
    reader.onload = function () {
        previewImage.src = reader.result;
        previewImage.style.display = "block";
        previewForm.style.display = "none";
        const submitButton = document.querySelector(".btn_post_img");
        submitButton.style.background = "#1D6154";
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        previewImage.src = "#";
        previewImage.style.display = "none";
        previewForm.style.display = "block";
        const submitButton = document.querySelector(".btn_post_img");
        submitButton.style.background = "";
    }
});

// Ajouter un événement pour le clic sur le bouton de validation

submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    // Récupérer les données du formulaire
    const title = document.getElementById("titre").value;
    const category = document.getElementById("categorie").value;
    const imageInput = document.getElementById("image");
    const image = imageInput.files[0];

    // Vérifier si tous les champs sont remplis
    if (!title || !category || !image) {
        errorMessage.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    const request = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    };

    const response = await fetch("http://localhost:5678/api/works", request);

    if (response.ok) {
        document.getElementById("titre").value = "";
        document.getElementById("categorie").value = "";
        imageInput.value = "";

        const updatedWorks = await fetchWorks();
        displayWorks(updatedWorks);

        const previewImage = document.querySelector(".contain_btn_add_img img");
        previewImage.src = "#";
        previewImage.style.display = "none";

        const previewForm = document.querySelector(".form_preview_img");
        previewForm.style.display = "flex";
        submitButton.style.background = "";
    } else {
        alert("Erreur lors de l'ajout du projet.");
    }
});

// Chargement des catégories
async function loadCategories() {
    const categoriesSelect = document.getElementById("categorie");
    categoriesSelect.innerHTML = "";

    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoriesSelect.appendChild(option);
    });
}
loadCategories();
