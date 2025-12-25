// 🔥 PASSWORD PROTECTION SYSTEM
async function saveLoveNote() {
    // 1. Ambil input
    const content = document.getElementById('note-content').value;
    const author = document.getElementById('note-author').value;
    
    // 2. Cek isi
    if (!content.trim()) {
        alert('Isi dulu sayang! ❤️');
        return;
    }
    
    // 3. Minta password
    const PASSWORD = 'sm121809'; // Password kalian
    const userPassword = prompt('🔒 Password Rahasia:');
    
    // 4. Cek password
    if (userPassword !== PASSWORD) {
        alert('❌ Akses ditolak! Hanya untuk kalian berdua.');
        return;
    }
    
    // 5. Kirim ke database
    try {
        // Loading...
        const btn = document.querySelector('.add-note-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        btn.disabled = true;
        
        // Kirim ke Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/love_notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({
                couple_id: COUPLE_ID,
                author: author,
                content: content
            })
        });
        
        if (response.ok) {
            alert('💌✅ Note terkirim!');
            document.getElementById('note-content').value = '';
            loadLoveNotes();
        }
        
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
        
    } catch (error) {
        console.error('Error:', error);
        alert('Simpan lokal dulu ya!');
        
        // Backup ke localStorage
        const notes = JSON.parse(localStorage.getItem('love_notes') || '[]');
        notes.push({
            couple_id: COUPLE_ID,
            author: author,
            content: content,
            date: new Date(),
            local: true
        });
        localStorage.setItem('love_notes', JSON.stringify(notes));
        loadLoveNotes();
    }
}

// Load notes function
async function loadLoveNotes() {
    // ... (kode yang sama)
}
