// Memories JavaScript
class MemoriesApp {
    constructor() {
        this.memories = [];
        this.memoryJar = [];
        this.notes = [];
        
        this.init();
    }

    init() {
        // Load sample data
        this.loadSampleMemories();
        this.loadSampleNotes();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize stats
        this.updateStats();
        
        // Initialize memory jar
        this.initMemoryJar();
        
        // Initialize modal
        this.initModal();
        
        // Initialize particles
        this.initParticles();
    }

    loadSampleMemories() {
        this.memories = [
            {
                id: 1,
                title: 'Pertemuan Pertama',
                date: '17 Desember 2025',
                description: 'Mata kita bertemu untuk pertama kalinya di sebuah kafe kecil. Hujan yang deras mempertemukan dua jiwa yang mencari tempat berteduh.',
                location: 'Kafe Senja, Jakarta',
                icon: 'fa-heart'
            },
            {
                id: 2,
                title: 'Kencan Pertama',
                date: '24 Desember 2025',
                description: 'Makan malam pertama yang penuh dengan tawa dan cerita. Restoran itu menjadi saksi awal cerita indah kita.',
                location: 'La Bella Italia, Kemang',
                icon: 'fa-utensils'
            },
            {
                id: 3,
                title: 'Liburan Pertama',
                date: '15 Januari 2026',
                description: 'Perjalanan pertama ke pantai bersama. Matahari terbenam, deburan ombak, dan pelukan hangat.',
                location: 'Pantai Anyer, Banten',
                icon: 'fa-plane'
            }
        ];
    }

    loadSampleNotes() {
        this.notes = [
            {
                id: 1,
                content: "Hari ini kamu membuat kopi untukku tanpa aku minta. Hal kecil itu membuat hariku cerah.",
                author: "Nama Pria",
                date: "20 Januari 2026"
            },
            {
                id: 2,
                content: "Tertawamu adalah musik terindah yang pernah kudengar. Aku bisa mendengarnya sepanjang hari.",
                author: "Nama Wanita",
                date: "5 Februari 2026"
            },
            {
                id: 3,
                content: "Kamu datang menjemputku saat hujan deras meski tahu aku bisa naik taksi. Itu yang membuatku jatuh cinta.",
                author: "Nama Pria",
                date: "14 Maret 2026"
            },
            {
                id: 4,
                content: "Pelajaran terbesar darimu: cinta itu tentang memberi, bukan menerima. Terima kasih telah mengajariku.",
                author: "Nama Wanita",
                date: "30 April 2026"
            }
        ];
        
        // Render initial notes
        this.renderNotes();
    }

