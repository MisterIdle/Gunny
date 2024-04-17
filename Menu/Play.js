// Récupérer les éléments HTML
const mainMenu = document.getElementById("mainMenu");
const startButton = document.getElementById("startButton");
const gameCanvas = document.getElementById("gameCanvas");

// Ajouter un gestionnaire d'événements pour le clic sur le bouton "Lancer le jeu"
startButton.addEventListener("click", function() {
    // Animation pour retirer le menu principal
    mainMenu.style.opacity = "0"; // Réduire l'opacité du menu principal
    setTimeout(function() {
        mainMenu.style.display = "none"; // Masquer le menu principal après l'animation
        startGame(); // Lancer le jeu
    }, 1000); // Attendre 1 seconde pour l'animation
});

// Fonction pour lancer le jeu
function startGame() {
    // Code pour initialiser et démarrer votre jeu
    console.log("Le jeu a démarré !");
}
