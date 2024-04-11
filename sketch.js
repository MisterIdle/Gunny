let player;
let enemy = [];
let controlledEnemy = null;
let lastSpawnTime = 0;
const spawnInterval = 2000;
let bullets = [];

let gameStarted = false;
let gameOver = false;

let duck;
let mindduck;
let playerSprite;
let bulletSprite;

let startTime;

function preload() {
  duck = loadImage('artdev/duck.gif');
  mindduck = loadImage('artdev/mindduck.gif');
  playerSprite = loadImage('artdev/gun.gif');
  bulletSprite = loadImage('artdev/bullet.png')
}

function setup() {
  createCanvas(1000, 700);
  player = new Player(width / 2, height - 75);
}

function draw() {
  background(255);

  if (gameStarted && !gameOver) {
    seconds = Math.floor((millis() - startTime) / 1000);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Time: " + seconds, 10, 10);
  }
  
  if (!gameStarted) {
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press space to start", width / 2, height / 2);
  }

  if (gameOver) {
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    text("Press R to restart", width / 2, height / 2 + 50);
    text("Time: " + seconds, width / 2, height / 2 + 100);

    if (keyIsDown(82)) {
      player = new Player(width / 2, height - 75);
      enemy = [];
      bullets = [];
      controlledEnemy = null;
      lastSpawnTime = 0;
      gameStarted = false;
      gameOver = false;
    }
  }

  fill(0);
  rect(0, height - 50, height * 3, 2);

  player.handleInput();
  player.update();
  player.display();

  if (millis() - lastSpawnTime > spawnInterval) {
    enemy.push(new Enemy());
    lastSpawnTime = millis();
  }

  for (let i = enemy.length - 1; i >= 0; i--) {
    enemy[i].update();
    enemy[i].display();
    if (enemy[i].x < -50) {
      enemy.splice(i, 1);
    }
    
    if (controlledEnemy === enemy[i]) {
      enemy[i].handleControl();
      player.x = enemy[i].x;
    }
  }
  
  if (controlledEnemy && !gameOver) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      let bullet = bullets[i];
      if (bullet.x <= player.x + 50 && bullet.x + 50 >= player.x && bullet.y <= player.y + 50 && bullet.y + 50 >= player.y) {
        gameOver = true;
        enemy.splice(enemy.indexOf(controlledEnemy), 1);
        controlledEnemy = null;
        break;
      }
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    if (bullets[i].x < 0) {
      bullets.splice(i, 1);
    }
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.jumpHeight = 200;
    this.jumpForce = 15; 
    this.gravity = 0.5;
    this.isJumping = false;
    this.haveJumped = false;
    this.jumpLength = 0;
    this.rotationAngle = 0.0;
    this.direction = 0;
    this.isControllingEnemy = false;
    this.horizontalSpeed = -1;
    this.sprite = playerSprite;
    this.isFlipped = false;
  }

  handleInput() {
    if (keyIsDown(32) && !this.isJumping && this.y >= height - 75 && !gameOver) {
      this.isJumping = true;
      
      if(!gameStarted) {
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
      enemy.splice(enemy.indexOf(controlledEnemy), 1);
      controlledEnemy = null;
      this.isControllingEnemy = false;
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
  
    if (this.x <= 0 || this.x >= width) {
      gameOver = true;
    }
  
    for (let i = enemy.length - 1; i >= 0; i--) {

      if (this.y <= enemy[i].y + 50 && this.y + 50 >= enemy[i].y && this.x <= enemy[i].x + 50 && this.x + 50 >= enemy[i].x) {
        if (this.isJumping) {
          controlledEnemy = enemy[i];
          this.isControllingEnemy = true;
  
          if(this.isControllingEnemy) {
            enemy[i].changeSprite(mindduck);
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
      this.jumpForce = 15;

      if (this.rotationAngle < 0 && !this.isControllingEnemy) {
        this.rotationAngle = 2;
        gameOver = true;
      } else if (this.rotationAngle > 0 && !this.isControllingEnemy) {
        this.rotationAngle = -2;
        gameOver = true;
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
}


class Enemy {
  constructor() {
    this.x = width;
    this.y = height - 160;
    this.speed = random(1, 3);
    this.gif = duck;
    this.scaleFactor = 1.0;
    this.isFlipped = false;
    this.lastShotTime = 0;
  }

  update() {
    this.x -= this.speed;

    if (millis() - this.lastShotTime > 3000) {
      this.shoot();
      this.lastShotTime = millis();
    }
  }

  display() {
    push();
    translate(this.x + this.gif.width / 2, this.y + this.gif.height / 2);
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
    if (!enemy.includes(this)) {
      return;
    }

    this.speed = 0;

    if (keyIsDown(81)) { // Touche Q
      this.x -= 5;
      this.isFlipped = false;
    }
    if (keyIsDown(68)) { // Touche D
      this.x += 5;
      this.isFlipped = true;
    }
  }

  shoot() {
    if (this !== controlledEnemy) {
      if (controlledEnemy && abs(controlledEnemy.x - this.x) > 200) {
        let bullet = new Bullet(this.x + 55, this.y + 80);
        bullets.push(bullet);
      }
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
  }

  update() {
    this.x -= this.speed;
    this.y += random(-0.5, 0.5);
  }

  display() {
    image(bulletSprite, this.x, this.y, 100, 100);
  }
}

