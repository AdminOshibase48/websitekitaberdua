// Game State
const gameState = {
    running: false,
    player: {
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        speed: 4,
        color: '#4e54c8',
        charType: 'player'
    },
    memories: [],
    obstacles: [],
    collectedMemories: [],
    steps: 0,
    health: 3,
    totalMemories: 8,
    currentMemory: null,
    keys: {}
};

// Memory data - disesuaikan dengan kenangan pribadi
const memoriesData = [
    {
        id: 1,
        title: "Pertama Kali Bertemu",
        description: "Hari itu di kafe yang ramai, pertama kali kita berbicara dan langsung merasa cocok.",
        date: "15/03/2023",
        icon: "fas fa-coffee",
        color: "#8B4513"
    },
    {
        id: 2,
        title: "Film Pertama Bersama",
        description: "Kita menonton film sci-fi dan saling berdebat tentang plotnya sepanjang jalan pulang.",
        date: "30/03/2023",
        icon: "fas fa-film",
        color: "#FF6B6B"
    },
    {
        id: 3,
        title: "Liburan ke Pantai",
        description: "Matahari terbenam yang indah, ombak yang tenang, dan tawa kita yang menggema.",
        date: "12/05/2023",
        icon: "fas fa-umbrella-beach",
        color: "#4ECDC4"
    },
    {
        id: 4,
        title: "Ulang Tahun Pertama",
        description: "Kamu membuatkan kue coklat dan memberikan hadiah yang sangat personal.",
        date: "22/06/2023",
        icon: "fas fa-birthday-cake",
        color: "#FFD166"
    },
    {
        id: 5,
        title: "Konser Musik",
        description: "Bernyanyi bersama di antara kerumunan, momen yang begitu hidup dan berenergi.",
        date: "10/08/2023",
        icon: "fas fa-music",
        color: "#9D4EDD"
    },
    {
        id: 6,
        title: "Masak Bersama",
        description: "Percobaan membuat pasta dari resep nenekmu yang berakhir dengan makanan enak dan dapur berantakan.",
        date: "05/09/2023",
        icon: "fas fa-utensils",
        color: "#06D6A0"
    },
    {
        id: 7,
        title: "Hujan Deras",
        description: "Terjebak hujan bersama dan berlari mencari tempat berteduh sambil tertawa.",
        date: "18/10/2023",
        icon: "fas fa-cloud-rain",
        color: "#118AB2"
    },
    {
        id: 8,
        title: "Momen Spesial",
        description: "Saat kamu mengatakan tiga kata ajaib yang membuat hatiku melompat kegirangan.",
        date: "14/02/2024",
        icon: "fas fa-heart",
        color: "#EF476F"
    }
];

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const hintBtn = document.getElementById('hint-btn');
const memoryDisplay = document.getElementById('memoryDisplay');
const closeMemoryBtn = document.getElementById('close-memory');
const inventoryItems = document.getElementById('inventoryItems');
const memoriesCollectedEl = document.getElementById('memories-collected');
const totalMemoriesEl = document.getElementById('total-memories');
const stepsEl = document.getElementById('steps');
const healthEl = document.getElementById('health');
const memoryImage = document.getElementById('memoryImage');
const memoryTitle = document.getElementById('memoryTitle');
const memoryDescription = document.getElementById('memoryDescription');
const memoryDate = document.getElementById('memoryDate');
const characterOptions = document.querySelectorAll('.char-option');
const bgMusic = document.getElementById('bgMusic');
const collectSound = document.getElementById('collectSound');
const stepSound = document.getElementById('stepSound');

// Inisialisasi Game
function initGame() {
    gameState.running = true;
    gameState.player.x = 100;
    gameState.player.y = 100;
    gameState.memories = [];
    gameState.obstacles = [];
    gameState.collectedMemories = [];
    gameState.steps = 0;
    gameState.health = 3;
    
    // Set karakter yang dipilih
    const selectedChar = document.querySelector('.char-option.selected').getAttribute('data-char');
    gameState.player.charType = selectedChar;
    gameState.player.color = selectedChar === 'player' ? '#4e54c8' : '#ff6b9d';
    
    // Buat memori
    createMemories();
    
    // Buat obstacle
    createObstacles();
    
    // Update UI
    updateUI();
    
    // Sembunyikan overlay
    startOverlay.style.display = 'none';
    
    // Mulai game loop
    gameLoop();
    
    // Mulai musik
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Autoplay diblokir, klik untuk memulai musik"));
}

