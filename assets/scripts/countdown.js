// Countdown untuk anniversary jadian (17 Desember)
document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk mendapatkan tanggal anniversary berikutnya
    function getNextAnniversaryDate() {
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Buat tanggal anniversary tahun ini (17 Desember tahun ini)
        const anniversaryThisYear = new Date(currentYear, 11, 17); // Desember = bulan 11 (0-indexed)
        
        // Jika tanggal anniversary tahun ini sudah lewat, gunakan tahun depan
        if (today > anniversaryThisYear) {
            return new Date(currentYear + 1, 11, 17);
        } else {
            return anniversaryThisYear;
        }
    }
    
    // Fungsi untuk menghitung berapa anniversary ke berapa
    function calculateAnniversaryNumber(startDate, currentDate) {
        const start = new Date(startDate);
        const current = new Date(currentDate);
        
        // Hitung selisih tahun
        const yearsDiff = current.getFullYear() - start.getFullYear();
        
        // Cek apakah anniversary tahun ini sudah lewat atau belum
        const anniversaryThisYear = new Date(current.getFullYear(), 11, 17);
        
        if (current < anniversaryThisYear) {
            return yearsDiff;
        } else {
            return yearsDiff + 1;
        }
    }
    
    // Tanggal mulai jadian
    const startDate = new Date('2025-12-17'); // Format: Tahun-Bulan-Hari
    const anniversaryNumber = calculateAnniversaryNumber(startDate, new Date());
    
    // Update teks anniversary
    document.getElementById('anniversary-year').textContent = anniversaryNumber;
    
    // Tanggal anniversary berikutnya
    const nextAnniversary = getNextAnniversaryDate();
    
    // Format tanggal untuk ditampilkan
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = nextAnniversary.toLocaleDateString('id-ID', options);
    
    // Update elemen dengan tanggal berikutnya
    const nextDateElement = document.querySelector('.next-date');
    if (nextDateElement) {
        nextDateElement.textContent = formattedDate;
    }
    
    // Update countdown setiap detik
    function updateCountdown() {
        const now = new Date().getTime();
        const timeRemaining = nextAnniversary.getTime() - now;
        
        // Perhitungan waktu
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Tampilkan hasil di elemen HTML
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Jika countdown selesai, tampilkan pesan dan reset untuk tahun berikutnya
        if (timeRemaining < 0) {
            // Tampilkan pesan selamat
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                countdownContainer.innerHTML = `
                    <div class="countdown-message">
                        <h3>Selamat Anniversary!</h3>
                        <p>Hari yang ditunggu-tunggu akhirnya tiba! 🎉</p>
                        <p>Ini adalah anniversary ke-${anniversaryNumber} kalian!</p>
                        <button id="next-anniversary-btn">Lihat Countdown Berikutnya</button>
                    </div>
                `;
                
                // Tambahkan event listener untuk tombol
                document.getElementById('next-anniversary-btn').addEventListener('click', function() {
                    location.reload(); // Reload halaman untuk reset countdown
                });
            }
            
            // Hentikan interval
            clearInterval(countdownInterval);
        }
    }
    
    // Jalankan countdown pertama kali
    updateCountdown();
    
    // Update countdown setiap detik
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Update waktu otomatis saat berpindah tab/window
    let isPageVisible = true;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            isPageVisible = false;
        } else {
            isPageVisible = true;
            // Update countdown saat kembali ke tab
            updateCountdown();
        }
    });
    
    // Update juga saat window mendapatkan fokus kembali
    window.addEventListener('focus', function() {
        updateCountdown();
    });
    
    // Tambahkan efek khusus untuk countdown
    const countdownValues = document.querySelectorAll('.countdown-value');
    
    // Animasi saat countdown berubah
    let lastValues = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    };
    
    // Fungsi untuk animasi perubahan angka
    function animateValueChange(element, newValue, oldValue) {
        if (newValue !== oldValue) {
            element.classList.add('changing');
            setTimeout(() => {
                element.classList.remove('changing');
            }, 300);
        }
    }
    
    // Periksa perubahan nilai setiap detik
    setInterval(function() {
        const currentValues = {
            days: document.getElementById('days').textContent,
            hours: document.getElementById('hours').textContent,
            minutes: document.getElementById('minutes').textContent,
            seconds: document.getElementById('seconds').textContent
        };
        
        animateValueChange(document.getElementById('days'), currentValues.days, lastValues.days);
        animateValueChange(document.getElementById('hours'), currentValues.hours, lastValues.hours);
        animateValueChange(document.getElementById('minutes'), currentValues.minutes, lastValues.minutes);
        animateValueChange(document.getElementById('seconds'), currentValues.seconds, lastValues.seconds);
        
        lastValues = { ...currentValues };
    }, 1000);
    
    // Fungsi untuk update "Bersama sejak" di hero section
    function updateAnniversaryInfo() {
        const startDateFormatted = new Date('2025-12-17').toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const anniversaryInfoElement = document.querySelector('.anniversary-date span');
        if (anniversaryInfoElement) {
            anniversaryInfoElement.textContent = `Bersama sejak: ${startDateFormatted}`;
        }
    }
    
    // Panggil fungsi untuk update info anniversary
    updateAnniversaryInfo();
});

// Tambahkan CSS untuk animasi perubahan angka
const style = document.createElement('style');
style.textContent = `
    .countdown-value.changing {
        animation: countdownPulse 0.3s ease;
        color: #FF6B9D;
    }
    
    @keyframes countdownPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .countdown-message {
        text-align: center;
        padding: 2rem;
        background: linear-gradient(135deg, #FFE4EF, #B8DB80);
        border-radius: 10px;
        color: #333;
        animation: fadeIn 0.5s ease;
    }
    
    .countdown-message h3 {
        font-size: 2.5rem;
        color: #FF6B9D;
        margin-bottom: 1rem;
        font-family: 'Dancing Script', cursive;
    }
    
    .countdown-message p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }
    
    #next-anniversary-btn {
        background-color: #FF6B9D;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 30px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
    }
    
    #next-anniversary-btn:hover {
        background-color: #333;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Fungsi untuk menampilkan status countdown yang lebih informatif
function updateCountdownStatus(days) {
    const statusElement = document.getElementById('countdown-status');
    if (!statusElement) return;
    
    let statusMessage = '';
    
    if (days > 30) {
        const months = Math.floor(days / 30);
        statusMessage = `Masih ${months} bulan ${days % 30} hari lagi!`;
    } else if (days > 7) {
        const weeks = Math.floor(days / 7);
        statusMessage = `Tinggal ${weeks} minggu ${days % 7} hari lagi!`;
    } else if (days > 1) {
        statusMessage = `Tinggal ${days} hari lagi!`;
    } else if (days === 1) {
        statusMessage = `Besok adalah hari anniversary! 🎉`;
    } else if (days === 0) {
        statusMessage = `Hari ini adalah hari anniversary! Selamat! 🥳`;
    } else {
        statusMessage = `Hitung mundur untuk anniversary berikutnya!`;
    }
    
    statusElement.textContent = statusMessage;
}

// Panggil fungsi ini di dalam updateCountdown(), setelah perhitungan hari:
function updateCountdown() {
    // ... kode sebelumnya ...
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    // ... perhitungan lainnya ...
    
    // Update status
    updateCountdownStatus(days);
    
    // ... kode selanjutnya ...
}
