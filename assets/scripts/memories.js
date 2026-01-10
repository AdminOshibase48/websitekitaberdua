// ================= CONFIGURATION =================
const CONFIG = {
    SUPABASE_URL: 'https://dbwjmrdtdhzphkmjdole.supabase.co',
    SUPABASE_KEY: 'sb_publishable_4xT76YyGNuodxKnTLqRKQA_xMWijGh4',
    COUPLE_ID: 'nursyam-lulu',
    PASSWORD: 'sm121809', // Password untuk upload memory
    MUSIC_URL: 'assets/music/love-memories.mp3' // URL musik untuk memory page
};

// ================= GLOBAL VARIABLES =================
let supabase;
let currentMemoryData = {};
let currentMemoryImage = null;

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // 1. Initialize Supabase
        supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        
        // 2. Initialize Music Player
        initializeMusicPlayer();
        
        // 3. Setup event listeners
        setupEventListeners();
        
        // 4. Load initial data
        await Promise.all([
            loadMemories(),
            loadLoveNotes()
        ]);
        
        // 5. Setup realtime subscriptions
        setupRealtimeSubscriptions();
        
        // 6. Initialize SQL Editor (development only)
        initializeSQLEditor();
        
        console.log('Memories App Initialized Successfully!');
        
    } catch (error) {
        console.error('Initialization Error:', error);
        showNotification('Gagal memuat aplikasi', 'error');
    }
}

// ================= MUSIC PLAYER =================
function initializeMusicPlayer() {
    const musicContainer = document.querySelector('.music-player-fixed');
    if (!musicContainer) {
        // Create music player if not exists
        createMusicPlayer();
    }
    
    const audio = document.getElementById('background-music');
    const toggleBtn = document.getElementById('music-toggle-fixed');
    const volumeSlider = document.querySelector('.volume-slider');
    const musicStatus = document.querySelector('.music-status');
    
    if (!audio || !toggleBtn) return;
    
    // Set initial volume
    if (volumeSlider) {
        audio.volume = volumeSlider.value / 100;
        volumeSlider.addEventListener('input', function() {
            audio.volume = this.value / 100;
        });
    }
    
    // Toggle play/pause
    toggleBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            musicStatus.textContent = 'Pause';
            toggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            toggleBtn.classList.add('playing');
        } else {
            audio.pause();
            musicStatus.textContent = 'Play';
            toggleBtn.innerHTML = '<i class="fas fa-play"></i> Play';
            toggleBtn.classList.remove('playing');
        }
    });
    
    // Auto-play with low volume
    setTimeout(() => {
        audio.volume = 0.3;
        audio.play().catch(e => {
            console.log('Auto-play prevented, waiting for user interaction');
        });
    }, 1000);
}

