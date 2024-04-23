const GAME_WIDTH = 1100;
const GAME_HEIGHT = 400;
const JUMP_FORCE = 15;
const GRAVITY = 0.5;

let bgX = 0;

const GameState = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  OVER: 'over'
};

const SelectedTheme = {
  SUMMER: 'summer',
  DESERT: 'desert',
  DEV: 'dev'
};

let gameState = GameState.NOT_STARTED;
let selectedTheme = SelectedTheme.DESERT;

let seconds = 0;
let startTime;
let scoreCapture = 0;
let scoreDistance = 0;

let bestSeconds = 0;
let bestScoreCapture = 0;
let bestScoreDistance = 0;

let gameOverSoundPlayed = false;

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);

  const savedTheme = getCookie("selectedTheme");
  if (savedTheme) {
    selectedTheme = savedTheme;
  }

  selectTheme(selectedTheme);

  const savedSfxVolume = getCookie("sfxVolume");
  const savedMusicVolume = getCookie("musicVolume");

  if (savedSfxVolume) {
    document.getElementById("sfxVolume").value = savedSfxVolume;
  }
  if (savedMusicVolume) {
    document.getElementById("musicVolume").value = savedMusicVolume;
  }

  const savedBestSeconds = getCookie("bestSeconds");
  const savedBestScoreCapture = getCookie("bestScoreCapture");
  const savedBestScoreDistance = getCookie("bestScoreDistance");

  if (savedBestSeconds) {
    bestSeconds = parseInt(savedBestSeconds);
  }
  if (savedBestScoreCapture) {
    bestScoreCapture = parseInt(savedBestScoreCapture);
  }
  if (savedBestScoreDistance) {
    bestScoreDistance = parseInt(savedBestScoreDistance);
  }

  music.loop();
}

function draw() {  
  bgX -= 0.3;
  background(0);
  switch (selectedTheme) {
    case SelectedTheme.DESERT:
      image(backgroundImgDesert, bgX % width, 150, width, height);
      image(backgroundImgDesert, (bgX % width) + width, 150, width + 1, height);
      image(backgroundImgDesert, (bgX % width) + 2 * width, 150, width, height);
      break;
    case SelectedTheme.SUMMER:
      image(backgroundImgSummer, bgX % width, 150, width, height);
      image(backgroundImgSummer, (bgX % width) + width, 150, width + 1, height);
      image(backgroundImgSummer, (bgX % width) + 2 * width, 150, width, height);
      break;
    case SelectedTheme.DEV:
      fill(255);
      rect(0, 0, width, height);
      break;
  }

  if (gameState === GameState.STARTED) {
    displayTimer();
  }
  if (gameState === GameState.NOT_STARTED) {
    displayStartMessage();
  }
  if (gameState === GameState.OVER) {
    bullets = [];
    displayGameOver();
    if (!gameOverSoundPlayed) {
      deathSound.play();
      gameOverSoundPlayed = true;
    }
  }

  if (keyIsDown(82)) {
    restartGame();
  }

  player.handleInput();
  player.update();
  player.display();

  displayGround();

  theme();
  audioManager();
  
  updateAndDisplayEnemies();
  updateAndDisplayBullets();
  updateBestScore();
}

function updateBestScore() {
  if (seconds > bestSeconds) {
    bestSeconds = seconds;
  }

  if (scoreCapture > bestScoreCapture) {
    bestScoreCapture = scoreCapture;
  }

  if (scoreDistance > bestScoreDistance) {
    bestScoreDistance = scoreDistance;
  }

  setCookie("bestSeconds", bestSeconds);
  setCookie("bestScoreCapture", bestScoreCapture);
  setCookie("bestScoreDistance", bestScoreDistance);
}

function audioManager() {
  const sfxVolumeControl = document.getElementById("sfxVolume");
  const sfxVolumeValue = parseFloat(sfxVolumeControl.value);
  const musicVolumeControl = document.getElementById("musicVolume");
  const musicVolumeValue = parseFloat(musicVolumeControl.value);

  jumpSound.setVolume(sfxVolumeValue);
  deathSound.setVolume(sfxVolumeValue);
  shootSound.setVolume(sfxVolumeValue);
  shootenemySound.setVolume(sfxVolumeValue);
  hurtSound.setVolume(sfxVolumeValue);
  mindSound.setVolume(sfxVolumeValue);

  music.setVolume(musicVolumeValue);

  setCookie("sfxVolume", sfxVolumeValue);
  setCookie("musicVolume", musicVolumeValue);
}

function theme() {
  const desertButton = select('#theme1');
  const summerButton = select('#theme2');
  const devButton = select('#theme3');

  desertButton.mousePressed(() => selectTheme(SelectedTheme.DESERT));
  summerButton.mousePressed(() => selectTheme(SelectedTheme.SUMMER));
  devButton.mousePressed(() => selectTheme(SelectedTheme.DEV));
}

function selectTheme(theme) {
  selectedTheme = theme;
  setCookie("selectedTheme", theme);
}

function restartGame() {
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
  enemies = [];
  bullets = [];
  playerBullets = [];
  controlledEnemy = null;
  lastSpawnTime = 0;
  scoreCapture = 0;
  scoreDistance = 0;
  gameOverSoundPlayed = false;
  bestScoreAchieved = false;
  gameState = GameState.NOT_STARTED;
}
