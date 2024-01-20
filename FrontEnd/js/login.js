// Variables login
const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const form = document.querySelector("form");
const messageError = document.querySelector("#login p");

async function login() {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Récupérer les valeurs de l'email et du mot de passe
        const userEmail = emailInput.value;
        const userPwd = passwordInput.value;

        try {
            // Effectuer une requête POST pour vérifier les identifiants
            const response = await fetch(
                "http://localhost:5678/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPwd,
                    }),
                }
            );

            // Vérifier si la requête a réussi
            if (response.ok) {
                // Redirection vers la page d'accueil après la connexion réussie
                window.location.href =
                    "http://127.0.0.1:5500/FrontEnd/index.html";
            } else {
                // Affichage d'un message d'erreur en cas d'échec de la connexion
                messageError.textContent =
                    "Erreur dans l’identifiant ou le mot de passe.";
            }
        } catch (error) {
            console.error(
                "Une erreur s'est produite lors de la connexion",
                error
            );
        }
    });
}

login();
