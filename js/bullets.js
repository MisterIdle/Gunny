////////////////////////////////
// Code by Alexy (MisterIdle) //
////////////////////////////////

// Definition of bullet speed for enemies and the player
const BULLET_SPEED = 7;
const BULLET_PLAYER_SPEED = 10;

// Arrays to store bullets for enemies and the player
let bullets = [];
let playerBullets = [];

// Class to represent a bullet fired by an enemy
class Bullet {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = BULLET_SPEED; 
  }

  // Update the position of the bullet
  update() {
      if (gameState !== GameState.OVER) {
          this.x -= this.speed;
      }
  }

  // Display the bullet
  display() {
      if (gameState !== GameState.OVER) {
          image(bulletSprite, this.x, this.y, 100, 100);
      }
  }
}

// Class to represent a bullet fired by the player
class PlayerBullet {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = BULLET_PLAYER_SPEED;
  }

  // Update the position of the player bullet
  update() {
      if (gameState !== GameState.OVER) {
          this.x += this.speed;
      }
  }
  
  // Display the player bullet
  display() {
      if (gameState !== GameState.OVER) {
          image(bulletSprite, this.x, this.y, 100, 100); 
      }
  }
}