function createMusicPlayer() {
    const musicHTML = `
        <div class="music-player-fixed" style="position:fixed; bottom:30px; right:30px; z-index:1000; background:rgba(255,255,255,0.9); backdrop-filter:blur(10px); border-radius:20px; padding:15px; box-shadow:0 8px 30px rgba(0,0,0,0.15); border:1px solid rgba(255,255,255,0.2);">
            <div class="music-controls" style="display:flex; align-items:center; gap:15px;">
                <button class="music-toggle-btn" id="music-toggle-fixed" style="background:linear-gradient(135deg, #FF6B9D 0%, #FFA8C8 100%); color:white; border:none; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem; cursor:pointer; transition:all 0.3s;">
                    <i class="fas fa-play"></i>
                </button>
                <span class="music-status" style="font-size:0.9rem; font-weight:500; color:#212529;">Play</span>
                <div class="volume-control" style="flex:1; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-volume-down" style="color:#6C757D; font-size:0.9rem;"></i>
                    <input type="range" min="0" max="100" value="30" class="volume-slider" style="flex:1; height:4px; background:rgba(184,219,128,0.3); border-radius:2px;">
                    <i class="fas fa-volume-up" style="color:#6C757D; font-size:0.9rem;"></i>
                </div>
            </div>
            <audio id="background-music" loop>
                <source src="${CONFIG.MUSIC_URL}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', musicHTML);
}

// ================= MEMORIES MANAGEMENT =================
async function loadMemories() {
    try {
        showLoading(true, 'memories-grid');
        
        const { data: memories, error } = await supabase
            .from('memories')
            .select('*')
            .eq('couple_id', CONFIG.COUPLE_ID)
            .order('memory_date', { ascending: false });
        
        if (error) throw error;
        
        displayMemories(memories || []);
        updateStats(memories || []);
        
    } catch (error) {
        console.error('Error loading memories:', error);
        showNotification('Gagal memuat kenangan', 'error');
        showEmptyState('memories-grid', 'Kenangan', 'Belum ada kenangan yang disimpan');
    } finally {
        showLoading(false, 'memories-grid');
    }
}

function displayMemories(memories) {
    const grid = document.getElementById('memories-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!memories || memories.length === 0) {
        showEmptyState('memories-grid', 'Kenangan', 'Mulailah dengan menambahkan kenangan pertama kalian!');
        return;
    }
    
    memories.forEach((memory, index) => {
        const card = createMemoryCard(memory, index);
        grid.appendChild(card);
    });
}

function createMemoryCard(memory, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.id = memory.id;
    card.dataset.category = memory.category;
    card.style.animationDelay = `${index * 100}ms`;
    
    const date = new Date(memory.memory_date);
    const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    card.innerHTML = `
        <div class="memory-image">
            <img src="${memory.image_url || 'https://via.placeholder.com/300x200/FFE4EF/FF6B9D?text=Kenangan+Cinta'}" 
                 alt="${memory.title}"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200/FFE4EF/FF6B9D?text=Kenangan+Cinta'">
            <div class="memory-overlay">
                <div class="memory-actions">
                    <button class="action-btn like-btn" data-id="${memory.id}">
                        <i class="fas fa-heart ${memory.user_liked ? 'liked' : ''}"></i>
                        <span class="like-count">${memory.likes || 0}</span>
                    </button>
                    <button class="action-btn view-btn" data-id="${memory.id}">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="action-btn share-btn" data-id="${memory.id}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            <div class="memory-date">${formattedDate}</div>
        </div>
        <div class="memory-content">
            <span class="memory-category ${memory.category}">${getCategoryLabel(memory.category)}</span>
            <h3 class="memory-title">${memory.title}</h3>
            <p class="memory-description">${truncateText(memory.description, 120)}</p>
            <div class="memory-footer">
                <span class="memory-author">
                    <i class="fas fa-user-circle"></i> ${memory.author || 'Kita'}
                </span>
                <button class="read-more-btn" data-id="${memory.id}">
                    Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.like-btn').addEventListener('click', (e) => handleLike(memory.id, e));
    card.querySelector('.view-btn').addEventListener('click', () => showMemoryDetail(memory.id));
    card.querySelector('.share-btn').addEventListener('click', () => shareMemory(memory));
    card.querySelector('.read-more-btn').addEventListener('click', () => showMemoryDetail(memory.id));
    
    return card;
}

