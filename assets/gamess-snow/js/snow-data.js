// ==================== GAME DATA ====================
const gameData = {
    // State utama
    pet: {
        name: "Snow",
        hunger: 75,
        happiness: 80,
        energy: 70,
        health: 90,
        level: 1,
        age: 1,
        xp: 0,
        isSleeping: false,
        lastSave: null,
        coins: 0,
        lastDaily: null,
        equippedAccessories: {
            hat: null,
            glasses: null,
            neck: null
        },
        ownedAccessories: []
    },
    
    // Pesan-pesan
    messages: [
        "Halo! Aku Snow, senang bertemu denganmu! ❄️",
        "Aku lapar nih, kasih makan dong!",
        "Yey! Makasih makanannya, enak banget!",
        "Aku senang banget dielus seperti ini!",
        "Wah, asyik nih diajak main!",
        "Hmm... aku ngantuk nih, bolehin tidur?",
        "Aku sudah istirahat, sekarang segar lagi!",
        "Kamu pemilik yang baik banget! Aku sayang kamu!",
        "Aku sehat dan bahagia karena kamu merawatku!",
        "Jangan lupa ajak aku main ya nanti!",
        "Aku seperti salju yang lembut!",
        "Dingin tapi hati hangat!",
        "Aku suka musim dingin!",
        "Main salju yuk!",
        "Jaga aku agar tetap sehat ya!"
    ],
    
    // Data aksesoris
    accessories: [
        // Topi (hats)
        { id: 'hat1', name: 'Topi Santa', type: 'hat', price: 50, icon: '🎅', rarity: 'common' },
        { id: 'hat2', name: 'Topi Peri', type: 'hat', price: 100, icon: '🧚', rarity: 'uncommon' },
        { id: 'hat3', name: 'Mahkota Es', type: 'hat', price: 200, icon: '👑', rarity: 'rare' },
        { id: 'hat4', name: 'Topi Astronot', type: 'hat', price: 300, icon: '🧑‍🚀', rarity: 'epic' },
        { id: 'hat5', name: 'Topi Sihir', type: 'hat', price: 500, icon: '🧙', rarity: 'legendary' },
        
        // Kacamata (glasses)
        { id: 'glasses1', name: 'Kacamata Hitam', type: 'glasses', price: 40, icon: '😎', rarity: 'common' },
        { id: 'glasses2', name: 'Kacamata 3D', type: 'glasses', price: 80, icon: '🥽', rarity: 'uncommon' },
        { id: 'glasses3', name: 'Kacamata Bintang', type: 'glasses', price: 150, icon: '🔭', rarity: 'rare' },
        { id: 'glasses4', name: 'Kacamata Futuristik', type: 'glasses', price: 250, icon: '🤖', rarity: 'epic' },
        
        // Aksesoris Leher (neck)
        { id: 'neck1', name: 'Kalung Salju', type: 'neck', price: 30, icon: '❄️', rarity: 'common' },
        { id: 'neck2', name: 'Dasi Kupu-kupu', type: 'neck', price: 60, icon: '🎀', rarity: 'uncommon' },
        { id: 'neck3', name: 'Kalung Berlian', type: 'neck', price: 120, icon: '💎', rarity: 'rare' },
        { id: 'neck4', name: 'Kalung Ajaib', type: 'neck', price: 180, icon: '🔮', rarity: 'epic' },
        
        // Aksesoris Spesial (unlock berdasarkan level)
        { id: 'special1', name: 'Sayap Malaikat', type: 'special', price: 400, icon: '👼', rarity: 'legendary', unlockLevel: 5 },
        { id: 'special2', name: 'Pedang Cahaya', type: 'special', price: 600, icon: '⚔️', rarity: 'legendary', unlockLevel: 10 }
    ],
    
    // Coin rewards untuk setiap aksi
    coinRewards: {
        feed: 2,
        pet: 3,
        play: 5,
        sleep: 4,
        medicine: 1,
        daily: [10, 20, 30, 50], // Hadiah harian (semakin lama streak, semakin besar)
        game: 15 // Koin dari mini game
    },
    
    // XP requirements per level
    xpPerLevel: [
        0,    // Level 1
        100,  // Level 2
        250,  // Level 3
        450,  // Level 4
        700,  // Level 5
        1000, // Level 6
        1350, // Level 7
        1750, // Level 8
        2200, // Level 9
        2700  // Level 10
    ],
    
    // Save data version
    version: "1.1.0"
};

