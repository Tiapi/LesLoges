document.addEventListener("DOMContentLoaded", () => {
    // Scroll vers le main-content depuis le héros
    const hero = document.querySelector(".hero");
    const mainContent = document.getElementById("main-content");

    if (hero && mainContent) {
        hero.addEventListener("click", () => {
            mainContent.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Bloque le scroll vers le haut seulement sur index.html
    if (
        window.location.pathname.endsWith("/index.html") ||
        window.location.pathname === "/"
    ) {
        window.addEventListener(
            "wheel",
            (event) => {
                const scrollY = window.scrollY || window.pageYOffset;

                if (scrollY <= 0 && event.deltaY < 0) {
                    // En haut de la page ET scroll vers le haut => bloquer
                    event.preventDefault();
                }
            },
            { passive: false }
        );
    }

    // Bouton "up" pour remonter .textecont
    const upButton = document.querySelector(".up");
    if (upButton) {
        upButton.addEventListener("click", () => {
            const texteCont = document.querySelector(".textecont");
            if (texteCont) {
                texteCont.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        });
    }

    // Accordéon manifest
    const items = document.querySelectorAll(".manifest-content");
    items.forEach((item) => {
        const content = item.querySelector(".content");
        const icon = item.querySelector(".icon");

        item.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            if (!isActive) {
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px"; // ouverture fluide
                icon.textContent = "×";
            } else {
                item.classList.remove("active");
                content.style.maxHeight = null; // fermeture fluide
                icon.textContent = "+";
            }
        });
    });
});
