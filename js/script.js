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
            } else {
                item.classList.remove("active");
                content.style.maxHeight = null; // fermeture fluide
            }
        });
    });
    const burger = document.querySelector(".burger");
    const navUl = document.querySelector("nav ul");
    if (burger && navUl) {
        burger.addEventListener("click", () => {
            const isOpen = navUl.classList.toggle("open");
            burger.classList.toggle("open", isOpen);
            burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
        // Optionally close menu when clicking a link
        navUl.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navUl.classList.remove("open");
                burger.classList.remove("open");
                burger.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Charge la liste des projets depuis /data/projects.json
    fetch('/data/projects.json')
        .then(res => {
            if (!res.ok) throw new Error('Projet JSON inaccessible');
            return res.json();
        })
        .then(data => {
            window.projectList = data;

            // Générer la table des projets si elle existe
            const projectsTable = document.querySelector(".projects-table");
            if (projectsTable) {
                projectsTable.innerHTML = `
                    <colgroup>
                        <col style="width: 25%" />
                        <col style="width: 25%" />
                        <col style="width: 25%" />
                        <col style="width: 25%" />
                    </colgroup>
                    <tr>
                        <td>Date / Year</td>
                        <td>Project place</td>
                        <td colspan="2" class="project-name">Project name</td>
                    </tr>
                `;
                window.projectList.forEach((proj, idx) => {
                    projectsTable.innerHTML += `
                        <tr>
                            <td>${proj.year}</td>
                            <td>${proj.place}</td>
                            <td colspan="2" class="project-name">
                                <a href="pages/projet_template.html?id=${proj.id}">${proj.name}</a>
                            </td>
                        </tr>
                    `;
                });
            }

            // Si on est sur la page projet_template.html, affiche le bon projet selon l'id
            const path = window.location.pathname;
            if (path.includes("/pages/projet_template.html")) {
                const params = new URLSearchParams(window.location.search);
                const projId = params.get("id");
                const idx = window.projectList.findIndex((p) => p.id === projId);
                const proj = window.projectList[idx];

                if (proj) {
                    const titleDiv = document.querySelector('.title');
                    if (titleDiv) titleDiv.textContent = proj.name;

                    const dateEl = document.querySelector('.datepro');
                    if (dateEl) dateEl.textContent = proj.year;

                    const titlePro = document.querySelector('.titlepro');
                    if (titlePro) titlePro.innerHTML = `<br>${proj.title.replace(/ /g, '<br>')}`;

                    const textPro = document.querySelector('.textpro');
                    if (textPro) textPro.textContent = proj.description;

                    const imagesCont = document.querySelector('.imagescont');
                    if (imagesCont) {
                        imagesCont.innerHTML = proj.images.map(src =>
                            `<img class="image" src="${src}" alt="Image projet" />`
                        ).join('');
                    }
                    const imagesCont2 = document.querySelector('.imagescont2');
                    if (imagesCont2) {
                        imagesCont2.innerHTML = proj.images.map(src =>
                            `<img class="image" src="${src}" alt="Image projet" />`
                        ).join('');
                    }

                    const lastLink = document.querySelector(".lastpro");
                    const nextLink = document.querySelector(".nextpro");
                    if (lastLink && idx > 0) {
                        lastLink.querySelector("p").textContent = window.projectList[idx - 1].name;
                        lastLink.parentElement.setAttribute("href", `./projet_template.html?id=${window.projectList[idx - 1].id}`);
                    }
                    if (nextLink && idx < window.projectList.length - 1) {
                        nextLink.querySelector("p").textContent = window.projectList[idx + 1].name;
                        nextLink.parentElement.setAttribute("href", `./projet_template.html?id=${window.projectList[idx + 1].id}`);
                    }
                    if (lastLink && idx === 0) {
                        lastLink.parentElement.removeAttribute("href");
                        lastLink.querySelector("p").textContent = "Aucun projet précédent";
                    }
                    if (nextLink && idx === window.projectList.length - 1) {
                        nextLink.parentElement.removeAttribute("href");
                        nextLink.querySelector("p").textContent = "Aucun projet suivant";
                    }
                } else {
                    const titleDiv = document.querySelector('.title');
                    if (titleDiv) titleDiv.textContent = "Projet introuvable";
                    const textPro = document.querySelector('.textpro');
                    if (textPro) textPro.textContent = "Ce projet n'existe pas.";
                }
            }
        })
        .catch(err => {
            console.error('Erreur chargement projets:', err);
            window.projectList = [];
        });

    // Si on est sur la page projet_template.html, affiche le bon projet selon l'id
    const path = window.location.pathname;
    if (path.includes("/pages/projet_template.html")) {
        // Récupère l'id dans l'URL
        const params = new URLSearchParams(window.location.search);
        const projId = params.get("id");
        const idx = window.projectList.findIndex((p) => p.id === projId);
        const proj = window.projectList[idx];

        if (proj) {
            // Titre principal
            const titleDiv = document.querySelector('.title');
            if (titleDiv) titleDiv.textContent = proj.name;

            // Année
            const dateEl = document.querySelector('.datepro');
            if (dateEl) dateEl.textContent = proj.year;

            // Titre projet
            const titlePro = document.querySelector('.titlepro');
            if (titlePro) titlePro.innerHTML = `<br>${proj.title.replace(/ /g, '<br>')}`;

            // Description
            const textPro = document.querySelector('.textpro');
            if (textPro) textPro.textContent = proj.description;

            // Images principales
            const imagesCont = document.querySelector('.imagescont');
            if (imagesCont) {
                imagesCont.innerHTML = proj.images.map(src =>
                    `<img class="image" src="${src}" alt="Image projet" />`
                ).join('');
            }
            // Images secondaires (mobile)
            const imagesCont2 = document.querySelector('.imagescont2');
            if (imagesCont2) {
                imagesCont2.innerHTML = proj.images.map(src =>
                    `<img class="image" src="${src}" alt="Image projet" />`
                ).join('');
            }

            // Met à jour les liens "last" et "next"
            const lastLink = document.querySelector(".lastpro");
            const nextLink = document.querySelector(".nextpro");
            if (lastLink && idx > 0) {
                lastLink.querySelector("p").textContent = window.projectList[idx - 1].name;
                lastLink.parentElement.setAttribute("href", `./projet_template.html?id=${window.projectList[idx - 1].id}`);
            }
            if (nextLink && idx < window.projectList.length - 1) {
                nextLink.querySelector("p").textContent = window.projectList[idx + 1].name;
                nextLink.parentElement.setAttribute("href", `./projet_template.html?id=${window.projectList[idx + 1].id}`);
            }
            if (lastLink && idx === 0) {
                lastLink.parentElement.removeAttribute("href");
                lastLink.querySelector("p").textContent = "Aucun projet précédent";
            }
            if (nextLink && idx === window.projectList.length - 1) {
                nextLink.parentElement.removeAttribute("href");
                nextLink.querySelector("p").textContent = "Aucun projet suivant";
            }
        } else {
            // Si pas d'id ou id non trouvé, affiche un message d'erreur
            const titleDiv = document.querySelector('.title');
            if (titleDiv) titleDiv.textContent = "Projet introuvable";
            const textPro = document.querySelector('.textpro');
            if (textPro) textPro.textContent = "Ce projet n'existe pas.";
        }
    }
});

class ClickSpark {
    constructor(options = {}) {
        this.sparkColor = options.sparkColor || "#000";
        this.sparkSize = options.sparkSize || 10;
        this.sparkRadius = options.sparkRadius || 15;
        this.sparkCount = options.sparkCount || 8;
        this.duration = options.duration || 400;
        this.easing = options.easing || "ease-out";
        this.extraScale = options.extraScale || 1.0;

        this.sparks = [];
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;

        this.init();
    }

    init() {
        // Créer le canvas qui couvrira toute la page
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.zIndex = "9999";
        this.canvas.style.userSelect = "none";

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        // Redimensionner le canvas
        this.resizeCanvas();

        // Écouter les événements
        window.addEventListener("resize", () => this.resizeCanvas());
        document.addEventListener("click", (e) => this.handleClick(e));

        // Démarrer la boucle d'animation
        this.animate();
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = document.body.getBoundingClientRect();

        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";

        this.ctx.scale(dpr, dpr);
    }

    easeFunc(t) {
        switch (this.easing) {
            case "linear":
                return t;
            case "ease-in":
                return t * t;
            case "ease-in-out":
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            default: // ease-out
                return t * (2 - t);
        }
    }

    handleClick(e) {
        const x = e.clientX;
        const y = e.clientY;
        const now = performance.now();

        // Créer les nouvelles particules
        for (let i = 0; i < this.sparkCount; i++) {
            this.sparks.push({
                x: x,
                y: y,
                angle: (2 * Math.PI * i) / this.sparkCount,
                startTime: now,
            });
        }
    }

    animate(timestamp) {
        if (!timestamp) timestamp = performance.now();

        // Nettoyer le canvas
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Filtrer et dessiner les particules actives
        this.sparks = this.sparks.filter((spark) => {
            const elapsed = timestamp - spark.startTime;

            if (elapsed >= this.duration) {
                return false; // Supprimer cette particule
            }

            const progress = elapsed / this.duration;
            const eased = this.easeFunc(progress);
            const distance = eased * this.sparkRadius * this.extraScale;
            const lineLength = this.sparkSize * (1 - eased);

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 =
                spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 =
                spark.y + (distance + lineLength) * Math.sin(spark.angle);

            // Dessiner la ligne de particule
            this.ctx.strokeStyle = this.sparkColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            return true; // Garder cette particule
        });

        // Continuer l'animation
        this.animationId = requestAnimationFrame((ts) => this.animate(ts));
    }

    // Méthode pour détruire l'instance
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            document.body.removeChild(this.canvas);
        }
        document.removeEventListener("click", this.handleClick);
        window.removeEventListener("resize", this.resizeCanvas);
    }
}

