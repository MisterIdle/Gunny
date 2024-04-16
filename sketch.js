const GAME_WIDTH = 1000;
const GAME_HEIGHT = 700;
const PLAYER_START_X = GAME_WIDTH / 2;
const PLAYER_START_Y = GAME_HEIGHT - 75;
const ENEMY_START_X = GAME_WIDTH - 20;
const ENEMY_START_Y = GAME_HEIGHT - 130;
const JUMP_FORCE = 15;
const GRAVITY = 0.5;
const ENEMY_SPEED_MIN = 1;
const ENEMY_SPEED_MAX = 3;
const ENEMY_SHOOT_INTERVAL = 3000;
const BULLET_SPEED = 5;
const SPAWN_INTERVAL = 3000;

let player;
let enemies = [];
let controlledEnemy = null;
let lastSpawnTime = 0;
let bullets = [];
let gameStarted = false;
let gameOver = false;
let seconds = 0;
let startTime;

let duck;
let mindduck;
let playerSprite;
let bulletSprite;

function preload() {
  duck = loadImage('artdev/duck.gif');
  mindduck = loadImage('artdev/mindduck.gif');
  playerSprite = loadImage('artdev/gun.gif');
  bulletSprite = loadImage('artdev/bullet.png');
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
}

function draw() {
  background(255);

  if (gameStarted && !gameOver) {
    displayTimer();
  }

  if (!gameStarted) {
    displayStartMessage();
  }

  if (gameOver) {
    if (controlledEnemy) {
      enemies.splice(enemies.indexOf(controlledEnemy), 1);
      controlledEnemy = null;
    }

    displayGameOver();
  }

  displayGround();

  player.handleInput();
  player.update();
  player.display();

  updateAndDisplayEnemies();

  updateAndDisplayBullets();
}

function displayTimer() {
  seconds = Math.floor((millis() - startTime) / 1000);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Time: " + seconds, 10, 10);
}

function displayStartMessage() {
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Press space to start", width / 2, height / 2);
}

function displayGameOver() {
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  text("Press R to restart", width / 2, height / 2 + 50);
  text("Time: " + seconds, width / 2, height / 2 + 100);

  if (keyIsDown(82)) {
    restartGame();
  }
}

function displayGround() {
  fill(0);
  rect(0, height - 50, width, 2);
}

function updateAndDisplayEnemies() {
  if (millis() - lastSpawnTime > SPAWN_INTERVAL) {
    enemies.push(new Enemy());
    lastSpawnTime = millis();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();

    if (enemies[i].x < -50) {
      enemies.splice(i, 1);
    }

    if (controlledEnemy === enemies[i]) {
      enemies[i].handleControl();
      player.x = enemies[i].x;
    }
  }

  checkEnemyCollisions();
}

function checkEnemyCollisions() {
  if (controlledEnemy && !gameOver) {
    for (let i = 0; i < enemies.length; i++) {
      if (controlledEnemy !== enemies[i] && player.collidesWithEnemy(enemies[i])) {
        gameOver = true;
        return;
      }
    }
  }
}

function updateAndDisplayBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    if (bullets[i].x < 0) {
      bullets.splice(i, 1);
    }
  }
}