// ==================== CACHE DOM ELEMENTS ====================
const elements = {
    // Status bars
    hungerBar: document.getElementById('hungerBar'),
    happinessBar: document.getElementById('happinessBar'),
    energyBar: document.getElementById('energyBar'),
    healthBar: document.getElementById('healthBar'),
    
    // Status values
    hungerValue: document.getElementById('hungerValue'),
    happinessValue: document.getElementById('happinessValue'),
    energyValue: document.getElementById('energyValue'),
    healthValue: document.getElementById('healthValue'),
    
    // Level info
    levelValue: document.getElementById('levelValue'),
    ageValue: document.getElementById('ageValue'),
    xpValue: document.getElementById('xpValue'),
    
    // Coin displays
    coinAmount: document.getElementById('coinAmount'),
    shopCoinAmount: document.getElementById('shopCoinAmount'),
    
    // Messages
    petMessage: document.getElementById('petMessage'),
    warningMessage: document.getElementById('warningMessage'),
    saveMessage: document.getElementById('saveMessage'),
    
    // Pet elements
    petName: document.getElementById('petName'),
    mouth: document.getElementById('mouth'),
    leftPupil: document.getElementById('leftPupil'),
    rightPupil: document.getElementById('rightPupil'),
    
    // Accessory slots
    hatSlot: document.getElementById('hatSlot'),
    glassesSlot: document.getElementById('glassesSlot'),
    neckSlot: document.getElementById('neckSlot'),
    currentAccessories: document.getElementById('currentAccessories'),
    
    // Buttons
    feedButton: document.getElementById('feedButton'),
    petButton: document.getElementById('petButton'),
    playButton: document.getElementById('playButton'),
    sleepButton: document.getElementById('sleepButton'),
    medicineButton: document.getElementById('medicineButton'),
    dailyButton: document.getElementById('dailyButton'),
    saveButton: document.getElementById('saveButton'),
    loadButton: document.getElementById('loadButton'),
    
    // Popups
    tutorialPopup: document.getElementById('tutorialPopup'),
    shopPopup: document.getElementById('shopPopup'),
    gamePopup: document.getElementById('gamePopup'),
    shopItems: document.getElementById('shopItems')
};

// ==================== UTILITY FUNCTIONS ====================
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.style.color = isError ? 'var(--danger)' : 'var(--success)';
    
    if (!isError) {
        setTimeout(() => {
            element.textContent = '';
        }, 3000);
    }
}

function addCoins(amount) {
    gameData.pet.coins += amount;
    updateCoinDisplay();
    
    // Show coin gain animation
    showCoinGain(amount);
    return amount;
}

function showCoinGain(amount) {
    const coinGain = document.createElement('div');
    coinGain.className = 'coin-gain';
    coinGain.textContent = `+${amount} 🪙`;
    coinGain.style.left = '50%';
    coinGain.style.top = '50%';
    coinGain.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(coinGain);
    
    setTimeout(() => {
        coinGain.remove();
    }, 800);
}

function updateCoinDisplay() {
    elements.coinAmount.textContent = gameData.pet.coins;
    elements.shopCoinAmount.textContent = gameData.pet.coins;
}

// ==================== PET STATUS SYSTEM ====================
function updateStatusDisplay() {
    // Update progress bars
    elements.hungerBar.style.width = gameData.pet.hunger + '%';
    elements.happinessBar.style.width = gameData.pet.happiness + '%';
    elements.energyBar.style.width = gameData.pet.energy + '%';
    elements.healthBar.style.width = gameData.pet.health + '%';
    
    // Update values
    elements.hungerValue.textContent = gameData.pet.hunger + '%';
    elements.happinessValue.textContent = gameData.pet.happiness + '%';
    elements.energyValue.textContent = gameData.pet.energy + '%';
    elements.healthValue.textContent = gameData.pet.health + '%';
    
    // Update level info
    elements.levelValue.textContent = gameData.pet.level;
    elements.ageValue.textContent = gameData.pet.age;
    elements.xpValue.textContent = gameData.pet.xp;
    
    // Update health bar color
    if (gameData.pet.health <= 30) {
        elements.healthBar.classList.add('health-critical');
    } else {
        elements.healthBar.classList.remove('health-critical');
    }
    
    // Update facial expression
    updatePetExpression();
    
    // Check warnings
    checkPetStatus();
    
    // Auto-save
    autoSave();
}

