// memories.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const memoriesGrid = document.getElementById('memories-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const memoryModal = document.getElementById('memory-modal');
    const modalClose = document.getElementById('modal-close');
    const loveNotesContainer = document.getElementById('love-notes-container');
    const noteContent = document.getElementById('note-content');
    const charCount = document.getElementById('char-count');
    const submitNoteBtn = document.getElementById('submit-note');
    
    // Supabase Configuration - GANTI DENGAN KONFIGURASI ANDA
    const SUPABASE_URL = 'https://dbwjmrdtdhzphkmjdole.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_4xT76YyGNuodxKnTLqRKQA_xMWijGh4';
    
    // Initialize Supabase client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Memory Data
    const memoriesData = [
        {
            id: 1,
            date: "15 Desember 2025",
            category: "firsts",
            image: "assets/images/memories/first-meet.jpg",
            title: "Pertemuan Pertama",
            description: "Saat pertama kali mata kita bertemu di kafe itu, dunia seakan berhenti berputar. Aku masih ingat senyuman manismu yang membuat jantungku berdetak lebih kencang.",
            likes: 42,
            tags: ["First Meet", "Romantic"]
        },
        {
            id: 2,
            date: "14 Februari 2026",
            category: "dates",
            image: "assets/images/memories/valentine.jpg",
            title: "Valentine Pertama",
            description: "Makan malam romantis dengan lilin dan bunga mawar yang kau berikan. Saat itu aku menyadari betapa beruntungnya aku memilikimu.",
            likes: 38,
            tags: ["Valentine", "Dinner"]
        },
        {
            id: 3,
            date: "20 Maret 2026",
            category: "travel",
            image: "assets/images/memories/beach.jpg",
            title: "Liburan ke Pantai",
            description: "Matahari terbenam yang indah sambil berjalan berpegangan tangan di pasir. Lautan biru dan senyumanmu adalah pemandangan terindah.",
            likes: 56,
            tags: ["Beach", "Sunset"]
        },
        {
            id: 4,
            date: "10 April 2026",
            category: "achievements",
            image: "assets/images/memories/graduation.jpg",
            title: "Wisuda Bersama",
            description: "Merayakan kelulusan bersama, mengawali perjalanan hidup baru. Kau selalu ada di sampingku di setiap pencapaian.",
            likes: 47,
            tags: ["Graduation", "Achievement"]
        },
        {
            id: 5,
            date: "25 Mei 2026",
            category: "surprises",
            image: "assets/images/memories/birthday.jpg",
            title: "Ulang Tahun Kejutan",
            description: "Party kejutan yang kau buat dengan semua teman-teman terdekat. Air mataku hampir keluar karena terharu.",
            likes: 51,
            tags: ["Birthday", "Surprise"]
        },
        {
            id: 6,
            date: "1 Juni 2026",
            category: "firsts",
            image: "assets/images/memories/holding-hands.jpg",
            title: "Pegangan Tangan Pertama",
            description: "Genggaman tanganmu yang hangat membuatku merasa aman dan dicintai. Saat itu aku tahu, ini adalah awal dari sesuatu yang indah.",
            likes: 39,
            tags: ["First Time", "Romantic"]
        }
    ];

    // Initialize memories grid
    function initializeMemoriesGrid() {
        memoriesGrid.innerHTML = '';
        memoriesData.forEach(memory => {
            const memoryCard = createMemoryCard(memory);
            memoriesGrid.appendChild(memoryCard);
        });
    }

    // Create memory card element
    function createMemoryCard(memory) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.category = memory.category;
        card.dataset.id = memory.id;
        
        card.innerHTML = `
            <div class="memory-image">
                <img src="${memory.image}" alt="${memory.title}">
                <div class="memory-date">${memory.date}</div>
            </div>
            <div class="memory-content">
                <span class="memory-category">${getCategoryLabel(memory.category)}</span>
                <h3 class="memory-title">${memory.title}</h3>
                <p class="memory-description">${memory.description}</p>
                <div class="memory-footer">
                    <div class="memory-likes">
                        <i class="fas fa-heart"></i>
                        <span>${memory.likes}</span>
                    </div>
                    <button class="view-memory-btn" data-id="${memory.id}">
                        Lihat Detail <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add click event to view button
        card.querySelector('.view-memory-btn').addEventListener('click', () => {
            showMemoryDetail(memory.id);
        });
        
        // Add click event to entire card
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.view-memory-btn')) {
                showMemoryDetail(memory.id);
            }
        });
        
        return card;
    }

    // Get category label
    function getCategoryLabel(category) {
        const labels = {
            'firsts': 'Pertama Kali',
            'dates': 'Kencan',
            'travel': 'Perjalanan',
            'achievements': 'Pencapaian',
            'surprises': 'Kejutan'
        };
        return labels[category] || category;
    }

    // Show memory detail modal
    function showMemoryDetail(memoryId) {
        const memory = memoriesData.find(m => m.id === memoryId);
        if (!memory) return;
        
        const modal = document.getElementById('memory-modal');
        const modalDate = document.getElementById('modal-date');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        modalDate.textContent = memory.date;
        modalTitle.textContent = memory.title;
        modalDescription.textContent = memory.description;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close memory modal
    modalClose.addEventListener('click', () => {
        memoryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    memoryModal.addEventListener('click', (e) => {
        if (e.target === memoryModal) {
            memoryModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.dataset.category;
            filterMemories(category);
        });
    });

    // Filter memories by category
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

    // Character count for note textarea
    noteContent.addEventListener('input', () => {
        const count = noteContent.value.length;
        charCount.textContent = count;
        
        if (count > 500) {
            noteContent.value = noteContent.value.substring(0, 500);
            charCount.textContent = 500;
            charCount.style.color = 'var(--color-accent-pink)';
        } else if (count > 450) {
            charCount.style.color = 'var(--color-accent-pink)';
        } else {
            charCount.style.color = 'var(--color-gray)';
        }
    });

    // Load love notes from Supabase
    async function loadLoveNotes() {
        try {
            const { data, error } = await supabase
                .from('love_notes')
                .select('*')
                .eq('approved', true)
                .order('created_at', { ascending: false })
                .limit(10);
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                displayLoveNotes(data);
            } else {
                loveNotesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-heart"></i>
                        <p>Belum ada catatan kenangan. Jadilah yang pertama!</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading love notes:', error);
            loveNotesContainer.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Gagal memuat catatan kenangan. Silakan coba lagi nanti.</p>
                </div>
            `;
        }
    }

    // Display love notes
    function displayLoveNotes(notes) {
        loveNotesContainer.innerHTML = '';
        
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'love-note-card';
            
            const date = new Date(note.created_at);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            noteCard.innerHTML = `
                <div class="note-header">
                    <div class="note-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="note-info">
                        <h3 class="note-author">${note.author}</h3>
                        <div class="note-meta">
                            <span class="note-date">${formattedDate}</span>
                            <span class="note-category">${note.category}</span>
                        </div>
                    </div>
                </div>
                <div class="note-content">
                    <p>${note.content}</p>
                </div>
                <div class="note-actions">
                    <button class="note-action-btn like-btn" data-id="${note.id}">
                        <i class="fas fa-heart"></i>
                        <span>${note.likes || 0}</span>
                    </button>
                    <button class="note-action-btn reply-btn">
                        <i class="fas fa-reply"></i>
                        <span>Balas</span>
                    </button>
                </div>
            `;
            
            loveNotesContainer.appendChild(noteCard);
        });
    }

    // Submit new love note
    submitNoteBtn.addEventListener('click', async () => {
        const author = document.getElementById('note-author').value.trim();
        const category = document.getElementById('note-category').value;
        const content = noteContent.value.trim();
        
        // Validation
        if (!author || !content || !category) {
            showNotification('Harap isi semua field yang diperlukan', 'error');
            return;
        }
        
        if (content.length < 10) {
            showNotification('Catatan terlalu pendek', 'error');
            return;
        }
        
        try {
            submitNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
            submitNoteBtn.disabled = true;
            
            const { data, error } = await supabase
                .from('love_notes')
                .insert([
                    {
                        author: author,
                        category: category,
                        content: content,
                        approved: false, // Admin harus approve dulu
                        likes: 0
                    }
                ]);
            
            if (error) throw error;
            
            // Clear form
            document.getElementById('note-author').value = '';
            document.getElementById('note-category').value = '';
            noteContent.value = '';
            charCount.textContent = '0';
            
            showNotification('Catatan berhasil dikirim! Menunggu persetujuan admin.', 'success');
            
            // Reload notes
            loadLoveNotes();
            
        } catch (error) {
            console.error('Error submitting note:', error);
            showNotification('Gagal mengirim catatan. Silakan coba lagi.', 'error');
        } finally {
            submitNoteBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Simpan Kenangan';
            submitNoteBtn.disabled = false;
        }
    });

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-white);
            padding: 15px 25px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            z-index: 3000;
            border-left: 4px solid var(--color-gray);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left-color: var(--color-mint);
        }
        
        .notification.error {
            border-left-color: var(--color-accent-pink);
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: var(--color-mint);
        }
        
        .notification.error i {
            color: var(--color-accent-pink);
        }
        
        .empty-state, .error-state {
            text-align: center;
            padding: 40px;
            color: var(--color-gray);
        }
        
        .empty-state i, .error-state i {
            font-size: 3rem;
            color: var(--color-accent-pink);
            margin-bottom: 20px;
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);

    // Initialize everything
    initializeMemoriesGrid();
    loadLoveNotes();
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && memoryModal.classList.contains('active')) {
            memoryModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});
