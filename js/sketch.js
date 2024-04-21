const GAME_WIDTH = 1000;
const GAME_HEIGHT = 400;
const PLAYER_START_X = GAME_WIDTH / 4;
const PLAYER_START_Y = GAME_HEIGHT - 75;
const ENEMY_START_X = GAME_WIDTH - 20;
const ENEMY_START_Y = GAME_HEIGHT - 130;
const JUMP_FORCE = 15;
const GRAVITY = 0.5;
const ENEMY_SPEED_MIN = 1;
const ENEMY_SPEED_MAX = 3;
const ENEMY_SHOOT_INTERVAL = 3000;
const BULLET_SPEED = 7;
const BULLET_PLAYER_SPEED = 10;
const SPAWN_INTERVAL = 3000;

let player;
let enemies = [];
let controlledEnemy = null;
let lastSpawnTime = 0;
let bullets = [];
let playerBullets = [];
let gameStarted = false;
let gameOver = false;
let seconds = 0;
let startTime;

let playerSprite;
let bulletSprite;
let akaquak;
let mindduck;
let croco_nard;

function preload() {
  akaquak = loadImage('artdev/akaquak.gif');
  mindduck = loadImage('artdev/mindduck.gif');
  croco_nard = loadImage('artdev/croco_nard.gif');
  playerSprite = loadImage('artdev/gun.gif');
  bulletSprite = loadImage('artdev/bullet.png');
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
}

function draw() {
  background(250);

  if (gameStarted && !gameOver) {
    displayTimer();
  }

  if (!gameStarted) {
    displayStartMessage();
  }

  if (gameOver) {
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
  text("Game Over", width / 2, height / 2 - 100);
  text("Press R to restart", width / 2, height / 2 - 10);
  text("Time: " + seconds, width / 2, height / 2 - 50);
}

function displayGround() {
  fill(0);
  rect(0, height - 50, width, 2);
}

function updateAndDisplayEnemies() {
  if (millis() - lastSpawnTime > random(SPAWN_INTERVAL, SPAWN_INTERVAL + 4000)) {
    enemies.push(new Enemy());
    lastSpawnTime = millis();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();

    if (enemies[i].x < -50) {
      enemies.splice(i, 1);
    } else if (controlledEnemy && controlledEnemy === enemies[i] && controlledEnemy.x < -50) {
      enemies.splice(i, 1);
      controlledEnemy = null;
      player.isControllingEnemy = false;
      gameOver = true;
    }

    if (controlledEnemy === enemies[i] && !controlledEnemy.isJumping) {
      player.x = enemies[i].x;
    }
  }
}

function updateAndDisplayBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    if (player.collidesWithBullet(bullets[i])) {
      bullets.splice(i, 1);
      controlledEnemy.isJumping = true;
      gameOver = true;

      setTimeout(() => {
        enemies.splice(enemies.indexOf(controlledEnemy), 1);
      }, 800);
    }
  }

  for (let i = playerBullets.length - 1; i >= 0; i--) {
    playerBullets[i].update();
    playerBullets[i].display();

    for (let j = enemies.length - 1; j >= 0; j--) {
      if (enemies[j].collidesWithBullet(playerBullets[i])) {
        enemies[j].isJumping = true;
        playerBullets.splice(i, 1);
        bullets = [];

        setTimeout(() => {
          enemies.splice(j, 1);
        }, 800);
      }
    }
  }
}

