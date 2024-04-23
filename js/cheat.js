function keyPressed() {
    if (key === 'c' && gameState === GameState.NOT_STARTED) {
        const userInput = prompt("Cheat: \n\nType 'clearScore' to reset all scores.");
        
        if (userInput !== null) {
            if(userInput === "clearScore") {
                resetScore();
            }
        } else {
            console.log("L'utilisateur a annulé.");
        }
    }
  }

function resetScore() {
    bestSeconds = 0;
    bestScoreCapture = 0;
    bestScoreDistance = 0;
    setCookie("bestSeconds", bestSeconds);
    setCookie("bestScoreCapture", bestScoreCapture);
    setCookie("bestScoreDistance", bestScoreDistance);
}