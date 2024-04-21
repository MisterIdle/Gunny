let playerSprite;
let bulletSprite;
let akaquak;
let mindduck;
let croco_nard;

function preload() {
  akaquak = loadImage('artdev/akaquak.gif');
  mindduck = loadImage('artdev/mindduck.gif');
  croco_nard = loadImage('artdev/croco_nard.gif');
  playerSprite = loadImage('artdev/gun.gif');
  bulletSprite = loadImage('artdev/bullet.png');
}

function displayTimer() {
  seconds = Math.floor((millis() - startTime) / 1000);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Time: " + seconds, 10, 10);
}

function displayStartMessage() {
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Press space to start", width / 2, height / 2);
}

function displayGameOver() {
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 100);
  text("Press R to restart", width / 2, height / 2 - 10);
  text("Time: " + seconds, width / 2, height / 2 - 50);
}

function displayGround() {
  fill(0);
  rect(0, height - 50, width, 2);
}

function updateAndDisplayEnemies() {
  if (millis() - lastSpawnTime > random(SPAWN_INTERVAL, SPAWN_INTERVAL + 4000)) {
    enemies.push(new Enemy());
    lastSpawnTime = millis();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();

    if (enemies[i].x < -50) {
      enemies.splice(i, 1);
    } else if (controlledEnemy && controlledEnemy === enemies[i] && controlledEnemy.x < -50) {
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