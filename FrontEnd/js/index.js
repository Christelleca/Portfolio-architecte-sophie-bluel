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

    // Supprimer l'élément du DOM correspondant au work supprimé sur la page d'accueil
    const figureToDelete = document.querySelector(`.gallery [data-id="${id}"]`);
    if (figureToDelete) {
        figureToDelete.remove();
    }

    // Supprimer l'élément du DOM correspondant au work supprimé dans la modale
    const modalWorkToDelete = document.querySelector(
        `.modale_send_work [data-id="${id}"]`
    );
    if (modalWorkToDelete) {
        modalWorkToDelete.remove();
    }

    // Mettre à jour les données des projets
    const updatedWorks = await fetchWorks();
    displayWorksInContainerGalery(updatedWorks);
    displayWorks(updatedWorks);
}

// Variable des éléments d'ajout des nouveaux projets
const addButton = document.querySelector(".container_modal button");
const modalContainer = document.querySelector(".container_modal");
const sendWorkModal = document.querySelector(".modale_send_work");
const arrowLeftIcon = document.querySelector(".fa-solid.fa-arrow-left");
const submitButton = document.querySelector(".btn_post_img");

// Ecouteur d'événements au clic sur le bouton "ajouter une photo"
addButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
    sendWorkModal.style.display = "flex";
});

// Sélection de l'icône "fa-xmark" de la modale formulaire
const closeModalIcon = document.querySelector(".contain_form_modale .fa-xmark");

// Ecouteur d'événements au clic sur l'icône "fa-xmark"
closeModalIcon.addEventListener("click", () => {
    sendWorkModal.style.display = "none";
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
    const token = localStorage.getItem("token"); // Récupérer le jeton d'authentification depuis le stockage local
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`, // Inclure le jeton dans l'en-tête de la requête
            },
        });
        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi de l'image.");
        }
        const imageData = await response.json();
        return imageData.url; // Renvoyer l'URL de l'image téléchargée
    } catch (error) {
        console.error(error);
        throw new Error("Une erreur est survenue lors de l'envoi de l'image.");
    }
}

// Gestion de la sélection de fichier
async function handleFileSelection(event) {
    const file = event.target.files[0];
    const errorMessage = document.querySelector(".error_data");

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
            errorMessage.textContent = error.message;
        }
    }
}

// Sélection de l'élément input de type file
// Événement pour le changement de fichier sélectionné
const fileInput = document.getElementById("image");
fileInput.addEventListener("change", function (event) {
    const previewImage = document.querySelector(".contain_btn_add_img img");
    const previewForm = document.querySelector(".form_preview_img");
    const file = event.target.files[0]; // Récupérer le premier fichier sélectionné
    const reader = new FileReader(); // Créer un objet FileReader

    // Événement lorsque la lecture du fichier est terminée
    reader.onload = function () {
        // Mettre à jour la source de l'image avec les données de l'image chargée
        previewImage.src = reader.result;
        // Afficher l'aperçu de l'image en mettant la balise img en display block
        previewImage.style.display = "block";
        // Masquer le formulaire d'aperçu de l'image
        previewForm.style.display = "none";
        // Modifier le style du bouton de validation
        const submitButton = document.querySelector(".btn_post_img");
        submitButton.style.background = "#1D6154";
    };

    if (file) {
        // Lire le contenu du fichier en tant que URL de données
        reader.readAsDataURL(file);
    } else {
        // Si aucun fichier n'est sélectionné, réinitialiser l'aperçu de l'image
        previewImage.src = "#";
        previewImage.style.display = "none"; // Masquer l'aperçu de l'image
        // Afficher le formulaire d'aperçu de l'image
        previewForm.style.display = "block";
        // Réinitialiser le style du bouton de validation
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
        alert("Veuillez remplir tous les champs.");
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

    try {
        const response = await fetch(
            "http://localhost:5678/api/works",
            request
        );

        if (response.ok) {
            // Réinitialiser le formulaire après l'ajout du travail
            document.getElementById("titre").value = "";
            document.getElementById("categorie").value = "";
            imageInput.value = "";

            // Rafraîchir la liste des travaux sur la page d'accueil
            const updatedWorks = await fetchWorks();
            displayWorks(updatedWorks);
            alert(`Votre projet ${title} a été ajouté avec succès.`);

            // Réinitialiser l'aperçu de l'image
            const previewImage = document.querySelector(
                ".contain_btn_add_img img"
            );
            previewImage.src = "#";
            previewImage.style.display = "none";

            // Réafficher le formulaire d'aperçu de l'image
            const previewForm = document.querySelector(".form_preview_img");
            previewForm.style.display = "flex";

            // Réinitialiser le bouton
            submitButton.style.background = "";
        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
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