function updatePetExpression() {
    // Mouth expression based on happiness
    if (gameData.pet.happiness >= 70) {
        elements.mouth.style.borderBottom = '8px solid var(--primary-blue)';
        elements.mouth.style.borderRadius = '0 0 50px 50px';
        elements.mouth.style.height = '25px';
        elements.mouth.style.width = '50px';
    } else if (gameData.pet.happiness >= 40) {
        elements.mouth.style.borderBottom = '5px solid var(--primary-blue)';
        elements.mouth.style.borderRadius = '0';
        elements.mouth.style.height = '5px';
        elements.mouth.style.width = '40px';
    } else {
        elements.mouth.style.borderBottom = '8px solid var(--primary-blue)';
        elements.mouth.style.borderRadius = '50px 50px 0 0';
        elements.mouth.style.height = '25px';
        elements.mouth.style.width = '50px';
    }
    
    // Eye position based on energy
    if (gameData.pet.energy >= 60) {
        elements.leftPupil.style.top = '12px';
        elements.rightPupil.style.top = '12px';
    } else if (gameData.pet.energy >= 30) {
        elements.leftPupil.style.top = '20px';
        elements.rightPupil.style.top = '20px';
    } else {
        elements.leftPupil.style.top = '25px';
        elements.rightPupil.style.top = '25px';
    }
}

function checkPetStatus() {
    let warning = '';
    
    if (gameData.pet.health <= 20) {
        warning = '🚨 CRITICAL! Snow sakit parah! Kasih obat!';
    } else if (gameData.pet.hunger <= 20) {
        warning = '⚠️ Snow sangat lapar! Kasih makan!';
    } else if (gameData.pet.happiness <= 20) {
        warning = '😢 Snow sedih! Elus atau ajak main!';
    } else if (gameData.pet.energy <= 20) {
        warning = '😴 Snow lelah! Tidurkan dulu!';
    } else if (gameData.pet.health <= 50) {
        warning = '🤒 Snow kurang sehat! Rawat baik-baik!';
    }
    
    elements.warningMessage.textContent = warning;
}

function showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * gameData.messages.length);
    elements.petMessage.textContent = gameData.messages[randomIndex];
    
    // Color effect
    const colors = ['#4da6ff', '#66ccff', '#3399ff', '#1a8cff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    elements.petMessage.style.borderLeftColor = randomColor;
    
    setTimeout(() => {
        elements.petMessage.style.borderLeftColor = '#4da6ff';
    }, 2000);
}

// ==================== PET ACTIONS ====================
function feedPet() {
    if (gameData.pet.isSleeping) {
        elements.petMessage.textContent = "Zzz... Snow sedang tidur!";
        return;
    }
    
    // Increase hunger
    gameData.pet.hunger = clamp(gameData.pet.hunger + 25, 0, 100);
    // Slight energy cost
    gameData.pet.energy = clamp(gameData.pet.energy - 3, 0, 100);
    // Happiness boost
    gameData.pet.happiness = clamp(gameData.pet.happiness + 5, 0, 100);
    
    // Health boost if not too full
    if (gameData.pet.hunger < 80) {
        gameData.pet.health = clamp(gameData.pet.health + 1, 0, 100);
    }
    
    // XP gain
    gameData.pet.xp += 10;
    checkLevelUp();
    
    // Coin reward
    const coinsEarned = addCoins(gameData.coinRewards.feed);
    
    // Message
    elements.petMessage.textContent = `Yummy! Makasih makanannya! +${coinsEarned} 🪙`;
    
    updateStatusDisplay();
}

function petPet() {
    if (gameData.pet.isSleeping) {
        elements.petMessage.textContent = "Zzz... Snow sedang tidur!";
        return;
    }
    
    // Happiness boost
    gameData.pet.happiness = clamp(gameData.pet.happiness + 20, 0, 100);
    // Small energy cost
    gameData.pet.energy = clamp(gameData.pet.energy - 2, 0, 100);
    
    // Health boost if very happy
    if (gameData.pet.happiness > 70) {
        gameData.pet.health = clamp(gameData.pet.health + 2, 0, 100);
    }
    
    // XP gain
    gameData.pet.xp += 8;
    checkLevelUp();
    
    // Coin reward
    const coinsEarned = addCoins(gameData.coinRewards.pet);
    
    // Message
    elements.petMessage.textContent = `Awww... Aku senang banget! +${coinsEarned} 🪙`;
    
    updateStatusDisplay();
}

