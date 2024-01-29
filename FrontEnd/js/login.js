// Variables login //
const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const form = document.querySelector("form");
const messageError = document.querySelector("#login p");

async function login() {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Récupération valeurs email et mot de passe //
        const userEmail = emailInput.value;
        const userPwd = passwordInput.value;

        // Vérifications des identifiants avec méthode Post //
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPwd,
            }),
        });

        // Condition si correcte //
        if (response.ok) {
            // Récupération du token depuis la réponse
            const data = await response.json();
            const token = data.token;

            // Stockage du token dans le localStorage
            localStorage.setItem("token", token);

            // Redirection vers index.html
            window.location.href = "../index.html";
        } else {
            // Message d'erreur si incorrect //
            messageError.textContent =
                "Erreur dans l’identifiant ou le mot de passe.";
        }
    });
}

login();