// Initialiser l'effet au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    // Vous pouvez personnaliser les options ici
    const clickSparkEffect = new ClickSpark({
        sparkColor: "#000", // Couleur des particules (noir pour votre site)
        sparkSize: 10, // Taille des particules
        sparkRadius: 15, // Rayon d'expansion
        sparkCount: 8, // Nombre de particules par clic
        duration: 400, // Durée de l'animation en ms
        easing: "ease-out", // Type d'animation
        extraScale: 1.0, // Échelle supplémentaire
    });

    // Optionnel : stocker l'instance globalement si vous voulez la contrôler
    window.clickSparkEffect = clickSparkEffect;
});

// ========================================
// CURSEUR AVEC EFFET INVERSÉ
// ========================================

class InverseCursor {
    constructor(options = {}) {
        this.size = options.size || 40;
        this.cursor = null;
        this.isVisible = false;

        this.init();
    }

    init() {
        // Masquer le curseur par défaut
        document.body.style.cursor = "none";

        // Créer l'élément curseur
        this.cursor = document.createElement("div");
        this.cursor.className = "inverse-cursor";
        this.cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: black;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
      transition: transform 0.1s ease-out, opacity 0.2s ease;
      opacity: 0;
    `;

        document.body.appendChild(this.cursor);

        // Écouter les événements de souris
        document.addEventListener("mousemove", (e) => this.updatePosition(e));
        document.addEventListener("mouseenter", () => this.show());
        document.addEventListener("mouseleave", () => this.hide());

        // Effet de survol - agrandir légèrement
        document.addEventListener("mousedown", () => this.onMouseDown());
        document.addEventListener("mouseup", () => this.onMouseUp());

        // Gérer les éléments interactifs
        this.setupHoverEffects();
    }

    updatePosition(e) {
        if (this.cursor) {
            this.cursor.style.left = e.clientX + "px";
            this.cursor.style.top = e.clientY + "px";
        }
    }

    show() {
        if (this.cursor && !this.isVisible) {
            this.cursor.style.opacity = "1";
            this.isVisible = true;
        }
    }

    hide() {
        if (this.cursor && this.isVisible) {
            this.cursor.style.opacity = "0";
            this.isVisible = false;
        }
    }

    onMouseDown() {
        if (this.cursor) {
            this.cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
        }
    }

    onMouseUp() {
        if (this.cursor) {
            this.cursor.style.transform = "translate(-50%, -50%) scale(1)";
        }
    }

    setupHoverEffects() {
        // Agrandir sur les éléments interactifs
        const interactiveElements =
            'a, button, [role="button"], input, textarea, select, .clickable';

        document.addEventListener("mouseover", (e) => {
            if (
                e.target.matches(interactiveElements) ||
                e.target.closest(interactiveElements)
            ) {
                this.cursor.style.transform =
                    "translate(-50%, -50%) scale(1.8)";
                this.cursor.style.transition = "transform 0.2s ease-out";
            }
        });

        document.addEventListener("mouseout", (e) => {
            if (
                e.target.matches(interactiveElements) ||
                e.target.closest(interactiveElements)
            ) {
                this.cursor.style.transform = "translate(-50%, -50%) scale(1)";
            }
        });
    }

    // Méthodes pour contrôler le curseur
    setSize(size) {
        this.size = size;
        if (this.cursor) {
            this.cursor.style.width = size + "px";
            this.cursor.style.height = size + "px";
        }
    }

    destroy() {
        if (this.cursor) {
            document.body.removeChild(this.cursor);
            document.body.style.cursor = "auto";
        }

        // Nettoyer les event listeners si nécessaire
        document.removeEventListener("mousemove", this.updatePosition);
        document.removeEventListener("mouseenter", this.show);
        document.removeEventListener("mouseleave", this.hide);
    }
}

// ========================================
// CSS SUPPLÉMENTAIRE POUR L'EFFET
// ========================================

// Ajouter les styles CSS nécessaires
const cursorStyles = document.createElement("style");
cursorStyles.textContent = `
  /* Masquer tous les curseurs par défaut */
  *, *::before, *::after {
    cursor: none !important;
  }
  
  /* Effet spécial sur les éléments avec texte */
  .inverse-cursor {
    filter: invert(1);
  }
  
  /* Animation douce pour les transitions */
  .inverse-cursor.hovering {
    transform: translate(-50%, -50%) scale(1.5) !important;
  }
  
  /* Désactiver la sélection de texte lors du survol */
  body {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  /* Réactiver la sélection sur les éléments de texte importants */
  p, h1, h2, h3, h4, h5, h6, span, div, article, section {
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }
`;

document.head.appendChild(cursorStyles);

// ========================================
// INITIALISATION
// ========================================

// Initialiser le curseur inversé
const inverseCursor = new InverseCursor({
    size: 40, // Taille du curseur en pixels
});

// Affiche le curseur dès le chargement de la page
inverseCursor.show();

// Rendre accessible globalement
window.inverseCursor = inverseCursor;

// === LISTE DES PROJETS ===
window.projectList = [
    
];
