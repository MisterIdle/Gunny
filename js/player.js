const PLAYER_START_X = GAME_WIDTH / 4;
const PLAYER_START_Y = GAME_HEIGHT - 60;

let player;

class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.jumpForce = JUMP_FORCE;
      this.gravity = GRAVITY;
      this.isJumping = false;
      this.haveJumped = false;
      this.jumpLength = 0;
      this.rotationAngle = 0.0;
      this.direction = 0;
      this.isControllingEnemy = false;
      this.sprite = playerSprite;
      this.isFlipped = false;
      this.controlledEnemy = null;
      this.lastShootTime = 0;
      this.shootDelay = 2000;
      this.isShooting = false;
    }
  
    handleInput() {
      if (gameState === GameState.OVER) {
        return;
      }
  
      if (keyIsDown(32) && gameState !== GameState.OVER) {
        this.isJumping = true;
        
        if (this.isJumping && !this.haveJumped && this.y === height - 75) {
          jumpSound.play();
        }
  
        if (gameState === GameState.NOT_STARTED) {
          startTime = millis();
        }
  
        gameState = GameState.STARTED;
      }
  
      if (keyIsDown(69) && !this.isShooting && millis() - this.lastShootTime > this.shootDelay && this.isControllingEnemy) {
        this.shoot();
        shootSound.play();
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
      this.jumpLength = map(abs(distanceX), 0, width, 0, 12);
  
      if (keyIsDown(32) && this.isControllingEnemy) {
        this.isControllingEnemy = false;
        this.controlledEnemy.isJumping = true;
        this.controlledEnemy = null;
  
        setTimeout(() => {enemies = enemies.filter(enemy => enemy !== controlledEnemy); }, 800);
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
      if (this.x > 0 && this.isJumping) {
        scoreDistance ++;
      } else if (this.x < 0 && this.isJumping) {
        scoreDistance --;
      }
  
      if (this.y < height - 75) {
        this.y += this.gravity;
      }
  
      if (this.x < -40 || this.x > width) {
        gameState = GameState.OVER;
      }
  
      for (let i = enemies.length - 1; i >= 0; i--) {
        if (this.collidesWithEnemy(enemies[i])) {
          if (this.isJumping && !this.isControllingEnemy && !this.controlledEnemy && !enemies[i].isCrocoNard) {
            this.controlledEnemy = enemies[i];
            controlledEnemy = enemies[i];
            this.isControllingEnemy = true;
  
            if (this.isControllingEnemy) {
              enemies[i].changeSprite(mindduck);
              mindSound.play();
              scoreCapture ++;
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
            gameState = GameState.OVER;
          } else if (this.rotationAngle > 0) {
            gameState = GameState.OVER;
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
      return this.x <= bullet.x + 20 && this.x + 70 >= bullet.x &&
             this.y <= bullet.y + 20 && this.y + 20 >= bullet.y;
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
