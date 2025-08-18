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

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
    // Trouver le bouton "up"
    const upButton = document.querySelector(".up");

    if (!upButton) return; // sécurité si bouton absent

    // Au clic, scroll en haut de .textecont
    upButton.addEventListener("click", () => {
        const texteCont = document.querySelector(".textecont");
        if (texteCont) {
            texteCont.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".manifest-content");

  items.forEach(item => {
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
