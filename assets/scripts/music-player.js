// Kontrol musik latar
document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const musicIcon = musicToggle.querySelector('i');
    const musicText = musicToggle.querySelector('.music-text');
    
    // Status musik
    let isPlaying = false;
    
    // Fungsi untuk mengganti ikon musik
    function updateMusicButton() {
        if (isPlaying) {
            musicIcon.className = 'fas fa-pause';
            musicText.textContent = 'Jeda Musik';
            musicToggle.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))';
        } else {
            musicIcon.className = 'fas fa-music';
            musicText.textContent = 'Putar Musik';
            musicToggle.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-accent))';
        }
    }
    
    // Event listener untuk tombol musik
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
        } else {
            // Coba putar musik
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    updateMusicButton();
                }).catch(error => {
                    // Jika autoplay diblokir, tampilkan pesan
                    console.log("Autoplay prevented:", error);
                    alert("Silakan klik tombol Putar Musik untuk memulai musik. Beberapa browser memerlukan interaksi pengguna terlebih dahulu.");
                });
            }
        }
        updateMusicButton();
    });
    
    // Putar musik otomatis dengan volume rendah
    backgroundMusic.volume = 0.3;
    
    // Opsional: Tombol mute/unmute
    const muteButton = document.createElement('button');
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    muteButton.className = 'music-btn mute-btn';
    muteButton.style.marginTop = '10px';
    
    muteButton.addEventListener('click', function() {
        if (backgroundMusic.muted) {
            backgroundMusic.muted = false;
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            backgroundMusic.muted = true;
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    document.querySelector('.music-player').appendChild(muteButton);
    
    // Update teks tombol musik di mobile
    function updateMusicText() {
        if (window.innerWidth <= 768) {
            musicText.textContent = '';
        } else {
            musicText.textContent = isPlaying ? 'Jeda Musik' : 'Putar Musik';
        }
    }
    
    window.addEventListener('resize', updateMusicText);
    updateMusicText();
});
