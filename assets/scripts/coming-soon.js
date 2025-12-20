// Coming Soon Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set tanggal target (misal: 7 hari dari sekarang)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    // Update countdown setiap detik
    function updateCountdown() {
        const now = new Date().getTime();
        const timeRemaining = targetDate.getTime() - now;
        
        // Hitung hari, jam, menit, detik
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Update elemen HTML
        document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Update progress bar berdasarkan waktu
        const totalTime = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
        const timePassed = totalTime - timeRemaining;
        const progressPercent = Math.min(65 + Math.floor((timePassed / totalTime) * 35), 99);
        
        document.getElementById('progress-fill').style.width = progressPercent + '%';
        document.getElementById('progress-text').textContent = progressPercent + '%';
        
        // Jika countdown selesai
        if (timeRemaining < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-container').innerHTML = `
                <div class="countdown-complete">
                    <h3>🎉 Waktunya tiba! 🎉</h3>
                    <p>Halaman sedang dipublikasikan...</p>
                    <div class="loading-spinner"></div>
                </div>
            `;
            
            // Redirect ke halaman asli setelah 3 detik
            setTimeout(() => {
                window.location.href = 'memories.html';
            }, 3000);
        }
    }
    
    // Jalankan countdown pertama kali
    updateCountdown();
    
    // Update countdown setiap detik
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Form notifikasi
    const notifyForm = document.getElementById('notify-form');
    const notifyEmail = document.getElementById('notify-email');
    
    if (notifyForm) {
        notifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = notifyEmail.value.trim();
            
            if (!email || !isValidEmail(email)) {
                showNotification('Masukkan email yang valid!', 'error');
                return;
            }
            
            // Simpan email ke localStorage (simulasi)
            localStorage.setItem('notifyEmail', email);
            
            // Tampilkan pesan sukses
            showNotification('Terima kasih! Kami akan memberitahu Anda saat halaman sudah siap.', 'success');
            
            // Reset form
            notifyForm.reset();
            
            // Update tombol
            const notifyBtn = notifyForm.querySelector('.notify-btn');
            const originalText = notifyBtn.innerHTML;
            notifyBtn.innerHTML = '<i class="fas fa-check"></i> Terdaftar!';
            notifyBtn.disabled = true;
            notifyBtn.style.background = 'var(--color-secondary)';
            
            // Kembalikan setelah 3 detik
            setTimeout(() => {
                notifyBtn.innerHTML = originalText;
                notifyBtn.disabled = false;
                notifyBtn.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))';
            }, 3000);
        });
    }
    
    // Validasi email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, type) {
        // Hapus notifikasi sebelumnya jika ada
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Buat elemen notifikasi baru
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Tambahkan ke body
        document.body.appendChild(notification);
        
        // Tampilkan dengan animasi
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto hide setelah 5 detik
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Tombol close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // Tambahkan CSS untuk notifikasi
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification-toast {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        
        .notification-toast.show {
            transform: translateX(0);
        }
        
        .notification-toast.success {
            border-left: 5px solid var(--color-secondary);
        }
        
        .notification-toast.error {
            border-left: 5px solid #ff4757;
        }
        
        .notification-toast i {
            font-size: 1.5rem;
        }
        
        .notification-toast.success i {
            color: var(--color-secondary);
        }
        
        .notification-toast.error i {
            color: #ff4757;
        }
        
        .notification-toast span {
            flex: 1;
            color: var(--color-dark);
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: #f5f5f5;
            color: var(--color-dark);
        }
        
        .countdown-complete {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            border-radius: 15px;
            color: white;
        }
        
        .countdown-complete h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // Check jika email sudah terdaftar sebelumnya
    const savedEmail = localStorage.getItem('notifyEmail');
    if (savedEmail) {
        notifyEmail.value = savedEmail;
        showNotification('Email Anda sudah terdaftar untuk notifikasi.', 'success');
    }
    
    // Animasi untuk feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    // Animasi untuk alternative links
    const altLinks = document.querySelectorAll('.alt-link');
    altLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
});