function restartGame() {
  player = new Player(PLAYER_START_X, PLAYER_START_Y);
  enemies = [];
  bullets = [];
  playerBullets = [];
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
    this.controlledEnemy = null;
    this.lastShootTime = 0;
    this.shootDelay = 2000;
    this.isShooting = false;
  }

  handleInput() {
    if (gameOver) {
      return;
    }

    if (keyIsDown(32) && !gameOver) {
      this.isJumping = true;

      if (!gameStarted) {
        startTime = millis();
      }

      gameStarted = true;
    }

    if (keyIsDown(69) && !this.isShooting && millis() - this.lastShootTime > this.shootDelay && this.isControllingEnemy) {
      this.shoot();
      this.isShooting = true;
      this.lastShootTime = millis();
      setTimeout(() => { this.isShooting = false; }, 2000);
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

    if (keyIsDown(32) && this.isControllingEnemy) {
      this.isControllingEnemy = false;
      this.controlledEnemy.isJumping = true;
      this.controlledEnemy = null;

      setTimeout(() => {
        enemies = enemies.filter(enemy => enemy !== controlledEnemy);
      }, 800);
    }
  }

  update() {
    if (this.isJumping) {
      this.haveJumped = true;
      this.jump();

      this.x += this.direction;
      this.x = constrain(this.x, 0, width);

      if (this.y < height - 75) {
        this.rotationAngle += 12;
      }
    }

    if (this.y < height - 75) {
      this.y += this.gravity;
    }

    if (this.x < -30 || this.x > width) {
      gameOver = true;
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      if (this.collidesWithEnemy(enemies[i])) {
        if (this.isJumping && !this.isControllingEnemy && !this.controlledEnemy && !enemies[i].isCrocoNard) {
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
          gameOver = true;
        } else if (this.rotationAngle > 0) {
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
    return this.x <= enemy.x + 100 && this.x + 20 >= enemy.x &&
           this.y <= enemy.y + 100 && this.y + 20 >= enemy.y;
  }

  collidesWithBullet(bullet) {
    return this.x <= bullet.x + 100 && this.x + 70 >= bullet.x &&
           this.y <= bullet.y + 100 && this.y + 20 >= bullet.y;
  }

  shoot() {
    this.controlledEnemy.speed = 0;
    this.controlledEnemy.isFlipped = true;

    let bullet = new PlayerBullet(this.x + 100, this.y);
    playerBullets.push(bullet);

    setTimeout(() => {
      this.controlledEnemy.isFlipped = false;
      this.controlledEnemy.speed = random(ENEMY_SPEED_MIN, ENEMY_SPEED_MAX);
    }, 500);
  }
}


class Enemy {
  constructor() {
    this.x = ENEMY_START_X;
    this.y = ENEMY_START_Y;
    this.speed = random(ENEMY_SPEED_MIN, ENEMY_SPEED_MAX);
    this.isCrocoNard = random() > 0.9;
    this.gif = this.isCrocoNard ? croco_nard : akaquak;
    this.isFlipped = false;
    this.lastShotTime = 0;
    this.initialShotDelay = random(700, 1500);
    this.timeSinceSpawn = millis();
    this.isJumping = false;
    this.jumpForce = 4;
  }

  update() {
    this.x -= this.speed;

    if (this.isJumping) {
      this.jump();
    }

    if (millis() - this.timeSinceSpawn > this.initialShotDelay && millis() - this.lastShotTime > ENEMY_SHOOT_INTERVAL && !this.isJumping) {
      this.shoot();
      this.lastShotTime = millis();
    }
  }

  jump() {
    this.x += this.speed;
    this.y -= this.jumpForce;
    this.jumpForce -= GRAVITY;
  }

  display() {
    if (this.gif) {
      push();
      translate(this.x + this.gif.width / 3, this.y + this.gif.height / 3);
     
      if (this.isFlipped) {
        scale(-1, 1);
      }

      if(this.isJumping) {
        rotate(radians(30));
      }

      imageMode(CENTER);
      image(this.gif, 0, 0, 100, 100);
      pop();
    }
  }

  changeSprite(sprite) {
    this.gif = sprite;
    this.isCrocoNard = true;
  }

  collidesWithBullet(playerBullet) {
    if (playerBullet) {
      return this.x <= playerBullet.x + 20 && this.x + 0 >= playerBullet.x &&
             this.y <= playerBullet.y + 100 && this.y + 100 >= playerBullet.y;
    }
  }

  shoot() {
    if (this !== controlledEnemy && !gameOver) {
      if (controlledEnemy && abs(controlledEnemy.x - this.x) > 10) {
        let bullet = new Bullet(this.x + 30, this.y + 57);
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
  }

  display() {
    image(bulletSprite, this.x, this.y, 100, 100);
  }
}

class PlayerBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = BULLET_PLAYER_SPEED;
  }

  update() {
    this.x += this.speed;
  }

  display() {
    image(bulletSprite, this.x, this.y, 100, 100);
  }
}
