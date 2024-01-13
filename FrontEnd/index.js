fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
        // Sélectionnez la galerie
        const gallery = document.querySelector(".gallery");

        // Parcourez les données récupérées de l'API
        works.forEach((work) => {
            // Créez un élément figure
            const figure = document.createElement("figure");

            // Créez un élément image
            const img = document.createElement("img");
            img.src = work.imageUrl; // Assurez-vous que votre API renvoie l'URL de l'image
            img.alt = work.title;

            // Créez un élément figcaption
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = work.title;

            // Ajoutez l'image et le figcaption à la figure
            figure.appendChild(img);
            figure.appendChild(figcaption);

            // Ajoutez la figure à la galerie
            gallery.appendChild(figure);
        });
    });