// Buat memori di posisi acak
function createMemories() {
    gameState.memories = [];
    
    for (let i = 0; i < memoriesData.length; i++) {
        const memory = memoriesData[i];
        
        // Cari posisi yang tidak bertabrakan dengan yang lain
        let pos, collision;
        do {
            collision = false;
            pos = {
                x: Math.floor(Math.random() * (canvas.width - 40)) + 20,
                y: Math.floor(Math.random() * (canvas.height - 40)) + 20,
                width: 24,
                height: 24,
                id: memory.id,
                data: memory
            };
            
            // Cek tabrakan dengan memori lain
            for (let otherMem of gameState.memories) {
                if (checkCollision(pos, otherMem)) {
                    collision = true;
                    break;
                }
            }
            
            // Cek tabrakan dengan pemain
            if (checkCollision(pos, gameState.player)) {
                collision = true;
            }
            
            // Cek tabrakan dengan obstacle
            for (let obstacle of gameState.obstacles) {
                if (checkCollision(pos, obstacle)) {
                    collision = true;
                    break;
                }
            }
            
        } while (collision);
        
        gameState.memories.push(pos);
    }
    
    totalMemoriesEl.textContent = memoriesData.length;
}

// Buat obstacle
function createObstacles() {
    gameState.obstacles = [];
    
    // Tambahkan beberapa obstacle di posisi acak
    for (let i = 0; i < 10; i++) {
        gameState.obstacles.push({
            x: Math.floor(Math.random() * (canvas.width - 60)) + 30,
            y: Math.floor(Math.random() * (canvas.height - 60)) + 30,
            width: 40,
            height: 40
        });
    }
    
    // Tambahkan obstacle di tepi
    for (let i = 0; i < canvas.width; i += 40) {
        gameState.obstacles.push({x: i, y: 0, width: 40, height: 20});
        gameState.obstacles.push({x: i, y: canvas.height - 20, width: 40, height: 20});
    }
    
    for (let i = 0; i < canvas.height; i += 40) {
        gameState.obstacles.push({x: 0, y: i, width: 20, height: 40});
        gameState.obstacles.push({x: canvas.width - 20, y: i, width: 20, height: 40});
    }
}

// Cek tabrakan antara dua objek
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Update UI
function updateUI() {
    memoriesCollectedEl.textContent = gameState.collectedMemories.length;
    stepsEl.textContent = gameState.steps;
    
    // Update health display
    let healthHTML = '';
    for (let i = 0; i < 3; i++) {
        healthHTML += i < gameState.health ? '❤️' : '♡';
    }
    healthEl.innerHTML = healthHTML;
    
    // Update inventory
    updateInventory();
}

// Update inventory display
function updateInventory() {
    if (gameState.collectedMemories.length === 0) {
        inventoryItems.innerHTML = '<p class="empty-inventory">Belum ada kenangan yang dikumpulkan. Mulai petualangan!</p>';
        return;
    }
    
    inventoryItems.innerHTML = '';
    gameState.collectedMemories.forEach(memoryId => {
        const memory = memoriesData.find(m => m.id === memoryId);
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.innerHTML = `
            <i class="${memory.icon}" style="color: ${memory.color};"></i>
            <div class="item-name">${memory.title.substring(0, 10)}...</div>
        `;
        itemEl.addEventListener('click', () => showMemory(memory));
        inventoryItems.appendChild(itemEl);
    });
}

// Tampilkan memori
function showMemory(memory) {
    memoryDisplay.style.display = 'block';
    memoryTitle.textContent = memory.title;
    memoryDescription.textContent = memory.description;
    memoryDate.textContent = `Tanggal: ${memory.date}`;
    
    // Kosongkan gambar dan buat placeholder
    memoryImage.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.flexDirection = 'column';
    placeholder.style.gap = '10px';
    placeholder.innerHTML = `
        <i class="${memory.icon}" style="font-size: 4rem; color: ${memory.color};"></i>
        <p style="color: #a9e4ff; text-align: center;">Gambar kenangan spesial<br>${memory.title}</p>
    `;
    memoryImage.appendChild(placeholder);
    
    // Tambahkan efek visual
    memoryDisplay.classList.add('pulse');
    setTimeout(() => memoryDisplay.classList.remove('pulse'), 500);
}

