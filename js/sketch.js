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

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
  
  const savedTheme = loadThemeFromCookie();
  if (savedTheme) {
    selectedTheme = savedTheme;
  }
}

function draw() {  
  bgX -= 0.5;

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
  }

  if (keyIsDown(82)) {
    restartGame();
  }

  player.handleInput();
  player.update();
  player.display();

  displayGround();
  theme();
  updateAndDisplayEnemies();
  updateAndDisplayBullets();
}

function setThemeCookie(theme) {
  document.cookie = `selectedTheme=${theme}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

function loadThemeFromCookie() {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'selectedTheme') {
      return value;
    }
  }
  return null;
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
  setThemeCookie(theme);
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
  gameState = GameState.NOT_STARTED;
}
