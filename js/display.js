let playerSprite;
let bulletSprite;
let akaquak;
let mindduck;
let croco_nard;
let pixelArtFont;

let backgroundImgDesert;
let backgroundImgSummer;

function preload() {
  akaquak = loadImage('img/akaquak.gif');
  mindduck = loadImage('img/mindduck.gif');
  croco_nard = loadImage('img/croco_nard.gif');
  playerSprite = loadImage('img/gun.gif');
  bulletSprite = loadImage('img/bullet.png');
  pixelArtFont = loadFont('font/Daydream.ttf');
  backgroundImgDesert = loadImage('img/backgrounddesert.png');
  backgroundImgSummer = loadImage('img/backgroundsummer.png');
}

function displayTimer() {
  fill(255);
  seconds = Math.floor((millis() - startTime) / 1000);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Time: " + seconds, 10, 10);
  textAlign(RIGHT, TOP);
  text("Distance: " + scoreDistance, 10,10)
}

function displayStartMessage() {
  fill(0, 0, 0, 200);
  textFont(pixelArtFont);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Press space to start", width / 2, height / 2);
}

function displayGameOver() {
  fill(255, 0, 0, 200);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("G a m e   O v e r", width / 2, height / 2 - 100);
  textSize(20)
  text("Living Time: " + seconds, width / 2, height / 2 - 45);
  text("Ennemies captured: "+ scoreCapture, width / 2, height / 2 - 10)
  text("Distance: " + scoreDistance, width / 2, height / 2 + 25)
  textSize(20);
  text("Press R to restart", width / 2, height / 2 + 100 );
}

function displayGround() {
  switch (selectedTheme) {
    case SelectedTheme.DESERT:
      fill(238,194,160);
      beginShape();
      stroke(238,194,160);
      vertex(0, height);
      vertex(0, height - 50);
      for (let i = 0; i < width; i += 50) {
        vertex(i, height - 50 + random(-2, 5));
      }
      endShape(CLOSE);
    
      rect(0, height - 50, width, 50);
    case SelectedTheme.SUMMER:
      fill(107,160,20);
      beginShape();
      stroke(107,160,20);
      vertex(0, height);
      vertex(0, height - 50);
      for (let i = 0; i < width; i += 50) {
        vertex(i, height - 50 + random(-2, 5));
      }
      endShape(CLOSE);
    
      rect(0, height - 50, width, 50);
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
        bullets = [];

        setTimeout(() => {
          enemies.splice(j, 1);
        }, 800);
      }
    }
  }
}