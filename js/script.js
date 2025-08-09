document.addEventListener("DOMContentLoaded", () => {
    const hero = document.getElementById("hero");
    const mainContent = document.getElementById("main-content");

    // Gérer le clic sur le héros
    hero.addEventListener("click", () => {
        mainContent.scrollIntoView({ behavior: "smooth" });
    });
});

const hero = document.querySelector(".hero");

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
