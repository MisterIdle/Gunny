const ENEMY_START_X = GAME_WIDTH - 20;
const ENEMY_START_Y = GAME_HEIGHT - 130;
const ENEMY_SPEED_MIN = 1;
const ENEMY_SPEED_MAX = 3;
const ENEMY_SHOOT_INTERVAL = 3000;
const SPAWN_INTERVAL = 3000;

let enemies = [];
let lastSpawnTime = 0;
let controlledEnemy = null;

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

        stroke(255);
        strokeWeight(2);
  
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
      if (gameState !== GameState.OVER) {
        if (this !== controlledEnemy && controlledEnemy && abs(controlledEnemy.x - this.x) > 10) {
          let bullet = new Bullet(this.x + 30, this.y + 57);
          bullets.push(bullet);
        }
      }
    }
}
  