    initEventListeners() {
        // Add memory to jar
        const addMemoryBtn = document.getElementById('add-memory');
        if (addMemoryBtn) {
            addMemoryBtn.addEventListener('click', () => {
                this.addMemoryToJar();
            });
        }

        // Add note
        const saveNoteBtn = document.getElementById('save-note');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => {
                this.addNewNote();
            });
        }

        // Enter key for memory input
        const memoryInput = document.getElementById('new-memory');
        if (memoryInput) {
            memoryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addMemoryToJar();
                }
            });
        }

        // Enter key for note input
        const noteInput = document.getElementById('new-note');
        if (noteInput) {
            noteInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addNewNote();
                }
            });
        }
    }

    updateStats() {
        // Update special moments count
        const momentsElement = document.getElementById('special-moments');
        if (momentsElement) {
            momentsElement.textContent = this.memories.length;
        }

        // Update gifts exchanged (sample data)
        const giftsElement = document.getElementById('gifts-exchanged');
        if (giftsElement) {
            giftsElement.textContent = '24';
        }

        // Update places visited (sample data)
        const placesElement = document.getElementById('places-visited');
        if (placesElement) {
            placesElement.textContent = '12';
        }
    }

    initMemoryJar() {
        // Sample memory jar items
        this.memoryJar = [
            "Pertama kali kamu tersenyum padaku",
            "Ketika kita tersesat di mal bersama",
            "Momen kamu mengejutkanku dengan kue ulang tahun",
            "Saat kita menonton bintang bersama",
            "Ketika kamu memegang tanganku saat takut",
            "Momen pertama kita berfoto bersama",
            "Saat kamu membuatkan sarapan untukku",
            "Ketika kita tertawa sampai sakit perut",
            "Momen kita saling mengerti tanpa kata-kata",
            "Saat pertama kali kamu bilang 'aku cinta kamu'"
        ];

        // Render memory jar
        this.renderMemoryJar();
    }

    renderMemoryJar() {
        const jarBody = document.getElementById('memory-jar');
        if (!jarBody) return;

        jarBody.innerHTML = '';

        this.memoryJar.forEach((memory, index) => {
            const memoryElement = document.createElement('div');
            memoryElement.className = 'memory-piece';
            memoryElement.textContent = memory;
            memoryElement.setAttribute('data-index', index);
            
            memoryElement.addEventListener('click', () => {
                this.showMemoryModal(memory);
            });

            jarBody.appendChild(memoryElement);
        });
    }

    addMemoryToJar() {
        const input = document.getElementById('new-memory');
        const memory = input.value.trim();

        if (memory) {
            // Add to memory jar array
            this.memoryJar.unshift(memory);
            
            // Clear input
            input.value = '';
            
            // Re-render memory jar
            this.renderMemoryJar();
            
            // Show success message
            this.showNotification('Kenangan berhasil ditambahkan!', 'success');
            
            // Add animation to new memory
            const jarBody = document.getElementById('memory-jar');
            if (jarBody && jarBody.firstChild) {
                jarBody.firstChild.style.animation = 'bounceIn 0.6s ease';
            }
        } else {
            this.showNotification('Tulis kenangan terlebih dahulu!', 'error');
        }
    }

    renderNotes() {
        const notesGrid = document.querySelector('.notes-grid');
        if (!notesGrid) return;

        notesGrid.innerHTML = '';

        this.notes.forEach(note => {
            const noteElement = this.createNoteElement(note);
            notesGrid.appendChild(noteElement);
        });
    }

    createNoteElement(note) {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.setAttribute('data-aos', 'flip-left');

        div.innerHTML = `
            <div class="note-content">
                <p>${note.content}</p>
            </div>
            <div class="note-meta">
                <span class="note-author">${note.author}</span>
                <span class="note-date">${note.date}</span>
            </div>
        `;

        return div;
    }

    addNewNote() {
        const noteInput = document.getElementById('new-note');
        const authorSelect = document.getElementById('note-author');
        
        const content = noteInput.value.trim();
        const author = authorSelect.value === 'him' ? 'Nama Pria' : 'Nama Wanita';
        
        if (content) {
            // Create new note object
            const newNote = {
                id: this.notes.length + 1,
                content: content,
                author: author,
                date: new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            };

            // Add to notes array
            this.notes.unshift(newNote);
            
            // Clear input
            noteInput.value = '';
            
            // Re-render notes
            this.renderNotes();
            
            // Show success message
            this.showNotification('Catatan cinta berhasil disimpan! 💕', 'success');
            
            // Trigger AOS refresh for new elements
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        } else {
            this.showNotification('Tulis catatan terlebih dahulu!', 'error');
        }
    }

    initModal() {
        const modal = document.getElementById('memory-modal');
        const closeBtn = document.getElementById('modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showMemoryModal(memory) {
        const modal = document.getElementById('memory-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        const modalDate = document.getElementById('modal-date');

        if (modal && modalTitle && modalContent && modalDate) {
            modalTitle.textContent = 'Kenangan Indah';
            modalContent.textContent = memory;
            modalDate.textContent = 'Hari ini';
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('memory-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 15px 25px;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    transform: translateX(400px);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    max-width: 300px;
                    border-left: 4px solid var(--color-accent-pink);
                }
                
                .notification.success {
                    border-left-color: var(--color-mint);
                }
                
                .notification.error {
                    border-left-color: #ff4757;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification i {
                    font-size: 1.2rem;
                }
                
                .notification.success i {
                    color: var(--color-mint);
                }
                
                .notification.error i {
                    color: #ff4757;
                }
                
                .notification span {
                    color: var(--color-dark);
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 3000);
    }

    initParticles() {
        // Initialize particles for hero section
        if (typeof particlesJS !== 'undefined') {
            particlesJS('memories-particles', {
                particles: {
                    number: { value: 50 },
                    color: { value: ['#FF6B9D', '#B8DB80'] },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    move: { 
                        enable: true,
                        speed: 0.8,
                        direction: 'none',
                        random: true
                    }
                }
            });
        }
    }
}

// Initialize memories app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const memoriesApp = new MemoriesApp();
    
    // Add current year to footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
