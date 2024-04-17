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