function playWithPet() {
    if (gameData.pet.isSleeping) {
        elements.petMessage.textContent = "Zzz... Snow masih mengantuk!";
        return;
    }
    
    if (gameData.pet.energy < 15) {
        elements.petMessage.textContent = "Aku capek banget, nggak bisa main dulu!";
        return;
    }
    
    // Happiness boost
    gameData.pet.happiness = clamp(gameData.pet.happiness + 15, 0, 100);
    // Energy cost
    gameData.pet.energy = clamp(gameData.pet.energy - 20, 0, 100);
    // Hunger increase
    gameData.pet.hunger = clamp(gameData.pet.hunger - 8, 0, 100);
    
    // Health boost if conditions are good
    if (gameData.pet.happiness > 60 && gameData.pet.energy > 30) {
        gameData.pet.health = clamp(gameData.pet.health + 1, 0, 100);
    }
    
    // XP gain
    gameData.pet.xp += 15;
    checkLevelUp();
    
    // Coin reward
    const coinsEarned = addCoins(gameData.coinRewards.play);
    
    // Message
    elements.petMessage.textContent = `Wah asyik banget main! +${coinsEarned} 🪙`;
    
    updateStatusDisplay();
}

function putPetToSleep() {
    if (gameData.pet.isSleeping) {
        // Wake up
        gameData.pet.isSleeping = false;
        elements.sleepButton.innerHTML = '<i class="fas fa-moon"></i><span class="button-text">Tidurkan</span>';
        elements.petMessage.textContent = "Hai! Aku sudah bangun dan segar! ☀️";
        
        // Energy recovery
        gameData.pet.energy = clamp(gameData.pet.energy + 50, 0, 100);
        // Hunger decrease
        gameData.pet.hunger = clamp(gameData.pet.hunger - 15, 0, 100);
        // Health recovery
        gameData.pet.health = clamp(gameData.pet.health + 5, 0, 100);
        
        // Age increase chance
        if (Math.random() > 0.7) {
            gameData.pet.age++;
            elements.petMessage.textContent = "Aku bertambah tua! Tapi masih semangat! 🎂";
        }
        
        // Coin reward for waking up
        const coinsEarned = addCoins(gameData.coinRewards.sleep);
        elements.petMessage.textContent += ` +${coinsEarned} 🪙`;
    } else {
        // Check if can sleep
        if (gameData.pet.energy > 40) {
            elements.petMessage.textContent = "Aku belum ngantuk banget nih!";
            return;
        }
        
        // Go to sleep
        gameData.pet.isSleeping = true;
        elements.sleepButton.innerHTML = '<i class="fas fa-sun"></i><span class="button-text">Bangunkan</span>';
        elements.petMessage.textContent = "Zzz... Aku tidur dulu. Mimpi indah! 🌙";
        
        // Sleep face
        elements.mouth.style.borderBottom = '3px solid var(--primary-blue)';
        elements.mouth.style.borderRadius = '50%';
        elements.mouth.style.height = '10px';
        elements.mouth.style.width = '30px';
        
        elements.leftPupil.style.top = '25px';
        elements.rightPupil.style.top = '25px';
    }
    
    updateStatusDisplay();
}

function giveMedicine() {
    if (gameData.pet.isSleeping) {
        elements.petMessage.textContent = "Zzz... Snow sedang tidur!";
        return;
    }
    
    if (gameData.pet.health > 70) {
        elements.petMessage.textContent = "Aku sehat-sehat saja, nggak butuh obat!";
        return;
    }
    
    // Calculate health boost
    const healthBoost = 30 - Math.floor(gameData.pet.health / 10);
    gameData.pet.health = clamp(gameData.pet.health + healthBoost, 0, 100);
    
    // Medicine isn't fun
    gameData.pet.happiness = clamp(gameData.pet.happiness - 5, 0, 100);
    gameData.pet.energy = clamp(gameData.pet.energy - 10, 0, 100);
    
    // XP for taking care
    gameData.pet.xp += 20;
    checkLevelUp();
    
    // Coin reward (small because medicine isn't fun)
    const coinsEarned = addCoins(gameData.coinRewards.medicine);
    
    // Message based on result
    if (gameData.pet.health > 80) {
        elements.petMessage.textContent = `Alhamdulillah, aku sudah merasa lebih baik! +${coinsEarned} 🪙`;
    } else {
        elements.petMessage.textContent = `Makasih obatnya... +${coinsEarned} 🪙`;
    }
    
    updateStatusDisplay();
}

function checkLevelUp() {
    const xpNeeded = gameData.xpPerLevel[gameData.pet.level] || (gameData.pet.level * 100);
    
    if (gameData.pet.xp >= xpNeeded) {
        gameData.pet.level++;
        gameData.pet.xp = gameData.pet.xp - xpNeeded;
        
        // Health bonus on level up
        gameData.pet.health = clamp(gameData.pet.health + 15, 0, 100);
        
        // Coin bonus on level up
        const levelBonus = gameData.pet.level * 10;
        addCoins(levelBonus);
        
        elements.petMessage.textContent = `Yey! Level ${gameData.pet.level}! +${levelBonus} 🪙 Bonus! 🎉`;
        
        updateStatusDisplay();
        autoSave();
    }
}

