// ==================== MINI GAME: TANGKAP KOIN ====================
let gameState = {
    isPlaying: false,
    coinsCaught: 0,
    timeLeft: 30,
    gameInterval: null,
    coinInterval: null,
    characterPosition: 50, // percentage
    coinPosition: { x: 50, y: 0 },
    coinSpeed: 2
};

// Game elements
const gameElements = {
    gamePopup: document.getElementById('gamePopup'),
    gameCharacter: document.getElementById('gameCharacter'),
    fallingCoin: document.getElementById('fallingCoin'),
    gameCoins: document.getElementById('gameCoins'),
    gameTime: document.getElementById('gameTime'),
    gameResult: document.getElementById('gameResult'),
    startGameBtn: document.getElementById('startGameBtn')
};

function openGame() {
    resetGame();
    gameElements.gamePopup.classList.add('active');
}

function closeGame() {
    gameElements.gamePopup.classList.remove('active');
    stopGame();
}

function startGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    gameState.coinsCaught = 0;
    gameState.timeLeft = 30;
    gameState.coinSpeed = 2;
    
    // Update UI
    gameElements.startGameBtn.innerHTML = '<i class="fas fa-pause"></i> Sedang Main';
    gameElements.startGameBtn.disabled = true;
    gameElements.gameResult.classList.remove('show');
    
    // Start game loop
    gameState.gameInterval = setInterval(updateGame, 1000);
    gameState.coinInterval = setInterval(moveCoin, 50);
    
    // Spawn first coin
    spawnCoin();
}

function stopGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.gameInterval);
    clearInterval(gameState.coinInterval);
    
    gameElements.startGameBtn.innerHTML = '<i class="fas fa-play"></i> Mulai Game';
    gameElements.startGameBtn.disabled = false;
}

function resetGame() {
    stopGame();
    gameState.coinsCaught = 0;
    gameState.timeLeft = 30;
    gameState.characterPosition = 50;
    gameState.coinPosition = { x: 50, y: 0 };
    
    updateGameUI();
    gameElements.gameCharacter.style.left = '50%';
    gameElements.fallingCoin.style.left = '50%';
    gameElements.fallingCoin.style.top = '-50px';
    gameElements.gameResult.classList.remove('show');
}

function updateGame() {
    if (!gameState.isPlaying) return;
    
    // Update time
    gameState.timeLeft--;
    updateGameUI();
    
    // Check game end conditions
    if (gameState.timeLeft <= 0) {
        endGame(false); // Time's up
    } else if (gameState.coinsCaught >= 10) {
        endGame(true); // Win!
    }
    
    // Increase difficulty
    if (gameState.timeLeft === 20) gameState.coinSpeed = 2.5;
    if (gameState.timeLeft === 10) gameState.coinSpeed = 3;
}

function updateGameUI() {
    gameElements.gameCoins.textContent = gameState.coinsCaught;
    gameElements.gameTime.textContent = gameState.timeLeft;
}

function spawnCoin() {
    if (!gameState.isPlaying) return;
    
    gameState.coinPosition = {
        x: Math.random() * 80 + 10, // 10-90%
        y: 0
    };
    
    gameElements.fallingCoin.style.left = gameState.coinPosition.x + '%';
    gameElements.fallingCoin.style.top = '-50px';
}

function moveCoin() {
    if (!gameState.isPlaying) return;
    
    // Move coin down
    gameState.coinPosition.y += gameState.coinSpeed;
    gameElements.fallingCoin.style.top = (gameState.coinPosition.y - 50) + 'px';
    
    // Check collision
    checkCollision();
    
    // Respawn coin if out of bounds
    if (gameState.coinPosition.y > 350) {
        spawnCoin();
    }
}

