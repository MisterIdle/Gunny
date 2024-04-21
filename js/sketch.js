const GAME_WIDTH = 1000;
const GAME_HEIGHT = 400;
const JUMP_FORCE = 15;
const GRAVITY = 0.5;

const GameState = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  OVER: 'over'
};

let gameState = GameState.NOT_STARTED;

let seconds = 0;
let startTime;

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
}

function draw() {
  background(250);

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
