let player;
let squares = [];
let lastSpawnTime = 0;
const spawnInterval = 5000;

function setup() {
  createCanvas(1000, 700);
  player = new Player(width / 2, height - 75);
}

function draw() {
  background(255);
  
  fill(0);
  rect(0, height - 50, height * 3, 2);

  player.handleInput();
  player.update();
  player.display();

  if (millis() - lastSpawnTime > spawnInterval) {
    squares.push(new Enemy());
    lastSpawnTime = millis();
  }

  for (let i = squares.length - 1; i >= 0; i--) {
    squares[i].update();
    squares[i].display();
    if (squares[i].x < -50) {
      squares.splice(i, 1);
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
  }

  handleInput() {
    if (keyIsDown(32) && !this.isJumping && this.y >= height - 75) {
      this.isJumping = true; 
    }

    if (mouseX < this.x && !this.haveJumped) {
      this.direction = -this.jumpLength;
    } else if (mouseX > this.x && !this.haveJumped) {
      this.direction = this.jumpLength;
    }

    let distanceX = mouseX - this.x;
    this.jumpLength = map(abs(distanceX), 0, width, 0, 10);
  }

  update() {
    if (this.isJumping) {
      this.haveJumped = true;
      this.jump();

      this.x += this.direction;
      this.x = constrain(this.x, 0, width);

      if (this.direction < 0) {
        this.rotationAngle -= 2;
      } else if (this.direction > 0) {
        this.rotationAngle += 2;
      }
    }

    if (this.y < height - 75) {
      this.y += this.gravity;
    }
    
    this.x += this.horizontalSpeed;
    this.horizontalSpeed -= 0.0001;
    
    this.horizontalSpeed = constrain(this.horizontalSpeed, -3, 3);
    text(this.horizontalSpeed, 10, 10);
    
    // Check for collision with enemies
    for (let i = squares.length - 1; i >= 0; i--) {
      if (this.y <= squares[i].y + 50 && this.y + 50 >= squares[i].y && this.x <= squares[i].x + 50 && this.x + 50 >= squares[i].x) {
        if (this.isJumping) {
          squares[i].turnGreen(); // Turn the enemy green if jumped on
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

      if (this.rotationAngle < 0) {
        this.rotationAngle = 2;
      } else if (this.rotationAngle > 0) {
        this.rotationAngle = -2;
      }

      this.isJumping = false;
      this.haveJumped = false;
    }
  }

  display() {
    fill(0);
    rectMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotationAngle));
    rect(0, 0, 50, 50);
    pop();
  }
}

class Enemy {
  constructor() {
    this.x = width;
    this.y = height - 75;
    this.speed = random(1, 3);
    this.isGreen = false; // Flag to track if the enemy is green
  }

  update() {
    this.x -= this.speed;
  }

  display() {
    if (this.isGreen) {
      fill(0, 255, 0); // Green color if flag is true
    } else {
      fill(255, 0, 0);
    }
    rect(this.x, this.y, 50, 50);
  }
  
  // Method to turn the enemy green
  turnGreen() {
    this.isGreen = true;
  }
}
