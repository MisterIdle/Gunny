const musicSettings = document.getElementById("musicSettings");
const sfxSettings = document.getElementById("sfxSettings");
const musicVolumeInput = document.getElementById("musicVolume");
const sfxVolumeInput = document.getElementById("sfxVolume");

const music = document.getElementById("music");
const sfx = document.getElementById("sfx");

function updateMusicVolume(volume) {
    music.volume = volume;
}

function updateSFXVolume(volume) {
    sfx.volume = volume;
}

settingsButton.addEventListener("click", function() {
    if (musicSettings.style.display === "none") {
        musicSettings.style.display = "block";
        sfxSettings.style.display = "block";

        const configButton = document.createElement("button");
        configButton.textContent = "Configurer";
        configButton.id = "configButton";
        const configButtonContainer = document.getElementById("configButtonContainer");
        configButtonContainer.innerHTML = "";
        configButtonContainer.appendChild(configButton);

    } else {
        musicSettings.style.display = "none";
        sfxSettings.style.display = "none";

        const configButton = document.getElementById("configButton");
        if (configButton) {
            configButton.remove();
        }
    }
});

musicVolumeInput.addEventListener("input", function() {
    updateMusicVolume(parseFloat(musicVolumeInput.value));
});

sfxVolumeInput.addEventListener("input", function() {
    updateSFXVolume(parseFloat(sfxVolumeInput.value));
});
