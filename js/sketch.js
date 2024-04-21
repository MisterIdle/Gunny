const GAME_WIDTH = 1200;
const GAME_HEIGHT = 400;
const JUMP_FORCE = 15;
const GRAVITY = 0.5;

let bgX = 0;

const GameState = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  OVER: 'over'
};

let gameState = GameState.NOT_STARTED;

let seconds = 0;
let startTime;

function setup() {
  // Create the canvas selon la taille de l'écran
  createCanvas(GAME_WIDTH / windowWidth + 1200, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
}

function draw() {
  background(220);
  
  bgX -= 0.5;
  image(backgroundImg, bgX % width, 150, width, height);
  image(backgroundImg, (bgX % width) + width, 150, width, height);
  image(backgroundImg, (bgX % width) + 2 * width, 150, width, height);

  
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
