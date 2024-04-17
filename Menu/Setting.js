// Fonction pour mettre à jour le volume de la musique
const music = document.getElementById("music");
const sfx = document.getElementById("sfx");

function updateMusicVolume(volume) {
    // Mettre à jour le volume de la musique
    music.volume = volume;
}

// Fonction pour mettre à jour le volume des effets sonores (SFX)
function updateSFXVolume(volume) {
    // Mettre à jour le volume des effets sonores (SFX)
    sfx.volume = volume;
}

// Ajouter un gestionnaire d'événements pour les boutons de contrôle
document.addEventListener("DOMContentLoaded", function() {
    const jumpControlButton = document.getElementById("jumpControlButton");
    const shootControlButton = document.getElementById("shootControlButton");

    jumpControlButton.addEventListener("click", function() {
        configureControl("saut");
    });

    shootControlButton.addEventListener("click", function() {
        configureControl("tir");
    });
});

// Fonction pour configurer le contrôle
function configureControl(controlType) {
    // Demander à l'utilisateur de saisir la nouvelle touche ou action pour le contrôle
    const newControl = prompt("New control " + controlType + ":");
    // Mettre à jour le texte du bouton avec le nouveau contrôle
    if (controlType === "saut") {
        jumpControlButton.textContent = "Saut: " + newControl;
    } else if (controlType === "tir") {
        shootControlButton.textContent = "Tir: " + newControl;
    }
}
