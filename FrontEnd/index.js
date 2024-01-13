fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
        //Ajout dynamique des projets //
        const gallery = document.querySelector(".gallery");

        works.forEach((work) => {
            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const figcaption = document.createElement("figcaption");
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        });
    });
