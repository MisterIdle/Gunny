////////////////////////////////
// Code by Alexy (MisterIdle) //
////////////////////////////////

// Variables to hold images and sounds
let playerSprite;
let bulletSprite;
let akaquak;
let mindduck;
let croco_nard;
let pixelArtFont;

let jumpSound;
let deathSound;
let shootSound;
let shootenemySound;
let hurtSound;
let mindSound;
let bestscoreSound;

let music;

// Background images
let backgroundImgDesert;
let backgroundImgSummer;

// Flag to track if the best score has been achieved
let bestScoreAchieved = false;

// Preload function to load assets before setup
function preload() {
    // Load images
    akaquak = loadImage('img/akaquak.gif');
    mindduck = loadImage('img/mindduck.gif');
    croco_nard = loadImage('img/croco_nard.gif');
    playerSprite = loadImage('img/gun.gif');
    bulletSprite = loadImage('img/bullet.png');

    // Load font
    pixelArtFont = loadFont('font/font.ttf');

    // Load background images
    backgroundImgDesert = loadImage('img/backgrounddesert.png');
    backgroundImgSummer = loadImage('img/backgroundsummer.png');

    // Load sounds
    jumpSound = loadSound('sound/jump.wav');
    deathSound = loadSound('sound/death.wav');
    shootSound = loadSound('sound/shoot.wav');
    shootenemySound = loadSound('sound/shootenemy.wav');
    hurtSound = loadSound('sound/hurt.wav');
    mindSound = loadSound('sound/mind.wav');
    bestscoreSound = loadSound('sound/bestscore.wav');

    // Load music
    music = loadSound('sound/music.mp3');
}

// Function to display timer
function displayTimer() {
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  // Choose text color based on theme
  switch (selectedTheme) {
      case SelectedTheme.DESERT:
          if(seconds < bestSeconds) {
              fill(255);
          } else {
              fill(0, 255, 0);
          }
          break;
      case SelectedTheme.SUMMER:
          if(seconds < bestSeconds) {
              fill(255);
          } else {
              fill(0, 255, 0);
          }
          break;
      case SelectedTheme.DEV:
          if(seconds < bestSeconds) {
              fill(0);
          } else {
              fill(0, 150, 0);
          }
          break;
  }
  // Display time
  text("Time: " + seconds, 10, 10);
  // Check for best score
  checkBestScore();
}

// Function to display start message
function displayStartMessage() {
    // Display message to start the game
    fill(0, 0, 0, 255);
    textFont(pixelArtFont);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press space to start", width / 2, height / 2);
}

// Function to display game over message
function displayGameOver() {
    // Display game over message
    fill(200, 0, 0, 255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("G a m e   O v e r", width / 2, height / 2 - 10);
    textSize(24);
    text("Press R to restart", width / 2, height / 2 + 50);
    // Display scores
    textSize(20)
    textAlign(LEFT, CENTER)
    switch (selectedTheme) {
        case SelectedTheme.DESERT:
            fill(255);
            break;
        case SelectedTheme.SUMMER:
            fill(255);
            break;
        case SelectedTheme.DEV:
            fill(0);
            break;
    }
    text("Enemies captured:  "+ scoreCapture + " / " + bestScoreCapture, width / 2 - 540, height / 2 - 180)
    text("Distance:  " + scoreDistance + "m / " + bestScoreDistance + "m", width / 2 - 540, height / 2 - 140)
    text("Living Time:  " + seconds + " / " + bestSeconds, width / 2 - 540 , height / 2 - 100 )
}

// Function to display ground based on selected theme
function displayGround() {
    switch (selectedTheme) {
        case SelectedTheme.DESERT:
            fill(238,194,160);
            rect(0, height - 55, width, 100);
            noStroke();
            break;
        case SelectedTheme.SUMMER:
            fill(90,190,49,255)
            rect(0, height - 55, width, 75);
            noStroke();
            break;
        case SelectedTheme.DEV:
            fill(0);
            rect(0, height - 45, width, 2);
            break;
    }
}

// Function to update and display enemies
function updateAndDisplayEnemies() {
    // Spawn enemies at intervals
    if (millis() - lastSpawnTime > random(SPAWN_INTERVAL, SPAWN_INTERVAL + 4000)) {
        enemies.push(new Enemy());
        lastSpawnTime = millis();
    }
    // Update and display each enemy
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].display();
        // Remove enemies that go off-screen
        if (enemies[i].x < -100) {
            enemies.splice(i, 1);
        } else if (controlledEnemy && controlledEnemy === enemies[i] && controlledEnemy.x < -100) {
            enemies.splice(i, 1);
            controlledEnemy = null;
            player.isControllingEnemy = false;
            gameState = GameState.OVER;
        }
        // Control player position if riding an enemy
        if (controlledEnemy === enemies[i] && !controlledEnemy.isJumping) {
            player.x = enemies[i].x;
        }
    }
}

// Function to update and display bullets
function updateAndDisplayBullets() {
    // Update and display bullets fired by enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].display();
        // Remove bullets if they hit the player
        if (player.collidesWithBullet(bullets[i])) {
            bullets.splice(i, 1);
            controlledEnemy.isJumping = true;
            gameState = GameState.OVER;
            // Remove controlled enemy after a delay
            setTimeout(() => {
                enemies.splice(enemies.indexOf(controlledEnemy), 1);
            }, 800);
        }
    }
    // Update and display bullets fired by the player
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].update();
        playerBullets[i].display();
        // Check for collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (enemies[j].collidesWithBullet(playerBullets[i])) {
                enemies[j].isJumping = true;
                playerBullets.splice(i, 1);
                hurtSound.play();
                bullets = [];
                // Remove enemy after a delay
                setTimeout(() => {
                    enemies.splice(j, 1);
                }, 800);
            }
        }
    }
}

// Function to check for best score
function checkBestScore() {
    // If current time matches best time and it hasn't been achieved yet, play best score sound
    if (seconds === bestSeconds && !bestScoreAchieved) {
        bestscoreSound.play();
        bestScoreAchieved = true;
    }
}
