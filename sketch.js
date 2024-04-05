let player;

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