function checkCollision() {
    // Character hitbox: 80px wide, 100px tall at bottom
    const charLeft = gameState.characterPosition - 4; // 4% margin
    const charRight = gameState.characterPosition + 4;
    const charBottom = 100; // Bottom of game area
    
    // Coin hitbox
    const coinX = gameState.coinPosition.x;
    const coinY = gameState.coinPosition.y;
    
    // Check if coin is near character
    if (coinY >= charBottom - 20 && coinY <= charBottom + 10) {
        if (coinX >= charLeft && coinX <= charRight) {
            // Caught the coin!
            catchCoin();
        }
    }
}

function catchCoin() {
    gameState.coinsCaught++;
    updateGameUI();
    
    // Visual feedback
    gameElements.fallingCoin.style.animation = 'none';
    setTimeout(() => {
        gameElements.fallingCoin.style.animation = '';
        spawnCoin();
    }, 100);
    
    // Play sound effect (if supported)
    playCoinSound();
}

function playCoinSound() {
    // Simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log("Audio not supported");
    }
}

function endGame(isWin) {
    stopGame();
    
    let resultHTML = '';
    let coinsEarned = 0;
    
    if (isWin) {
        coinsEarned = 15; // Base reward for winning
        resultHTML = `
            <h3 style="color: var(--success);">🎉 MENANG! 🎉</h3>
            <p>Kamu menangkap ${gameState.coinsCaught} koin!</p>
            <div style="font-size: 2rem; color: var(--gold); margin: 15px 0;">
                +${coinsEarned} 🪙
            </div>
            <p>Hadiah koin sudah ditambahkan!</p>
            <button class="btn-primary" onclick="playAgain()">
                <i class="fas fa-redo"></i> Main Lagi
            </button>
        `;
    } else {
        // Partial reward based on performance
        coinsEarned = Math.floor(gameState.coinsCaught * 1.5);
        resultHTML = `
            <h3 style="color: var(--warning);">⏰ Waktu Habis!</h3>
            <p>Kamu menangkap ${gameState.coinsCaught} koin.</p>
            <div style="font-size: 2rem; color: var(--gold); margin: 15px 0;">
                +${coinsEarned} 🪙
            </div>
            <p>Coba lagi untuk dapat lebih banyak!</p>
            <button class="btn-primary" onclick="playAgain()">
                <i class="fas fa-redo"></i> Coba Lagi
            </button>
        `;
    }
    
    // Add coins to player
    if (typeof addCoins === 'function') {
        addCoins(coinsEarned);
    }
    
    gameElements.gameResult.innerHTML = resultHTML;
    gameElements.gameResult.classList.add('show');
}

function playAgain() {
    resetGame();
    startGame();
}

// ==================== CONTROLS ====================
function moveLeft() {
    if (!gameState.isPlaying) return;
    
    gameState.characterPosition = Math.max(10, gameState.characterPosition - 10);
    gameElements.gameCharacter.style.left = gameState.characterPosition + '%';
}

function moveRight() {
    if (!gameState.isPlaying) return;
    
    gameState.characterPosition = Math.min(90, gameState.characterPosition + 10);
    gameElements.gameCharacter.style.left = gameState.characterPosition + '%';
}

// Keyboard controls for desktop
document.addEventListener('keydown', (e) => {
    if (!gameState.isPlaying) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
    }
});

// Touch controls for mobile
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    if (!gameState.isPlaying) return;
    
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!gameState.isPlaying) return;
    
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;
    
    if (Math.abs(deltaX) > 10) {
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
        touchStartX = touchX;
    }
}, { passive: false });

// ==================== GAME INITIALIZATION ====================
// Make functions globally available for HTML onclick
window.openGame = openGame;
window.closeGame = closeGame;
window.startGame = startGame;
window.moveLeft = moveLeft;
window.moveRight = moveRight;
window.playAgain = playAgain;

// Shop functions
window.openShop = openShop;
window.closeShop = closeShop;
window.buyAccessory = buyAccessory;
window.equipAccessory = equipAccessory;
window.unequipAccessory = unequipAccessory;

// Other UI functions
window.closeTutorial = closeTutorial;
window.showHelp = showHelp;
window.changePetName = changePetName;
