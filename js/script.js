document.addEventListener("DOMContentLoaded", () => {
    const hero = document.getElementById("hero");
    const mainContent = document.getElementById("main-content");

    // Gérer le clic sur le héros
    hero.addEventListener("click", () => {
        mainContent.scrollIntoView({ behavior: "smooth" });
    });
});
