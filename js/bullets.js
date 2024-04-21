const BULLET_SPEED = 7;
const BULLET_PLAYER_SPEED = 10;

let bullets = [];
let playerBullets = [];


class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = BULLET_SPEED;
    }
  
    update() {
      if (gameState !== GameState.OVER) {
        this.x -= this.speed;
      }
    }
  
    display() {
      if (gameState !== GameState.OVER) {
        image(bulletSprite, this.x, this.y, 100, 100);
      }
    }
}
  
class PlayerBullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = BULLET_PLAYER_SPEED;
    }
  
    update() {
      if (gameState !== GameState.OVER) {
        this.x += this.speed;
      }
    }
  
    display() {
      if (gameState !== GameState.OVER) {
        image(bulletSprite, this.x, this.y, 100, 100);
      }
    }
}
