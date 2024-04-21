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
};

let gameState = GameState.NOT_STARTED;
let selectedTheme = SelectedTheme.SUMMER;

let seconds = 0;
let startTime;

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
}

function draw() {  
  bgX -= 0.5;

  background(0);

  switch (selectedTheme) {
    case SelectedTheme.DESERT:
      image(backgroundImgDesert, bgX % width, 150, width, height);
      image(backgroundImgDesert, (bgX % width) + width, 150, width, height);
      image(backgroundImgDesert, (bgX % width) + 2 * width, 150, width, height);
      break;
    case SelectedTheme.SUMMER:
      image(backgroundImgSummer, bgX % width, 150, width, height);
      image(backgroundImgSummer, (bgX % width) + width, 150, width, height);
      image(backgroundImgSummer, (bgX % width) + 2 * width, 150, width, height);
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
  updateAndDisplayEnemies();
  updateAndDisplayBullets();
}

function restartGame() {
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
  enemies = [];
  bullets = [];
  playerBullets = [];
  controlledEnemy = null;
  lastSpawnTime = 0;
  gameState = GameState.NOT_STARTED;
}
