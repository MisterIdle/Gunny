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

let music;

let backgroundImgDesert;
let backgroundImgSummer;

function preload() {
  akaquak = loadImage('img/akaquak.gif');
  mindduck = loadImage('img/mindduck.gif');
  croco_nard = loadImage('img/croco_nard.gif');
  playerSprite = loadImage('img/gun.gif');
  bulletSprite = loadImage('img/bullet.png');

  pixelArtFont = loadFont('font/font.ttf');

  backgroundImgDesert = loadImage('img/backgrounddesert.png');
  backgroundImgSummer = loadImage('img/backgroundsummer.png');

  jumpSound = loadSound('sound/jump.wav');
  deathSound = loadSound('sound/death.wav');
  shootSound = loadSound('sound/shoot.wav');
  shootenemySound = loadSound('sound/shootenemy.wav');
  hurtSound = loadSound('sound/hurt.wav');
  mindSound = loadSound('sound/mind.wav');

  music = loadSound('sound/music.mp3');
}

function displayTimer() {
  fill(255);
  seconds = Math.floor((millis() - startTime) / 1000);
  textSize(24);
  textAlign(LEFT, TOP);
  switch (selectedTheme) {
    case SelectedTheme.DESERT:
      if(seconds < bestSeconds) {
        fill(255);
      } else {
        fill(0, 255, 0);
      }
      text("Time: " + seconds, 10, 10);
      break;

    case SelectedTheme.SUMMER:
      if(seconds < bestSeconds) {
        fill(255);
      } else {
        fill(0, 255, 0);
      }
      text("Time: " + seconds, 10, 10);
      break;

    case SelectedTheme.DEV:
      if(seconds < bestSeconds) {
        fill(0);
      } else {
        fill(0, 150, 0);
      }
      text("Time: " + seconds, 10, 10);
      break;
  }
}

function displayStartMessage() {
  fill(0, 0, 0, 255);
  textFont(pixelArtFont);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Press space to start", width / 2, height / 2);
}

function displayGameOver() {
  fill(200, 0, 0, 255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("G a m e   O v e r", width / 2, height / 2 - 10);
  textSize(24);
  text("Press R to restart", width / 2, height / 2 + 50);

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

function displayGround() {
  switch (selectedTheme) {
    case SelectedTheme.DESERT:
      fill(238,194,160);
      rect(0, height - 50, width, 75);
      noStroke();
      break;
    case SelectedTheme.SUMMER:
      fill(90,190,49,255)
      rect(0, height - 50, width, 75);
      noStroke();
      break;
    case SelectedTheme.DEV:
      fill(0);
      rect(0, height - 45, width, 2);
      break;
  }
}

function updateAndDisplayEnemies() {
  if (millis() - lastSpawnTime > random(SPAWN_INTERVAL, SPAWN_INTERVAL + 4000)) {
    enemies.push(new Enemy());
    lastSpawnTime = millis();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();

    if (enemies[i].x < -100) {
      enemies.splice(i, 1);
    } else if (controlledEnemy && controlledEnemy === enemies[i] && controlledEnemy.x < -100) {
      enemies.splice(i, 1);
      controlledEnemy = null;
      player.isControllingEnemy = false;
      gameState = GameState.OVER;
    }

    if (controlledEnemy === enemies[i] && !controlledEnemy.isJumping) {
      player.x = enemies[i].x;
    }
  }
}

function updateAndDisplayBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    if (player.collidesWithBullet(bullets[i])) {
      bullets.splice(i, 1);
      controlledEnemy.isJumping = true;
      gameState = GameState.OVER;

      setTimeout(() => {
        enemies.splice(enemies.indexOf(controlledEnemy), 1);
      }, 800);
    }
  }

  for (let i = playerBullets.length - 1; i >= 0; i--) {
    playerBullets[i].update();
    playerBullets[i].display();

    for (let j = enemies.length - 1; j >= 0; j--) {
      if (enemies[j].collidesWithBullet(playerBullets[i])) {
        enemies[j].isJumping = true;
        playerBullets.splice(i, 1);
        hurtSound.play();
        bullets = [];

        setTimeout(() => {
          enemies.splice(j, 1);
        }, 800);
      }
    }
  }
}