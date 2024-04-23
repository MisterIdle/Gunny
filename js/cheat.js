////////////////////////////////
// Code by Alexy (MisterIdle) //
////////////////////////////////

// Function called when a key is pressed
function keyPressed() {
    if (key === 'c' && gameState === GameState.NOT_STARTED) {
        const userInput = prompt("Cheat: \n\nType 'clearScore' to reset all scores.");
        if (userInput !== null) {
            if(userInput === "clearScore") {
                resetScore();
            }
        } else {
            console.log("User canceled.");
        }
    }
}

// Function to reset all scores
function resetScore() {
    // Reset all score variables to 0
    bestSeconds = 0;
    bestScoreCapture = 0;
    bestScoreDistance = 0;
    // Update cookies with the new scores
    setCookie("bestSeconds", bestSeconds);
    setCookie("bestScoreCapture", bestScoreCapture);
    setCookie("bestScoreDistance", bestScoreDistance);
}