// ================= ADD MEMORY WITH PASSWORD =================
async function openAddMemoryForm() {
    currentMemoryData = {};
    currentMemoryImage = null;
    
    const formHTML = `
        <div class="add-memory-modal" id="add-memory-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeAddMemoryForm()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h2><i class="fas fa-plus-circle"></i> Tambah Kenangan Baru</h2>
                    <p>Bagikan momen spesial kalian berdua</p>
                </div>
                <form id="memory-form" onsubmit="event.preventDefault(); previewMemory()">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="memory-title"><i class="fas fa-heading"></i> Judul Kenangan *</label>
                            <input type="text" id="memory-title" placeholder="Contoh: Pertemuan Pertama Kita" required>
                        </div>
                        <div class="form-group">
                            <label for="memory-date"><i class="fas fa-calendar"></i> Tanggal *</label>
                            <input type="date" id="memory-date" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="memory-category"><i class="fas fa-tag"></i> Kategori</label>
                            <select id="memory-category">
                                <option value="firsts">Pertama Kali</option>
                                <option value="dates">Kencan Romantis</option>
                                <option value="travel">Perjalanan</option>
                                <option value="celebration">Perayaan</option>
                                <option value="everyday">Momen Sehari-hari</option>
                                <option value="gifts">Hadiah Spesial</option>
                                <option value="adventure">Petualangan</option>
                                <option value="milestone">Pencapaian</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="memory-author"><i class="fas fa-user"></i> Ditambahkan Oleh</label>
                            <select id="memory-author">
                                <option value="Nursyam">Nursyam</option>
                                <option value="Lulu">Lulu</option>
                                <option value="Kita">Kita Berdua</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="memory-description"><i class="fas fa-edit"></i> Deskripsi *</label>
                        <textarea id="memory-description" rows="5" placeholder="Ceritakan momen spesial ini..." required></textarea>
                        <div class="char-count" style="text-align:right; margin-top:5px; font-size:0.8rem; color:#6C757D;">
                            <span id="desc-char-count">0</span>/1000 karakter
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="memory-image"><i class="fas fa-camera"></i> Foto Kenangan (URL)</label>
                        <input type="url" id="memory-image" placeholder="https://example.com/foto-kenangan.jpg">
                        <div class="image-preview" id="image-preview" style="margin-top:10px;"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="memory-location"><i class="fas fa-map-marker-alt"></i> Lokasi</label>
                        <input type="text" id="memory-location" placeholder="Contoh: Kafe Santai, Jakarta">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeAddMemoryForm()">
                            <i class="fas fa-times"></i> Batal
                        </button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-eye"></i> Preview & Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Set today's date as default
    document.getElementById('memory-date').valueAsDate = new Date();
    
    // Setup character counter
    const descTextarea = document.getElementById('memory-description');
    const charCount = document.getElementById('desc-char-count');
    
    descTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 1000) {
            this.value = this.value.substring(0, 1000);
            charCount.textContent = 1000;
            charCount.style.color = '#FF6B9D';
        } else if (count > 900) {
            charCount.style.color = '#FF6B9D';
        } else {
            charCount.style.color = '#6C757D';
        }
    });
    
    // Setup image preview
    const imageInput = document.getElementById('memory-image');
    const preview = document.getElementById('image-preview');
    
    imageInput.addEventListener('input', function() {
        if (this.value.trim()) {
            preview.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                    <img src="${this.value}" alt="Preview" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">
                    <div>
                        <div style="font-size:0.9rem; color:#666;">Preview:</div>
                        <div style="font-size:0.8rem; color:#999; word-break:break-all;">${this.value.substring(0, 50)}...</div>
                    </div>
                </div>
            `;
            currentMemoryImage = this.value;
        } else {
            preview.innerHTML = '';
            currentMemoryImage = null;
        }
    });
}

function previewMemory() {
    // Collect form data
    currentMemoryData = {
        title: document.getElementById('memory-title').value.trim(),
        memory_date: document.getElementById('memory-date').value,
        category: document.getElementById('memory-category').value,
        author: document.getElementById('memory-author').value,
        description: document.getElementById('memory-description').value.trim(),
        image_url: document.getElementById('memory-image').value.trim() || null,
        location: document.getElementById('memory-location').value.trim() || null,
        couple_id: CONFIG.COUPLE_ID
    };
    
    // Validate
    if (!currentMemoryData.title || !currentMemoryData.description) {
        showNotification('Judul dan deskripsi harus diisi!', 'error');
        return;
    }
    
    // Show password modal for confirmation
    showPasswordModal('add-memory');
}