// ==================== DAILY REWARD SYSTEM ====================
function checkDailyReward() {
    const today = new Date().toDateString();
    const lastDaily = gameData.pet.lastDaily ? new Date(gameData.pet.lastDaily).toDateString() : null;
    
    if (lastDaily === today) {
        elements.dailyButton.innerHTML = '<i class="fas fa-calendar-check"></i> Sudah Ambil';
        elements.dailyButton.disabled = true;
        return false;
    }
    
    elements.dailyButton.innerHTML = '<i class="fas fa-calendar-day"></i> Hadiah Harian';
    elements.dailyButton.disabled = false;
    return true;
}

function claimDailyReward() {
    const today = new Date().toDateString();
    const lastDaily = gameData.pet.lastDaily ? new Date(gameData.pet.lastDaily).toDateString() : null;
    
    if (lastDaily === today) {
        showMessage(elements.saveMessage, "Sudah ambil hadiah hari ini!", true);
        return;
    }
    
    // Calculate streak
    let streak = 1;
    if (lastDaily) {
        const lastDate = new Date(gameData.pet.lastDaily);
        const todayDate = new Date();
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            // Consecutive day
            streak = Math.min((gameData.pet.dailyStreak || 0) + 1, 4);
        }
    }
    
    gameData.pet.dailyStreak = streak;
    gameData.pet.lastDaily = new Date().toISOString();
    
    // Get reward based on streak
    const reward = gameData.coinRewards.daily[streak - 1] || gameData.coinRewards.daily[0];
    const coinsEarned = addCoins(reward);
    
    // Show reward popup
    showDailyRewardPopup(reward, streak);
    
    // Update button
    checkDailyReward();
    autoSave();
    
    return coinsEarned;
}

function showDailyRewardPopup(reward, streak) {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay active';
    popup.innerHTML = `
        <div class="popup">
            <div class="popup-header">
                <h2><i class="fas fa-gift"></i> Hadiah Harian!</h2>
                <button class="popup-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="popup-content daily-reward">
                <p>🎉 Selamat! Streak harian: ${strek} hari! 🎉</p>
                <div class="reward-amount">+${reward} 🪙</div>
                <p>Kembali besok untuk hadiah yang lebih besar!</p>
                <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    Keren!
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

// ==================== ACCESSORY SYSTEM ====================
function updateAccessoryDisplay() {
    // Clear current accessory slots
    elements.hatSlot.innerHTML = '';
    elements.glassesSlot.innerHTML = '';
    elements.neckSlot.innerHTML = '';
    
    // Clear current accessories list
    elements.currentAccessories.innerHTML = '';
    
    // Show equipped accessories
    let hasAccessories = false;
    
    // Hat
    if (gameData.pet.equippedAccessories.hat) {
        const accessory = gameData.accessories.find(a => a.id === gameData.pet.equippedAccessories.hat);
        if (accessory) {
            elements.hatSlot.innerHTML = accessory.icon;
            elements.currentAccessories.innerHTML += `
                <div class="accessory-item">
                    ${accessory.icon} ${accessory.name}
                    <button class="btn-small" onclick="unequipAccessory('${accessory.id}')" title="Lepas">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            hasAccessories = true;
        }
    }
    
    // Glasses
    if (gameData.pet.equippedAccessories.glasses) {
        const accessory = gameData.accessories.find(a => a.id === gameData.pet.equippedAccessories.glasses);
        if (accessory) {
            elements.glassesSlot.innerHTML = accessory.icon;
            elements.currentAccessories.innerHTML += `
                <div class="accessory-item">
                    ${accessory.icon} ${accessory.name}
                    <button class="btn-small" onclick="unequipAccessory('${accessory.id}')" title="Lepas">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            hasAccessories = true;
        }
    }
    
    // Neck
    if (gameData.pet.equippedAccessories.neck) {
        const accessory = gameData.accessories.find(a => a.id === gameData.pet.equippedAccessories.neck);
        if (accessory) {
            elements.neckSlot.innerHTML = accessory.icon;
            elements.currentAccessories.innerHTML += `
                <div class="accessory-item">
                    ${accessory.icon} ${accessory.name}
                    <button class="btn-small" onclick="unequipAccessory('${accessory.id}')" title="Lepas">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            hasAccessories = true;
        }
    }
    
    if (!hasAccessories) {
        elements.currentAccessories.innerHTML = '<div class="no-accessory">Belum ada aksesoris</div>';
    }
}

