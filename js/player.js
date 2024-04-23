////////////////////////////////
// Code by Alexy (MisterIdle) //
////////////////////////////////

// Constants defining player properties
const PLAYER_START_X = GAME_WIDTH / 4;
const PLAYER_START_Y = GAME_HEIGHT - 75;

// Class representing the player
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

  // Method to handle player input
  handleInput() {
    // Check if the game state is not over
    if (gameState === GameState.OVER) {
      return;
    }
    
    // Handle jump input
    if (keyIsDown(32) && gameState !== GameState.OVER) {
      this.isJumping = true;
      
      // Play jump sound if conditions are met
      if (this.isJumping && !this.haveJumped && this.y === height - 75) {
        jumpSound.play();
      }
  
      gameState = GameState.STARTED;
    }
  
    // Handle shoot input
    if (keyIsDown(69) && !this.isShooting && millis() - this.lastShootTime > this.shootDelay && this.isControllingEnemy) {
      this.shoot();
      shootSound.play();
      this.isShooting = true;
      this.lastShootTime = millis();
      setTimeout(() => { this.isShooting = false; }, 2000);
    }
  
    // Determine player direction based on mouse position
    if (mouseX < this.x && !this.haveJumped) {
      this.direction = -this.jumpLength;
      this.isFlipped = false;
    } else if (mouseX > this.x && !this.haveJumped) {
      this.direction = this.jumpLength;
      this.isFlipped = true;
    }
  
    // Calculate jump length based on mouse position
    let distanceX = mouseX - this.x;
    this.jumpLength = abs(distanceX) / 60;
  
    // Release controlled enemy if jump button is pressed again
    if (keyIsDown(32) && this.isControllingEnemy) {
      this.isControllingEnemy = false;
      this.controlledEnemy.isJumping = true;
      this.controlledEnemy = null;
  
      setTimeout(() => {enemies = enemies.filter(enemy => enemy !== controlledEnemy); }, 800);
    }
  }
  
  // Method to update player position and behavior
  update() {
    // Update player position during jump
    if (this.isJumping) {
      this.haveJumped = true;
      this.jump();
  
      this.x += this.direction;
      this.x = constrain(this.x, 0, width);
  
      if (this.y < height - 75) {
        this.rotationAngle += 12;
      }
    }
    
    // Update distance traveled if player is jumping
    if (this.x > 0 && this.isJumping) {
      scoreDistance ++;
    } else if (this.x < 0 && this.isJumping) {
      scoreDistance --;
    }
  
    // Apply gravity if player is in the air
    if (this.y < height - 75) {
      this.y += this.gravity;
    }
  
    // End game if player goes out of bounds
    if (this.x < -40 || this.x > width) {
      gameState = GameState.OVER;
    }
  
    // Check collision with enemies and handle enemy control
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (this.collidesWithEnemy(enemies[i])) {
        if (this.isJumping && !this.isControllingEnemy && !this.controlledEnemy && !enemies[i].isCrocoNard) {
          this.controlledEnemy = enemies[i];
          controlledEnemy = enemies[i];
          this.isControllingEnemy = true;
  
          if (this.isControllingEnemy) {
            enemies[i].changeSprite(mindduck);
            mindSound.play();
            scoreCapture++;
          }
        }
      }
    }
  }
  
  // Method to handle player jump
  jump() {
    this.y -= this.jumpForce;
    this.jumpForce -= this.gravity;

    // Reset jump parameters when landing
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
  
  // Method to display the player
  display() {
    // Display player sprite
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
  
  // Method to check collision with enemies
  collidesWithEnemy(enemy) {
    return this.x <= enemy.x + 100 && this.x + 20 >= enemy.x &&
           this.y <= enemy.y + 100 && this.y + 20 >= enemy.y;
  }
  
  // Method to check collision with bullets
  collidesWithBullet(bullet) {
    return this.x <= bullet.x + 20 && this.x + 70 >= bullet.x &&
           this.y <= bullet.y + 20 && this.y + 20 >= bullet.y;
  }
  
  // Method to handle player shooting
  shoot() {
    // Stop controlled enemy movement and shoot
    this.controlledEnemy.speed = 0;
    this.controlledEnemy.isFlipped = true;
  
    // Create player bullet and add it to the array
    let bullet = new PlayerBullet(this.x + 100, this.y);
    playerBullets.push(bullet);
  
    // Restore enemy movement after delay
    setTimeout(() => {
      this.controlledEnemy.isFlipped = false;
      this.controlledEnemy.speed = random(ENEMY_SPEED_MIN, ENEMY_SPEED_MAX);
    }, 500);
  }
}