async function saveMemoryToDatabase() {
    try {
        showLoading(true, 'add-memory-modal');
        
        // Check if memory already exists (by title and date)
        const { data: existing } = await supabase
            .from('memories')
            .select('id')
            .eq('title', currentMemoryData.title)
            .eq('memory_date', currentMemoryData.date)
            .eq('couple_id', CONFIG.COUPLE_ID)
            .single();
        
        if (existing) {
            showNotification('Kenangan dengan judul dan tanggal ini sudah ada', 'warning');
            return;
        }
        
        // Insert to database
        const { data, error } = await supabase
            .from('memories')
            .insert([currentMemoryData])
            .select()
            .single();
        
        if (error) throw error;
        
        // Success!
        showNotification('Kenangan berhasil disimpan! 💖', 'success');
        closeAddMemoryForm();
        
        // Reload memories
        await loadMemories();
        
        // Play success sound
        playSuccessSound();
        
    } catch (error) {
        console.error('Error saving memory:', error);
        showNotification('Gagal menyimpan kenangan: ' + error.message, 'error');
    } finally {
        showLoading(false, 'add-memory-modal');
    }
}

function closeAddMemoryForm() {
    const modal = document.getElementById('add-memory-modal');
    if (modal) modal.remove();
}

// ================= PASSWORD MODAL =================
function showPasswordModal(action) {
    const modalHTML = `
        <div class="password-modal-overlay" id="password-modal">
            <div class="password-modal-container">
                <div class="password-modal-header">
                    <div class="password-modal-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h3 class="password-modal-title">Password Diperlukan</h3>
                    <p class="password-modal-subtitle">Masukkan password untuk ${action === 'add-memory' ? 'menyimpan kenangan' : 'mengakses fitur ini'}</p>
                </div>
                
                <div class="password-modal-body">
                    <input type="password" 
                           id="password-input" 
                           class="password-modal-input" 
                           placeholder="Masukkan password..."
                           autocomplete="current-password">
                    <div class="password-hint">
                        <i class="fas fa-info-circle"></i>
                        Password hanya diketahui oleh Nursyam & Lulu
                    </div>
                </div>
                
                <div class="password-modal-actions">
                    <button class="password-modal-btn cancel" onclick="hidePasswordModal()">
                        <i class="fas fa-times"></i> Batal
                    </button>
                    <button class="password-modal-btn submit" onclick="verifyPassword('${action}')">
                        <i class="fas fa-check"></i> Verifikasi
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus on input
    setTimeout(() => {
        const input = document.getElementById('password-input');
        if (input) input.focus();
    }, 100);
    
    // Enter key support
    document.getElementById('password-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPassword(action);
        }
    });
}

function hidePasswordModal() {
    const modal = document.getElementById('password-modal');
    if (modal) modal.remove();
}

function verifyPassword(action) {
    const passwordInput = document.getElementById('password-input');
    const password = passwordInput ? passwordInput.value : '';
    
    if (password === CONFIG.PASSWORD) {
        hidePasswordModal();
        
        if (action === 'add-memory') {
            saveMemoryToDatabase();
        } else if (action === 'edit-memory') {
            // Handle edit memory
        } else if (action === 'delete-memory') {
            // Handle delete memory
        }
        
        showNotification('Password benar! ✅', 'success');
    } else {
        // Shake animation for wrong password
        passwordInput.classList.add('shake');
        showNotification('Password salah! ❌', 'error');
        
        setTimeout(() => {
            passwordInput.classList.remove('shake');
            passwordInput.value = '';
            passwordInput.focus();
        }, 500);
    }
}

// ================= LOVE NOTES =================
async function loadLoveNotes() {
    try {
        const { data: notes, error } = await supabase
            .from('love_notes')
            .select('*')
            .eq('couple_id', CONFIG.COUPLE_ID)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        
        displayLoveNotes(notes || []);
        
    } catch (error) {
        console.error('Error loading love notes:', error);
        showEmptyState('love-notes-container', 'Catatan Cinta', 'Belum ada catatan cinta');
    }
}

function displayLoveNotes(notes) {
    const container = document.getElementById('love-notes-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!notes || notes.length === 0) {
        showEmptyState('love-notes-container', 'Catatan Cinta', 'Mulailah dengan menulis catatan cinta pertama!');
        return;
    }
    
    notes.forEach(note => {
        const noteCard = createLoveNoteCard(note);
        container.appendChild(noteCard);
    });
}

function createLoveNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'love-note-card';
    card.dataset.id = note.id;
    
    const date = new Date(note.created_at);
    const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const isNursyam = note.author === 'Nursyam';
    
    card.innerHTML = `
        <div class="note-header">
            <div class="note-avatar ${isNursyam ? 'his' : 'hers'}">
                <i class="fas fa-user"></i>
            </div>
            <div class="note-info">
                <h3 class="note-author">${note.author}</h3>
                <span class="note-date">${formattedDate}</span>
            </div>
            <button class="note-delete-btn" data-id="${note.id}" title="Hapus catatan">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="note-content">
            <p>${note.content}</p>
        </div>
        <div class="note-footer">
            <span class="note-signature">
                ${isNursyam ? 'Dengan cinta, Nursyam' : 'Selamanya milikmu, Lulu'}
            </span>
        </div>
    `;
    
    // Add delete event listener
    const deleteBtn = card.querySelector('.note-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmDeleteNote(note.id, note.author);
    });
    
    return card;
}

async function addLoveNote() {
    const content = document.getElementById('note-content');
    const author = document.getElementById('note-author');
    
    if (!content || !author) return;
    
    const noteContent = content.value.trim();
    const noteAuthor = author.value;
    
    if (!noteContent) {
        showNotification('Tulis sesuatu dulu sayang! ❤️', 'error');
        return;
    }
    
    if (noteContent.length > 500) {
        showNotification('Catatan terlalu panjang (maks 500 karakter)', 'error');
        return;
    }
    
    // Show password modal for love notes too
    currentMemoryData = {
        content: noteContent,
        author: noteAuthor,
        couple_id: CONFIG.COUPLE_ID
    };
    
    showPasswordModal('add-love-note');
}

async function saveLoveNoteToDatabase() {
    try {
        const { error } = await supabase
            .from('love_notes')
            .insert([currentMemoryData]);
        
        if (error) throw error;
        
        showNotification('Catatan cinta berhasil disimpan! 💌', 'success');
        
        // Clear form
        document.getElementById('note-content').value = '';
        document.getElementById('char-count').textContent = '0';
        
        // Reload notes
        await loadLoveNotes();
        
        // Play success sound
        playSuccessSound();
        
    } catch (error) {
        console.error('Error saving love note:', error);
        showNotification('Gagal menyimpan catatan cinta', 'error');
    }
}

async function confirmDeleteNote(noteId, author) {
    if (confirm(`Yakin ingin menghapus catatan dari ${author}?`)) {
        try {
            const { error } = await supabase
                .from('love_notes')
                .delete()
                .eq('id', noteId);
            
            if (error) throw error;
            
            showNotification('Catatan berhasil dihapus', 'success');
            await loadLoveNotes();
            
        } catch (error) {
            console.error('Error deleting note:', error);
            showNotification('Gagal menghapus catatan', 'error');
        }
    }
}

// ================= SQL EDITOR (Development Tool) =================
function initializeSQLEditor() {
    // Only show in development mode
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return;
    }
    
    const editorHTML = `
        <div class="sql-editor-toggle" onclick="toggleSQLEditor()">
            <i class="fas fa-database"></i>
        </div>
        
        <div class="sql-editor" id="sql-editor" style="display:none;">
            <div class="editor-header">
                <h3><i class="fas fa-code"></i> Supabase SQL Editor</h3>
                <button class="close-editor" onclick="toggleSQLEditor()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="editor-tabs">
                <button class="tab active" data-tab="query">Query</button>
                <button class="tab" data-tab="tables">Tables</button>
                <button class="tab" data-tab="backup">Backup</button>
            </div>
            <div class="editor-content">
                <div class="tab-content active" id="query-tab">
                    <textarea id="sql-query" placeholder="SELECT * FROM memories WHERE couple_id = 'nursyam-lulu';"></textarea>
                    <button onclick="executeSQL()" class="run-btn">
                        <i class="fas fa-play"></i> Execute Query
                    </button>
                </div>
                <div class="tab-content" id="tables-tab">
                    <div class="tables-list" id="tables-list">
                        Loading tables...
                    </div>
                </div>
                <div class="tab-content" id="backup-tab">
                    <div class="backup-actions">
                        <button onclick="backupData()" class="backup-btn">
                            <i class="fas fa-download"></i> Backup Data
                        </button>
                        <button onclick="restoreData()" class="restore-btn">
                            <i class="fas fa-upload"></i> Restore Data
                        </button>
                    </div>
                </div>
            </div>
            <div class="editor-result" id="sql-result">
                <div class="result-header">
                    <h4>Results</h4>
                    <button onclick="clearResults()" class="clear-btn">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                </div>
                <pre id="result-content"></pre>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', editorHTML);
    
    // Setup tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Load tables
    loadTables();
}