function buyAccessory(accessoryId) {
    const accessory = gameData.accessories.find(a => a.id === accessoryId);
    if (!accessory) return false;
    
    // Check if already owned
    if (gameData.pet.ownedAccessories.includes(accessoryId)) {
        showMessage(elements.saveMessage, "Sudah punya aksesoris ini!", true);
        return false;
    }
    
    // Check if enough coins
    if (gameData.pet.coins < accessory.price) {
        showMessage(elements.saveMessage, "Koin tidak cukup!", true);
        return false;
    }
    
    // Check level requirement
    if (accessory.unlockLevel && gameData.pet.level < accessory.unlockLevel) {
        showMessage(elements.saveMessage, `Butuh level ${accessory.unlockLevel} untuk beli ini!`, true);
        return false;
    }
    
    // Deduct coins and add to owned
    gameData.pet.coins -= accessory.price;
    gameData.pet.ownedAccessories.push(accessoryId);
    
    // Auto-equip if slot is empty
    if (!gameData.pet.equippedAccessories[accessory.type]) {
        equipAccessory(accessoryId);
    }
    
    updateCoinDisplay();
    updateAccessoryDisplay();
    renderShopItems();
    
    showMessage(elements.saveMessage, `Berhasil beli ${accessory.name}!`);
    autoSave();
    
    return true;
}

function equipAccessory(accessoryId) {
    const accessory = gameData.accessories.find(a => a.id === accessoryId);
    if (!accessory) return false;
    
    // Check if owned
    if (!gameData.pet.ownedAccessories.includes(accessoryId)) {
        showMessage(elements.saveMessage, "Belum punya aksesoris ini!", true);
        return false;
    }
    
    // Unequip current accessory of same type if any
    if (gameData.pet.equippedAccessories[accessory.type]) {
        unequipAccessory(gameData.pet.equippedAccessories[accessory.type]);
    }
    
    // Equip new accessory
    gameData.pet.equippedAccessories[accessory.type] = accessoryId;
    
    updateAccessoryDisplay();
    renderShopItems();
    autoSave();
    
    return true;
}

function unequipAccessory(accessoryId) {
    const accessory = gameData.accessories.find(a => a.id === accessoryId);
    if (!accessory) return false;
    
    // Check if equipped
    if (gameData.pet.equippedAccessories[accessory.type] !== accessoryId) {
        return false;
    }
    
    // Unequip
    gameData.pet.equippedAccessories[accessory.type] = null;
    
    updateAccessoryDisplay();
    renderShopItems();
    autoSave();
    
    return true;
}

// ==================== SHOP SYSTEM ====================
function openShop() {
    renderShopItems();
    elements.shopPopup.classList.add('active');
}

function closeShop() {
    elements.shopPopup.classList.remove('active');
}

function renderShopItems(category = 'all') {
    if (!elements.shopItems) return;
    
    let itemsHTML = '';
    
    gameData.accessories.forEach(accessory => {
        // Filter by category
        if (category !== 'all' && accessory.type !== category) return;
        
        // Check if owned
        const isOwned = gameData.pet.ownedAccessories.includes(accessory.id);
        const isEquipped = Object.values(gameData.pet.equippedAccessories).includes(accessory.id);
        
        // Check if can buy (level requirement)
        const canBuy = !accessory.unlockLevel || gameData.pet.level >= accessory.unlockLevel;
        
        // Determine item class
        let itemClass = 'shop-item';
        if (isOwned) itemClass += ' owned';
        if (isEquipped) itemClass += ' equipped';
        
        // Rarity color
        const rarityColors = {
            common: '#808080',
            uncommon: '#1E90FF',
            rare: '#9B30FF',
            epic: '#FF4500',
            legendary: '#FFD700'
        };
        
        itemsHTML += `
            <div class="${itemClass}" style="border-color: ${rarityColors[accessory.rarity] || '#808080'};">
                <div class="item-icon">${accessory.icon}</div>
                <div class="item-name">${accessory.name}</div>
                <div class="item-rarity" style="color: ${rarityColors[accessory.rarity] || '#808080'};">
                    ${accessory.rarity.toUpperCase()}
                </div>
                <div class="item-price">
                    <i class="fas fa-coins"></i> ${accessory.price}
                </div>
                <div class="item-actions">
                    ${!isOwned ? `
                        <button class="btn-buy" onclick="buyAccessory('${accessory.id}')" 
                                ${gameData.pet.coins < accessory.price || !canBuy ? 'disabled' : ''}>
                            ${canBuy ? 'Beli' : `Lvl ${accessory.unlockLevel}`}
                        </button>
                    ` : ''}
                    
                    ${isOwned && !isEquipped ? `
                        <button class="btn-equip" onclick="equipAccessory('${accessory.id}')">
                            Pakai
                        </button>
                    ` : ''}
                    
                    ${isEquipped ? `
                        <button class="btn-unequip" onclick="unequipAccessory('${accessory.id}')">
                            Lepas
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    elements.shopItems.innerHTML = itemsHTML || '<p style="text-align: center; padding: 20px;">Tidak ada item di kategori ini.</p>';
    
    // Add category filter event listeners
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderShopItems(this.dataset.category);
        };
    });
}