function restartGame() {
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
  enemies = [];
  bullets = [];
  controlledEnemy = null;
  lastSpawnTime = 0;
  gameStarted = false;
  gameOver = false;
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.jumpHeight = 200;
    this.jumpForce = JUMP_FORCE;
    this.gravity = GRAVITY;
    this.isJumping = false;
    this.haveJumped = false;
    this.jumpLength = 0;
    this.rotationAngle = 0.0;
    this.direction = 0;
    this.isControllingEnemy = false;
    this.horizontalSpeed = -1;
    this.sprite = playerSprite;
    this.isFlipped = false;
    this.controlledEnemyTime = 0;
    this.controlledEnemy = null;
  }

  handleInput() {
    if (keyIsDown(32) && !this.isJumping && this.y >= height - 75 && !gameOver) {
      this.isJumping = true;

      if (!gameStarted) {
        startTime = millis();
      }

      gameStarted = true;
    }

    if (mouseX < this.x && !this.haveJumped) {
      this.direction = -this.jumpLength;
      this.isFlipped = false;
    } else if (mouseX > this.x && !this.haveJumped) {
      this.direction = this.jumpLength;
      this.isFlipped = true;
    }

    let distanceX = mouseX - this.x;
    this.jumpLength = map(abs(distanceX), 0, width, 0, 10);

    if (this.isControllingEnemy && keyIsDown(32)) {
      this.controlledEnemy = null; // Désactive le contrôle de l'ennemi contrôlé actuel
      enemies.splice(enemies.indexOf(controlledEnemy), 1);
      this.isControllingEnemy = false;
    }
  }

  update() {
    if (this.isJumping) {
      this.haveJumped = true;
      this.jump();
      if (this.isControllingEnemy) {
        this.controlledEnemyTime = millis();
      }

      this.x += this.direction;
      this.x = constrain(this.x, 0, width);

      if (this.y < height - 75) {
        this.rotationAngle += 12;
      }
    }

    if (this.y < height - 75) {
      this.y += this.gravity;
    }

    if (this.x <= -50 || this.x >= width) {
      gameOver = true;
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      if (this.collidesWithEnemy(enemies[i])) {
        if (this.isJumping && !this.isControllingEnemy && !this.controlledEnemy) {
          this.controlledEnemy = enemies[i];
          controlledEnemy = enemies[i];
          this.isControllingEnemy = true;

          if (this.isControllingEnemy) {
            enemies[i].changeSprite(mindduck);
          }
        }
      }
    }
  }

  jump() {
    this.y -= this.jumpForce;
    this.jumpForce -= this.gravity;

    if (this.y >= height - 75) {
      this.y = height - 75;
      this.jumpForce = JUMP_FORCE;

      if (!this.isControllingEnemy) {
        if (this.rotationAngle < 0) {
          this.rotationAngle = 2;
          gameOver = true;
        } else if (this.rotationAngle > 0) {
          this.rotationAngle = -2;
          gameOver = true;
        }
      }

      this.isJumping = false;
      this.haveJumped = false;
    }
  }

  display() {
    if (!this.isControllingEnemy) {
      imageMode(CENTER);
      if (this.isFlipped) {
        push();
        translate(this.x, this.y);
        rotate(radians(this.rotationAngle));
        scale(-1, 1);
        image(this.sprite, 0, 0, 100, 100);
        pop();
      } else {
        push();
        translate(this.x, this.y);
        rotate(radians(-this.rotationAngle));
        image(this.sprite, 0, 0, 100, 100);
        pop();
      }
    }
  }

  collidesWithEnemy(enemy) {
    return this.x <= enemy.x + 100 && this.x + 20 >= enemy.x && this.y <= enemy.y + 100 && this.y + 20 >= enemy.y;
  }
}

class Enemy {
  constructor() {
    this.x = ENEMY_START_X;
    this.y = ENEMY_START_Y;
    this.speed = random(ENEMY_SPEED_MIN, ENEMY_SPEED_MAX);
    this.gif = duck;
    this.isFlipped = false;
    this.lastShotTime = 0;
    this.isControlled = false;
  }

  update() {
    this.x -= this.speed;

    if (millis() - this.lastShotTime > ENEMY_SHOOT_INTERVAL) {
      this.shoot();
      this.lastShotTime = millis();
    }
  }

  display() {
    push();
    translate(this.x + this.gif.width / 3, this.y + this.gif.height / 3);
    if (this.isFlipped) {
      scale(-1, 1);
    }
    imageMode(CENTER);
    image(this.gif, 0, 0, 100, 100);
    pop();
  }

  changeSprite(sprite) {
    this.gif = sprite;
  }

  handleControl() {
    if (!enemies.includes(this)) {
      return;
    }
  }

  shoot() {
    if (this !== controlledEnemy) {
      if (controlledEnemy && abs(controlledEnemy.x - this.x) > 200) {
        let bullet = new Bullet(this.x + 55, this.y + 50);
        bullets.push(bullet);
      }
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = BULLET_SPEED;
  }

  update() {
    this.x -= this.speed;
    this.y += random(-0.5, 0.5);
  }

  display() {
    image(bulletSprite, this.x, this.y, 100, 100);
  }
}
