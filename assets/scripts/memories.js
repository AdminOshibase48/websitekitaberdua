// memories.js
document.addEventListener('DOMContentLoaded', function() {
    // ================= CONFIGURATION =================
    const SUPABASE_URL = 'https://dbwjmrdtdhzphkmjdole.supabase.co'; // GANTI DENGAN URL SUPA BASE ANDA
    const SUPABASE_ANON_KEY = 'sb_publishable_4xT76YyGNuodxKnTLqRKQA_xMWijGh4'; // GANTI DENGAN ANON KEY ANDA
    const COUPLE_ID = 'nursyam-lulu'; // GANTI DENGAN ID PASANGAN ANDA
    
    // ================= ELEMENTS =================
    const memoriesGrid = document.getElementById('memories-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const memoryModal = document.getElementById('memory-modal');
    const modalClose = document.getElementById('modal-close');
    const loveNotesContainer = document.getElementById('love-notes-container');
    const noteContent = document.getElementById('note-content');
    const charCount = document.getElementById('char-count');
    const submitNoteBtn = document.getElementById('submit-note');
    const totalMemoriesEl = document.getElementById('total-memories');
    const yearsTogetherEl = document.getElementById('years-together');
    const specialDaysEl = document.getElementById('special-days');
    
    // ================= INITIALIZE SUPA BASE =================
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // ================= UTILITY FUNCTIONS =================
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    function getCategoryLabel(category) {
        const labels = {
            'firsts': 'Pertama Kali',
            'dates': 'Kencan',
            'travel': 'Perjalanan',
            'achievements': 'Pencapaian',
            'surprises': 'Kejutan',
            'love': 'Cinta',
            'memory': 'Kenangan',
            'message': 'Pesan',
            'wish': 'Harapan'
        };
        return labels[category] || category;
    }
    
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 25px;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transform: translateX(150%);
                    transition: transform 0.3s ease;
                    z-index: 9999;
                    border-left: 4px solid #6C757D;
                    max-width: 350px;
                    font-family: 'Poppins', sans-serif;
                }
                .notification.show { transform: translateX(0); }
                .notification.success { border-left-color: #B8DB80; }
                .notification.error { border-left-color: #FF6B9D; }
                .notification i { font-size: 1.2rem; }
                .notification.success i { color: #B8DB80; }
                .notification.error i { color: #FF6B9D; }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // ================= MEMORIES FUNCTIONS =================
    async function loadMemories() {
        try {
            showLoading(true);
            
            const { data: memories, error } = await supabase
                .from('memories')
                .select('*')
                .eq('couple_id', COUPLE_ID)
                .order('memory_date', { ascending: false });
            
            if (error) throw error;
            
            displayMemories(memories || []);
            updateStats(memories || []);
            
        } catch (error) {
            console.error('Error loading memories:', error);
            showNotification('Gagal memuat kenangan', 'error');
            memoriesGrid.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px;color:#6C757D">
                    <i class="fas fa-exclamation-triangle" style="font-size:3rem;margin-bottom:20px;"></i>
                    <h3>Gagal memuat kenangan</h3>
                    <p>Silakan refresh halaman atau coba lagi nanti</p>
                </div>
            `;
        } finally {
            showLoading(false);
        }
    }
    
    function displayMemories(memories) {
        memoriesGrid.innerHTML = '';
        
        if (memories.length === 0) {
            memoriesGrid.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px;color:#6C757D">
                    <i class="fas fa-heart" style="font-size:3rem;color:#FF6B9D;margin-bottom:20px;"></i>
                    <h3 style="margin-bottom:10px;color:#212529;">Belum ada kenangan</h3>
                    <p>Mulailah dengan menambahkan kenangan pertama kalian!</p>
                </div>
            `;
            return;
        }
        
        memories.forEach(memory => {
            const memoryCard = createMemoryCard(memory);
            memoriesGrid.appendChild(memoryCard);
        });
    }
    
    function createMemoryCard(memory) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.category = memory.category;
        card.dataset.id = memory.id;
        
        card.innerHTML = `
            <div class="memory-image">
                <img src="${memory.image_url || 'assets/images/default-memory.jpg'}" 
                     alt="${memory.title}"
                     onerror="this.src='assets/images/default-memory.jpg'">
                <div class="memory-date">${formatDate(memory.memory_date)}</div>
            </div>
            <div class="memory-content">
                <span class="memory-category">${getCategoryLabel(memory.category)}</span>
                <h3 class="memory-title">${memory.title}</h3>
                <p class="memory-description">
                    ${memory.description.substring(0, 100)}${memory.description.length > 100 ? '...' : ''}
                </p>
                <div class="memory-footer">
                    <div class="memory-likes" data-id="${memory.id}">
                        <i class="fas fa-heart ${memory.user_liked ? 'liked' : ''}"></i>
                        <span class="like-count">${memory.likes || 0}</span>
                    </div>
                    <button class="view-memory-btn" data-id="${memory.id}">
                        Lihat Detail <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const likeBtn = card.querySelector('.memory-likes');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLike(memory.id, likeBtn);
        });
        
        card.querySelector('.view-memory-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showMemoryDetail(memory.id);
        });
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.memory-likes') && !e.target.closest('.view-memory-btn')) {
                showMemoryDetail(memory.id);
            }
        });
        
        return card;
    }
    
    async function handleLike(memoryId, likeBtn) {
        try {
            const likeIcon = likeBtn.querySelector('i');
            const likeCount = likeBtn.querySelector('.like-count');
            let currentLikes = parseInt(likeCount.textContent);
            
            // Toggle like state
            const isLiked = likeIcon.classList.contains('liked');
            const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
            
            // Update UI immediately
            likeIcon.classList.toggle('liked');
            likeCount.textContent = newLikes;
            
            // Update in database
            const { error } = await supabase
                .from('memories')
                .update({ likes: newLikes })
                .eq('id', memoryId);
            
            if (error) throw error;
            
        } catch (error) {
            console.error('Error updating like:', error);
            showNotification('Gagal menyukai kenangan', 'error');
        }
    }
    
    async function showMemoryDetail(memoryId) {
        try {
            const { data: memory, error } = await supabase
                .from('memories')
                .select('*')
                .eq('id', memoryId)
                .single();
            
            if (error) throw error;
            
            const modalDate = document.getElementById('modal-date');
            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');
            
            modalDate.textContent = formatDate(memory.memory_date);
            modalTitle.textContent = memory.title;
            modalDescription.textContent = memory.description;
            
            memoryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Error loading memory detail:', error);
            showNotification('Gagal memuat detail kenangan', 'error');
        }
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
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }
    
    // ================= LOVE NOTES FUNCTIONS =================
    async function loadLoveNotes() {
        try {
            const { data: notes, error } = await supabase
                .from('love_notes')
                .select('*')
                .eq('couple_id', COUPLE_ID)
                .order('created_at', { ascending: false })
                .limit(20);
            
            if (error) throw error;
            
            displayLoveNotes(notes || []);
            
        } catch (error) {
            console.error('Error loading love notes:', error);
            loveNotesContainer.innerHTML = `
                <div class="empty-state" style="text-align:center;padding:40px;color:#6C757D">
                    <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:15px;"></i>
                    <p>Gagal memuat catatan kenangan</p>
                </div>
            `;
        }
    }
    
    function displayLoveNotes(notes) {
        loveNotesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            loveNotesContainer.innerHTML = `
                <div class="empty-state" style="text-align:center;padding:40px;color:#6C757D">
                    <i class="fas fa-heart" style="font-size:2rem;color:#FF6B9D;margin-bottom:15px;"></i>
                    <p>Belum ada catatan kenangan. Jadilah yang pertama!</p>
                </div>
            `;
            return;
        }
        
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'love-note-card';
            
            const date = new Date(note.created_at);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            noteCard.innerHTML = `
                <div class="note-header">
                    <div class="note-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="note-info">
                        <h3 class="note-author">${note.author}</h3>
                        <span class="note-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="note-content">
                    <p>${note.content}</p>
                </div>
            `;
            
            loveNotesContainer.appendChild(noteCard);
        });
    }
    
    async function submitLoveNote() {
        const author = document.getElementById('note-author').value.trim();
        const category = document.getElementById('note-category').value || 'memory';
        const content = noteContent.value.trim();
        
        // Validation
        if (!author || !content) {
            showNotification('Harap isi nama dan catatan kenangan', 'error');
            return;
        }
        
        if (content.length < 10) {
            showNotification('Catatan terlalu pendek (minimal 10 karakter)', 'error');
            return;
        }
        
        if (content.length > 500) {
            showNotification('Catatan terlalu panjang (maksimal 500 karakter)', 'error');
            return;
        }
        
        try {
            submitNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            submitNoteBtn.disabled = true;
            
            const { error } = await supabase
                .from('love_notes')
                .insert([{
                    couple_id: COUPLE_ID,
                    author: author,
                    content: content
                }]);
            
            if (error) throw error;
            
            // Clear form
            document.getElementById('note-author').value = '';
            document.getElementById('note-category').value = '';
            noteContent.value = '';
            charCount.textContent = '0';
            
            showNotification('Catatan kenangan berhasil disimpan!', 'success');
            
            // Reload notes
            loadLoveNotes();
            
        } catch (error) {
            console.error('Error submitting note:', error);
            showNotification('Gagal menyimpan catatan', 'error');
        } finally {
            submitNoteBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Simpan Kenangan';
            submitNoteBtn.disabled = false;
        }
    }
    
    // ================= STATS FUNCTIONS =================
    function updateStats(memories) {
        // Total memories
        totalMemoriesEl.textContent = memories.length;
        
        // Calculate years together
        if (memories.length > 0) {
            const dates = memories.map(m => new Date(m.memory_date));
            const oldest = new Date(Math.min(...dates));
            const newest = new Date(Math.max(...dates));
            
            const diffTime = Math.abs(newest - oldest);
            const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
            
            yearsTogetherEl.textContent = diffYears || 1;
            
            // Count special days (memories with 50+ likes or special categories)
            const specialDays = memories.filter(m => 
                m.likes >= 50 || 
                ['firsts', 'surprises'].includes(m.category)
            ).length;
            
            specialDaysEl.textContent = specialDays;
        } else {
            yearsTogetherEl.textContent = '0';
            specialDaysEl.textContent = '0';
        }
    }
    
    // ================= EVENT LISTENERS =================
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterMemories(button.dataset.category);
        });
    });
    
    // Memory modal
    modalClose.addEventListener('click', () => {
        memoryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    memoryModal.addEventListener('click', (e) => {
        if (e.target === memoryModal) {
            memoryModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Character count for textarea
    noteContent.addEventListener('input', () => {
        const count = noteContent.value.length;
        charCount.textContent = count;
        
        if (count > 500) {
            noteContent.value = noteContent.value.substring(0, 500);
            charCount.textContent = 500;
            charCount.style.color = '#FF6B9D';
        } else if (count > 450) {
            charCount.style.color = '#FF6B9D';
        } else {
            charCount.style.color = '#6C757D';
        }
    });
    
    // Submit love note
    submitNoteBtn.addEventListener('click', submitLoveNote);
    
    // Enter key to submit note
    noteContent.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            submitLoveNote();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && memoryModal.classList.contains('active')) {
            memoryModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ================= LOADING STATE =================
    function showLoading(show) {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (!loadingIndicator) return;
        
        if (show) {
            loadingIndicator.style.display = 'flex';
            memoriesGrid.style.opacity = '0.5';
        } else {
            loadingIndicator.style.display = 'none';
            memoriesGrid.style.opacity = '1';
        }
    }
    
    // ================= REALTIME SUBSCRIPTIONS =================
    function setupRealtimeSubscriptions() {
        // Subscribe to memories changes
        supabase
            .channel('memories-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'memories',
                filter: `couple_id=eq.${COUPLE_ID}`
            }, () => {
                loadMemories();
            })
            .subscribe();
        
        // Subscribe to love notes changes
        supabase
            .channel('love-notes-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'love_notes',
                filter: `couple_id=eq.${COUPLE_ID}`
            }, () => {
                loadLoveNotes();
            })
            .subscribe();
    }
    
    // ================= INITIALIZE EVERYTHING =================
    async function initialize() {
        try {
            // Load initial data
            await Promise.all([
                loadMemories(),
                loadLoveNotes()
            ]);
            
            // Setup realtime
            setupRealtimeSubscriptions();
            
            // Update current year
            document.getElementById('current-year').textContent = new Date().getFullYear();
            
            console.log('Memories page initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize:', error);
            showNotification('Gagal memuat halaman', 'error');
        }
    }
    
    // Start everything
    initialize();
});

// Add loading indicator styles dynamically
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    #loading-indicator {
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        grid-column: 1 / -1;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #FF6B9D;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: #6C757D;
    }
    
    .empty-state i {
        font-size: 3rem;
        color: #FF6B9D;
        margin-bottom: 20px;
        opacity: 0.5;
    }
`;
document.head.appendChild(loadingStyles);
