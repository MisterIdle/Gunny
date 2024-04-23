////////////////////////////////
// Code by Alexy (MisterIdle) //
////////////////////////////////

// Constants defining enemy properties
const ENEMY_START_X = GAME_WIDTH - 20; 
const ENEMY_START_Y = GAME_HEIGHT - 130;
const ENEMY_SPEED_MIN = 1;
const ENEMY_SPEED_MAX = 3;
const ENEMY_SHOOT_INTERVAL = 2000;
const SPAWN_INTERVAL = 2700;

// Arrays to store enemies and last spawn time
let enemies = [];
let lastSpawnTime = 0;

// Variable to track controlled enemy
let controlledEnemy = null;

// Class representing an enemy
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
      this.isJumping = false; // Jump = Death animation
      this.jumpForce = 4;
  }
  
  // Update enemy position and behavior
  update() {
      this.x -= this.speed;
      // If enemy is jumping, apply jump mechanics
      if (this.isJumping) {
          this.jump();
      }
      // If it's time for enemy to shoot and it's not jumping, shoot
      if (millis() - this.timeSinceSpawn > this.initialShotDelay && millis() - this.lastShotTime > random(ENEMY_SHOOT_INTERVAL, ENEMY_SHOOT_INTERVAL + 1000) && !this.isJumping) {
          this.shoot();
          this.lastShotTime = millis();
      }
  }

  // Implement jump mechanics
  jump() {
      this.x += this.speed;
      this.y -= this.jumpForce;
      this.jumpForce -= GRAVITY;
  }
  
  // Display enemy on the screen
  display() {
      if (this.gif) {
          push(); // Save current drawing settings
          translate(this.x + this.gif.width / 3, this.y + this.gif.height / 3);
          if (this.isFlipped) {
              scale(-1, 1);
          }
          if(this.isJumping) {
              rotate(radians(30));
          }
          stroke(255);
          strokeWeight(2);
          imageMode(CENTER);
          image(this.gif, 0, 0, 100, 100);
          pop(); // Restore previous drawing settings
      }
  }

  // Change enemy sprite
  changeSprite(sprite) {
      this.gif = sprite;
      this.isCrocoNard = true;
  }
  
  // Check collision with player bullets
  collidesWithBullet(playerBullet) {
      if (playerBullet) {
          return this.x <= playerBullet.x + 20 && this.x + 0 >= playerBullet.x &&
                 this.y <= playerBullet.y + 100 && this.y + 100 >= playerBullet.y;
      }
  }
  
  // Implement enemy shooting behavior
  shoot() {
      if (gameState !== GameState.OVER) {
          if (this !== controlledEnemy && controlledEnemy && abs(controlledEnemy.x - this.x) > 10) {
              let bullet = new Bullet(this.x + 30, this.y + 57);
              shootenemySound.play();
              bullets.push(bullet);
          }
      }
  }
}