function toggleSQLEditor() {
    const editor = document.getElementById('sql-editor');
    if (editor.style.display === 'none') {
        editor.style.display = 'block';
    } else {
        editor.style.display = 'none';
    }
}

async function loadTables() {
    try {
        const tables = ['memories', 'love_notes'];
        const list = document.getElementById('tables-list');
        
        list.innerHTML = tables.map(table => `
            <div class="table-item">
                <h4><i class="fas fa-table"></i> ${table}</h4>
                <button onclick="showTableStructure('${table}')" class="structure-btn">
                    <i class="fas fa-info-circle"></i> Structure
                </button>
                <button onclick="previewTable('${table}')" class="preview-btn">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button onclick="exportTable('${table}')" class="export-btn">
                    <i class="fas fa-file-export"></i> Export
                </button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading tables:', error);
    }
}

async function executeSQL() {
    const query = document.getElementById('sql-query').value.trim();
    if (!query) {
        showNotification('Masukkan query SQL terlebih dahulu', 'error');
        return;
    }
    
    try {
        showLoading(true, 'sql-result');
        
        const { data, error } = await supabase
            .from(query.includes('FROM') ? query.split('FROM')[1].split(' ')[1] : 'memories')
            .select('*');
        
        if (error) throw error;
        
        const result = document.getElementById('result-content');
        result.textContent = JSON.stringify(data, null, 2);
        
        showNotification('Query executed successfully!', 'success');
        
    } catch (error) {
        console.error('Error executing SQL:', error);
        const result = document.getElementById('result-content');
        result.textContent = `ERROR: ${error.message}`;
        showNotification('Query execution failed', 'error');
    } finally {
        showLoading(false, 'sql-result');
    }
}

// ================= UTILITY FUNCTIONS =================
function getCategoryLabel(category) {
    const labels = {
        'firsts': 'Pertama Kali',
        'dates': 'Kencan Romantis',
        'travel': 'Perjalanan',
        'celebration': 'Perayaan',
        'everyday': 'Momen Sehari-hari',
        'gifts': 'Hadiah Spesial',
        'adventure': 'Petualangan',
        'milestone': 'Pencapaian'
    };
    return labels[category] || category;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function updateStats(memories) {
    const totalEl = document.getElementById('total-memories');
    const yearsEl = document.getElementById('years-together');
    const daysEl = document.getElementById('special-days');
    
    if (!totalEl || !yearsEl || !daysEl) return;
    
    totalEl.textContent = memories.length;
    
    if (memories.length > 0) {
        const dates = memories.map(m => new Date(m.memory_date)).filter(d => !isNaN(d));
        if (dates.length > 0) {
            const oldest = new Date(Math.min(...dates));
            const today = new Date();
            const diffTime = today - oldest;
            const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
            yearsEl.textContent = diffYears + 1;
        }
        
        const specialDays = memories.filter(m => 
            m.likes >= 10 || 
            ['firsts', 'celebration', 'milestone'].includes(m.category)
        ).length;
        daysEl.textContent = specialDays;
    }
}

function showLoading(show, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (show) {
        const loading = document.createElement('div');
        loading.className = 'loading-spinner';
        loading.innerHTML = '<div class="spinner"></div>';
        loading.id = `${elementId}-loading`;
        element.appendChild(loading);
    } else {
        const loading = document.getElementById(`${elementId}-loading`);
        if (loading) loading.remove();
    }
}

function showEmptyState(elementId, title, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h3>${title}</h3>
            <p>${message}</p>
            ${elementId === 'memories-grid' ? 
                '<button class="btn-primary" onclick="openAddMemoryForm()"><i class="fas fa-plus"></i> Tambah Kenangan Pertama</button>' : 
                '<button class="btn-primary" onclick="document.getElementById(\'note-content\').focus()"><i class="fas fa-edit"></i> Tulis Catatan Pertama</button>'
            }
        </div>
    `;
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function playSuccessSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
    // Silent audio - just a placeholder
    audio.volume = 0;
    audio.play();
}

// ================= EVENT LISTENERS SETUP =================
function setupEventListeners() {
    // Add Memory Button
    const addMemoryBtn = document.getElementById('add-memory-btn');
    if (addMemoryBtn) {
        addMemoryBtn.addEventListener('click', openAddMemoryForm);
    }
    
    // Love Notes Submit
    const submitNoteBtn = document.getElementById('submit-note-btn');
    if (submitNoteBtn) {
        submitNoteBtn.addEventListener('click', addLoveNote);
    }
    
    // Character counter for love notes
    const noteContent = document.getElementById('note-content');
    const charCount = document.getElementById('char-count');
    if (noteContent && charCount) {
        noteContent.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
                charCount.style.color = '#FF6B9D';
            } else if (count > 450) {
                charCount.style.color = '#FF6B9D';
            } else {
                charCount.style.color = '#6C757D';
            }
        });
    }
    
    // Category filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterMemories(category);
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterMemories(category) {
    const cards = document.querySelectorAll('.memory-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ================= STYLES INJECTION =================
const styles = `
    /* Password Modal Styles */
    .password-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    }
    
    .password-modal-container {
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: modalSlideIn 0.3s ease;
    }
    
    @keyframes modalSlideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .password-modal-header {
        text-align: center;
        margin-bottom: 25px;
    }
    
    .password-modal-icon {
        font-size: 48px;
        color: #FF6B9D;
        margin-bottom: 15px;
    }
    
    .password-modal-title {
        color: #212529;
        font-size: 24px;
        margin-bottom: 8px;
        font-family: 'Playfair Display', serif;
    }
    
    .password-modal-subtitle {
        color: #6C757D;
        font-size: 14px;
    }
    
    .password-modal-input {
        width: 100%;
        padding: 15px;
        border: 2px solid #FFA8C8;
        border-radius: 12px;
        font-size: 16px;
        margin-bottom: 15px;
        text-align: center;
        letter-spacing: 2px;
    }
    
    .password-hint {
        color: #6C757D;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 20px;
    }
    
    .password-modal-actions {
        display: flex;
        gap: 15px;
    }
    
    .password-modal-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s;
    }
    
    .password-modal-btn.cancel {
        background: #F8F9FA;
        color: #6C757D;
    }
    
    .password-modal-btn.submit {
        background: linear-gradient(135deg, #FF6B9D, #FFA8C8);
        color: white;
    }
    
    .password-modal-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    /* Shake animation */
    .shake {
        animation: shake 0.5s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    /* Notification Styles */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        border-left: 4px solid #6C757D;
        animation: slideInRight 0.3s ease;
    }
    
    .notification.success {
        border-left-color: #B8DB80;
    }
    
    .notification.error {
        border-left-color: #FF6B9D;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    /* SQL Editor Styles */
    .sql-editor-toggle {
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(135deg, #212529, #343A40);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .sql-editor {
        position: fixed;
        bottom: 160px;
        right: 30px;
        width: 400px;
        height: 500px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    
    /* Loading Spinner */
    .loading-spinner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #FF6B9D;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