// ==================== SAVE/LOAD SYSTEM ====================
function saveGame() {
    try {
        const saveData = {
            pet: gameData.pet,
            version: gameData.version,
            lastSave: new Date().toISOString()
        };
        
        localStorage.setItem('snowPetSave', JSON.stringify(saveData));
        gameData.pet.lastSave = new Date();
        
        showMessage(elements.saveMessage, "✓ Progress tersimpan!");
        return true;
    } catch (error) {
        console.error("Save error:", error);
        showMessage(elements.saveMessage, "✗ Gagal menyimpan!", true);
        return false;
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem('snowPetSave');
        
        if (!savedData) {
            // First time playing, show tutorial
            setTimeout(() => {
                elements.tutorialPopup.classList.add('active');
            }, 1000);
            return false;
        }
        
        const loadedData = JSON.parse(savedData);
        
        // Check version compatibility
        if (!loadedData.version || loadedData.version !== gameData.version) {
            // Handle version mismatch (basic migration)
            console.log("Version mismatch, attempting migration");
        }
        
        // Load pet data
        if (loadedData.pet) {
            Object.assign(gameData.pet, loadedData.pet);
        }
        
        // Update UI
        updateStatusDisplay();
        updateCoinDisplay();
        updateAccessoryDisplay();
        checkDailyReward();
        
        // Update pet name
        elements.petName.firstChild.textContent = gameData.pet.name;
        
        // Welcome back message
        if (gameData.pet.lastSave) {
            const lastSave = new Date(gameData.pet.lastSave);
            const now = new Date();
            const diffHours = Math.floor((now - lastSave) / (1000 * 60 * 60));
            
            if (diffHours > 0) {
                elements.petMessage.textContent = `Selamat datang kembali! ${diffHours} jam lalu.`;
                
                // Adjust stats based on absence
                adjustStatsAfterAbsence(diffHours);
            }
        }
        
        showMessage(elements.saveMessage, "✓ Progress dimuat!");
        return true;
        
    } catch (error) {
        console.error("Load error:", error);
        showMessage(elements.saveMessage, "✗ Gagal memuat save!", true);
        return false;
    }
}

function adjustStatsAfterAbsence(hours) {
    const maxHours = Math.min(hours, 48);
    
    // Degrade stats based on absence time
    gameData.pet.hunger = clamp(gameData.pet.hunger - (maxHours * 8), 0, 100);
    gameData.pet.happiness = clamp(gameData.pet.happiness - (maxHours * 4), 0, 100);
    gameData.pet.energy = clamp(gameData.pet.energy - (maxHours * 12), 0, 100);
    
    // Health penalty if stats are low
    if (gameData.pet.hunger < 30 || gameData.pet.happiness < 30 || gameData.pet.energy < 20) {
        gameData.pet.health = clamp(gameData.pet.health - (maxHours * 3), 0, 100);
    }
    
    updateStatusDisplay();
}

function autoSave() {
    // Save occasionally
    if (Math.random() < 0.1) {
        saveGame();
    }
}

// ==================== STATS DEGRADATION ====================
function degradeStats() {
    if (gameData.pet.isSleeping) {
        // Recovery during sleep
        gameData.pet.health = clamp(gameData.pet.health + 0.3, 0, 100);
        return;
    }
    
    // Gradual degradation
    gameData.pet.hunger = clamp(gameData.pet.hunger - 0.8, 0, 100);
    gameData.pet.happiness = clamp(gameData.pet.happiness - 0.5, 0, 100);
    gameData.pet.energy = clamp(gameData.pet.energy - 0.7, 0, 100);
    
    // Health logic
    if (gameData.pet.hunger <= 15 || gameData.pet.happiness <= 15) {
        gameData.pet.health = clamp(gameData.pet.health - 1, 0, 100);
    } else if (gameData.pet.hunger <= 30 || gameData.pet.happiness <= 30 || gameData.pet.energy <= 15) {
        gameData.pet.health = clamp(gameData.pet.health - 0.3, 0, 100);
    } else if (gameData.pet.hunger > 60 && gameData.pet.happiness > 60 && gameData.pet.energy > 40) {
        if (gameData.pet.health < 100) {
            gameData.pet.health = clamp(gameData.pet.health + 0.2, 0, 100);
        }
    }
    
    updateStatusDisplay();
}