// Game loop
function gameLoop() {
    if (!gameState.running) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background dengan grid pixel 8-bit
    drawBackground();
    
    // Draw obstacles
    drawObstacles();
    
    // Draw memories
    drawMemories();
    
    // Update player position
    updatePlayer();
    
    // Draw player
    drawPlayer();
    
    // Check collisions
    checkCollisions();
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Gambar background dengan grid
function drawBackground() {
    // Background utama
    ctx.fillStyle = '#162447';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid pixel
    ctx.strokeStyle = 'rgba(78, 84, 200, 0.1)';
    ctx.lineWidth = 1;
    
    // Grid horizontal
    for (let y = 0; y < canvas.height; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Grid vertikal
    for (let x = 0; x < canvas.width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Efek cahaya di tengah
    const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, 300
    );
    gradient.addColorStop(0, 'rgba(255, 209, 102, 0.05)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Gambar obstacle
function drawObstacles() {
    gameState.obstacles.forEach(obstacle => {
        // Pixelated obstacle
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Detail obstacle
        ctx.fillStyle = '#B22222';
        for (let i = 0; i < obstacle.width; i += 8) {
            for (let j = 0; j < obstacle.height; j += 8) {
                if ((i + j) % 16 === 0) {
                    ctx.fillRect(obstacle.x + i, obstacle.y + j, 4, 4);
                }
            }
        }
        
        // Border
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Gambar memori
function drawMemories() {
    gameState.memories.forEach(memory => {
        const memData = memory.data;
        
        // Outer circle
        ctx.fillStyle = memData.color;
        ctx.beginPath();
        ctx.arc(memory.x + memory.width/2, memory.y + memory.height/2, memory.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(memory.x + memory.width/2, memory.y + memory.height/2, memory.width/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Detail pixel
        ctx.fillStyle = memData.color;
        ctx.fillRect(memory.x + memory.width/2 - 2, memory.y + memory.height/2 - 2, 4, 4);
        
        // Efek berkelap-kelip
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 3) * 2;
        ctx.shadowColor = memData.color;
        ctx.shadowBlur = 10 + pulse;
        ctx.beginPath();
        ctx.arc(memory.x + memory.width/2, memory.y + memory.height/2, memory.width/2 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`M${memory.id}`, memory.x + memory.width/2, memory.y + memory.height + 15);
    });
}

// Update posisi pemain berdasarkan input
function updatePlayer() {
    let moved = false;
    const prevX = gameState.player.x;
    const prevY = gameState.player.y;
    
    if (gameState.keys['ArrowUp'] || gameState.keys['w'] || gameState.keys['W']) {
        gameState.player.y -= gameState.player.speed;
        moved = true;
    }
    if (gameState.keys['ArrowDown'] || gameState.keys['s'] || gameState.keys['S']) {
        gameState.player.y += gameState.player.speed;
        moved = true;
    }
    if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) {
        gameState.player.x -= gameState.player.speed;
        moved = true;
    }
    if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) {
        gameState.player.x += gameState.player.speed;
        moved = true;
    }
    
    // Batasi pemain di dalam canvas
    if (gameState.player.x < 20) gameState.player.x = 20;
    if (gameState.player.x + gameState.player.width > canvas.width - 20) gameState.player.x = canvas.width - 20 - gameState.player.width;
    if (gameState.player.y < 20) gameState.player.y = 20;
    if (gameState.player.y + gameState.player.height > canvas.height - 20) gameState.player.y = canvas.height - 20 - gameState.player.height;
    
    // Cek tabrakan dengan obstacle
    for (let obstacle of gameState.obstacles) {
        if (checkCollision(gameState.player, obstacle)) {
            gameState.player.x = prevX;
            gameState.player.y = prevY;
            
            // Kurangi kesehatan
            if (moved) {
                gameState.health--;
                updateUI();
                
                // Cek game over
                if (gameState.health <= 0) {
                    gameOver();
                }
            }
            break;
        }
    }
    
    // Hitung langkah
    if (moved && (prevX !== gameState.player.x || prevY !== gameState.player.y)) {
        gameState.steps++;
        updateUI();
        
        // Mainkan suara langkah
        stepSound.currentTime = 0;
        stepSound.volume = 0.1;
        stepSound.play().catch(e => console.log("Sound error"));
    }
}

// Gambar pemain
function drawPlayer() {
    const player = gameState.player;
    
    // Body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Detail pixel untuk efek 8-bit
    ctx.fillStyle = '#FFFFFF';
    
    // Mata
    if (player.charType === 'player') {
        // Karakter biasa
        ctx.fillRect(player.x + 8, player.y + 8, 4, 4);
        ctx.fillRect(player.x + 20, player.y + 8, 4, 4);
        
        // Senyum
        ctx.fillRect(player.x + 10, player.y + 20, 12, 4);
    } else {
        // Karakter putri
        ctx.fillStyle = '#FFD166';
        ctx.fillRect(player.x, player.y - 5, player.width, 5);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(player.x + 6, player.y + 8, 4, 4);
        ctx.fillRect(player.x + 22, player.y + 8, 4, 4);
        
        // Mata yang lebih besar
        ctx.fillRect(player.x + 10, player.y + 18, 3, 3);
        ctx.fillRect(player.x + 19, player.y + 18, 3, 3);
    }
    
    // Border
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    
    // Shadow
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 15;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
}

// Cek tabrakan dengan memori
function checkCollisions() {
    for (let i = gameState.memories.length - 1; i >= 0; i--) {
        const memory = gameState.memories[i];
        
        if (checkCollision(gameState.player, memory)) {
            // Kumpulkan memori
            gameState.collectedMemories.push(memory.id);
            
            // Tampilkan memori
            showMemory(memory.data);
            
            // Hapus dari dunia game
            gameState.memories.splice(i, 1);
            
            // Update UI
            updateUI();
            
            // Mainkan suara
            collectSound.currentTime = 0;
            collectSound.volume = 0.3;
            collectSound.play().catch(e => console.log("Sound error"));
            
            // Cek apakah semua memori telah dikumpulkan
            if (gameState.collectedMemories.length === memoriesData.length) {
                victory();
            }
        }
    }
}

// Game over
function gameOver() {
    gameState.running = false;
    
    // Tampilkan layar game over
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <h2>GAME OVER</h2>
        <p>Karaktermu kehilangan semua nyawa...</p>
        <p>Tapi cinta tidak pernah mati!</p>
        <button id="restart-btn" class="btn start-btn"><i class="fas fa-redo"></i> Coba Lagi</button>
    `;
    
    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.appendChild(overlay);
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        canvasContainer.removeChild(overlay);
        initGame();
    });
    
    // Hentikan musik
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

// Victory
function victory() {
    gameState.running = false;
    
    // Tampilkan layar kemenangan
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <h2>PETUALANGAN SELESAI!</h2>
        <p>Selamat! Kamu telah mengumpulkan semua kenangan indah.</p>
        <p>Cinta kalian akan terus bertumbuh seiring waktu...</p>
        <div style="font-size: 4rem; margin: 20px 0;">❤️🎉✨</div>
        <p>Langkah: ${gameState.steps} | Kenangan: ${gameState.collectedMemories.length}</p>
        <button id="restart-btn" class="btn start-btn"><i class="fas fa-redo"></i> Main Lagi</button>
    `;
    
    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.appendChild(overlay);
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        canvasContainer.removeChild(overlay);
        initGame();
    });
    
    // Hentikan musik
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

// Event Listeners
startBtn.addEventListener('click', initGame);

resetBtn.addEventListener('click', () => {
    if (confirm("Mulai ulang petualangan? Semua progres akan hilang.")) {
        initGame();
    }
});

hintBtn.addEventListener('click', () => {
    alert("Petunjuk: Gerakkan karakter menggunakan tombol WASD atau panah untuk mengumpulkan semua item kenangan. Hindari area merah (rintangan) agar tidak kehilangan nyawa. Setiap kenangan yang dikumpulkan akan menampilkan pesan spesial!");
});

closeMemoryBtn.addEventListener('click', () => {
    memoryDisplay.style.display = 'none';
});

// Pilih karakter
characterOptions.forEach(option => {
    option.addEventListener('click', () => {
        characterOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Keyboard input
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
    
    // Space untuk membuka/tutup memory display
    if (e.key === ' ' && gameState.currentMemory) {
        if (memoryDisplay.style.display === 'block') {
            memoryDisplay.style.display = 'none';
        } else {
            showMemory(gameState.currentMemory);
        }
    }
    
    // M untuk musik
    if (e.key === 'm' || e.key === 'M') {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

// Touch controls untuk mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    
    // Reset semua keys
    gameState.keys['ArrowUp'] = false;
    gameState.keys['ArrowDown'] = false;
    gameState.keys['ArrowLeft'] = false;
    gameState.keys['ArrowRight'] = false;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    
    if (!touchStartX || !touchStartY) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const dx = touchX - touchStartX;
    const dy = touchY - touchStartY;
    
    // Reset semua keys
    gameState.keys['ArrowUp'] = false;
    gameState.keys['ArrowDown'] = false;
    gameState.keys['ArrowLeft'] = false;
    gameState.keys['ArrowRight'] = false;
    
    // Tentukan arah berdasarkan pergeseran terbesar
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            gameState.keys['ArrowRight'] = true;
        } else {
            gameState.keys['ArrowLeft'] = true;
        }
    } else {
        if (dy > 0) {
            gameState.keys['ArrowDown'] = true;
        } else {
            gameState.keys['ArrowUp'] = true;
        }
    }
    
    // Update titik awal untuk perhitungan selanjutnya
    touchStartX = touchX;
    touchStartY = touchY;
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    
    // Reset semua keys
    gameState.keys['ArrowUp'] = false;
    gameState.keys['ArrowDown'] = false;
    gameState.keys['ArrowLeft'] = false;
    gameState.keys['ArrowRight'] = false;
    
    touchStartX = 0;
    touchStartY = 0;
});

// Inisialisasi awal
updateUI();

// Mulai musik dengan interaksi pengguna
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Autoplay diblokir"));
    }
}, { once: true });