// ==================== UI FUNCTIONS ====================
function changePetName() {
    const newName = prompt('Kasih nama baru untuk Snow:', gameData.pet.name);
    if (newName && newName.trim() !== '') {
        gameData.pet.name = newName.trim().substring(0, 20);
        elements.petName.firstChild.textContent = gameData.pet.name;
        elements.petMessage.textContent = `Wah, namaku sekarang ${gameData.pet.name}! Keren!`;
        saveGame();
    }
}

function closeTutorial() {
    elements.tutorialPopup.classList.remove('active');
}

function showHelp() {
    const helpText = `
🎮 **CARA MAIN SNOW DENGAN KOIN** 🪙

**1. MERAWAT SNOW:**
   - Kasih Makan: +25 Lapar, +2 Koin
   - Elus & Peluk: +20 Bahagia, +3 Koin  
   - Ajak Main: Butuh 15+ Energi, +5 Koin
   - Tidurkan: Recovery, +4 Koin saat bangun
   - Beri Obat: Naikkan kesehatan, +1 Koin

**2. DAPATKAN KOIN:**
   - Setiap aksi merawat memberi koin
   - Hadiah harian (10-50 koin)
   - Main mini game (sampai 15 koin)
   - Naik level (bonus koin)

**3. BELI AKSESORIS:**
   - Buka toko dengan tombol 🏪
   - Pakai koin untuk beli aksesoris
   - Aksesoris bisa dipakai/dilepas
   - Semakin langka, semakin mahal

**4. MINI GAME:**
   - Tangkap koin yang jatuh!
   - Gerakkan Snow dengan tombol kiri/kanan
   - Dapatkan 10 koin untuk menang
   - Hadiah: 15 koin!

**💡 TIPS:**
- Rawat Snow secara teratur
- Kumpulkan koin untuk aksesoris keren
- Cek hadiah harian setiap hari
- Level up untuk unlock aksesoris spesial

Selamat bermain! ❄️
    `;
    
    alert(helpText.replace(/\n\s+/g, '\n').trim());
}

// ==================== INITIALIZATION ====================
function init() {
    // Setup event listeners for action buttons
    elements.feedButton.addEventListener('click', feedPet);
    elements.petButton.addEventListener('click', petPet);
    elements.playButton.addEventListener('click', playWithPet);
    elements.sleepButton.addEventListener('click', putPetToSleep);
    elements.medicineButton.addEventListener('click', giveMedicine);
    elements.dailyButton.addEventListener('click', claimDailyReward);
    elements.saveButton.addEventListener('click', saveGame);
    elements.loadButton.addEventListener('click', loadGame);
    
    // Pet name click
    elements.petName.addEventListener('click', changePetName);
    
    // Pet face interaction
    document.getElementById('petFace').addEventListener('click', () => {
        if (gameData.pet.isSleeping) {
            elements.petMessage.textContent = "Zzz... Jangan ganggu tidurku!";
        } else {
            showRandomMessage();
        }
    });
    
    // Try to load saved game
    setTimeout(() => {
        const loaded = loadGame();
        if (!loaded) {
            updateStatusDisplay();
            updateCoinDisplay();
            updateAccessoryDisplay();
            checkDailyReward();
        }
    }, 500);
    
    // Stats degradation every 10 seconds
    setInterval(degradeStats, 10000);
    
    // Random messages every 20 seconds
    setInterval(showRandomMessage, 20000);
    
    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);
    
    // Eye blinking every 5-8 seconds
    setInterval(() => {
        if (!gameData.pet.isSleeping) {
            elements.leftPupil.style.height = '5px';
            elements.rightPupil.style.height = '5px';
            
            setTimeout(() => {
                elements.leftPupil.style.height = '12px';
                elements.rightPupil.style.height = '12px';
            }, 200);
        }
    }, Math.random() * 3000 + 5000);
    
    // Save on page unload
    window.addEventListener('beforeunload', saveGame);
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', init);
