/**
 * AUTHENTICATION CHECK SCRIPT - RESPONSIVE VERSION
 * Cek login dan buat logout button untuk PC & Mobile
 */

// Konfigurasi
const LOGIN_PAGE = 'index';
const VALID_USERS = ['Capi', 'Cipi'];
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 jam (dalam milliseconds)

// Cache DOM elements
let domCache = {};

// Fungsi utama untuk cek authentication
function checkAuth() {
    console.log('🔒 Starting authentication check...');
    
    // Ambil data dari sessionStorage
    const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
    const currentUser = sessionStorage.getItem('loveUser');
    const loginTime = sessionStorage.getItem('loginTime');
    
    // Debug info
    console.log('📊 Auth Status:', { isLoggedIn, currentUser, loginTime });
    
    // Cek session timeout
    if (loginTime && (Date.now() - parseInt(loginTime)) > SESSION_TIMEOUT) {
        console.log('⏰ Session expired due to timeout');
        sessionStorage.clear();
        redirectToLogin();
        return false;
    }
    
    // Cek jika belum login atau user tidak valid
    if (!isLoggedIn || !currentUser || !VALID_USERS.includes(currentUser)) {
        console.log('❌ Not authenticated or invalid user');
        showLoginOverlay(currentUser || 'Unknown');
        return false;
    }
    
    // Jika sudah login, setup UI
    console.log('✅ User authenticated:', currentUser);
    setupAuthenticatedUI(currentUser);
    return true;
}

// Setup UI untuk user yang sudah login
function setupAuthenticatedUI(user) {
    // Tunggu hingga DOM siap
    setTimeout(() => {
        // Setup logout untuk PC (navbar)
        setupDesktopLogout(user);
        
        // Setup logout untuk Mobile (hamburger menu)
        setupMobileLogout(user);
        
        // Update page title
        updatePageTitle(user);
        
        // Tampilkan welcome message
        showWelcomeMessage(user);
        
        // Setup event listeners
        setupEventListeners();
        
        // Start session monitor
        startSessionMonitor();
        
    }, 800); // Delay untuk pastikan navbar sudah load
}

// Setup logout button untuk PC (Desktop)
function setupDesktopLogout(user) {
    console.log('🖥️ Setting up desktop logout for:', user);
    
    // Cari navbar container
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navContainer) {
        console.warn('Nav container not found, retrying...');
        setTimeout(() => setupDesktopLogout(user), 500);
        return;
    }
    
    // Hapus existing user info jika ada
    const existingInfo = document.querySelector('.user-info-container');
    if (existingInfo) existingInfo.remove();
    
    // Buat container info user untuk desktop
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info-container';
    userInfo.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">
                <i class="fas fa-user-heart"></i>
            </div>
            <div class="user-details">
                <span class="user-name">${user}</span>
                <button class="logout-btn desktop-logout" title="Logout dari akun ${user}">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
    
    // Tambahkan ke navbar (sebelah kanan)
    navContainer.appendChild(userInfo);
    
    // Tambahkan styles jika belum ada
    addAuthStyles();
}

// Setup logout untuk Mobile
function setupMobileLogout(user) {
    console.log('📱 Setting up mobile logout for:', user);
    
    // Cari nav menu
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) {
        console.warn('Nav menu not found for mobile, retrying...');
        setTimeout(() => setupMobileLogout(user), 500);
        return;
    }
    
    // Cek jika sudah ada logout mobile item
    const existingMobileLogout = document.querySelector('.nav-link.mobile-logout');
    if (existingMobileLogout) existingMobileLogout.remove();
    
    // Buat logout item untuk mobile menu
    const mobileLogoutItem = document.createElement('a');
    mobileLogoutItem.className = 'nav-link mobile-logout';
    mobileLogoutItem.href = '#';
    mobileLogoutItem.innerHTML = `
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout (${user})</span>
    `;
    
    // Tambahkan event listener
    mobileLogoutItem.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Tambahkan ke nav menu (di bagian akhir)
    navMenu.appendChild(mobileLogoutItem);
    
    // Update mobile menu toggle jika ada
    updateMobileMenuToggle();
}

// Update mobile menu toggle behavior
function updateMobileMenuToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        // Clone existing toggle untuk reset event listeners
    }
}

// Tampilkan welcome message
function showWelcomeMessage(user) {
    // Cek jika sudah ada welcome message hari ini
    const lastWelcome = localStorage.getItem(`lastWelcome_${user}`);
    const today = new Date().toDateString();
    
    if (lastWelcome === today) {
        console.log('Welcome message already shown today');
        return;
    }
    
    // Buat welcome toast
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas fa-heart"></i>
            </div>
            <div class="toast-text">
                <strong>Selamat datang kembali, ${user}! 💖</strong>
                <span>Momen indah kita menanti...</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Simpan tanggal welcome
    localStorage.setItem(`lastWelcome_${user}`, today);
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Fungsi logout
function logout(immediate = false) {
    if (!immediate) {
        // Tampilkan custom confirm dialog
        showLogoutConfirmation();
        return;
    }
    
    // Proses logout
    console.log('👋 Logging out...');
    
    // Hapus session data
    sessionStorage.removeItem('loveLoggedIn');
    sessionStorage.removeItem('loveUser');
    sessionStorage.removeItem('loginTime');
    
    // Hapus redirect URL
    sessionStorage.removeItem('redirectAfterLogin');
    
    // Tampilkan logout message
    showLogoutMessage();
    
    // Redirect setelah delay
    setTimeout(() => {
        window.location.href = LOGIN_PAGE;
    }, 1500);
}

// Tampilkan custom logout confirmation
function showLogoutConfirmation() {
    // Buat modal konfirmasi
    const modal = document.createElement('div');
    modal.className = 'logout-modal-overlay';
    modal.innerHTML = `
        <div class="logout-modal">
            <div class="modal-icon">
                <i class="fas fa-heart-broken"></i>
            </div>
            <h3>Yakin mau keluar? 😢</h3>
            <p>Kamu akan meninggalkan dunia cinta kita...</p>
            <div class="modal-actions">
                <button class="modal-btn cancel-btn">
                    <i class="fas fa-times"></i> Tidak, tetap di sini
                </button>
                <button class="modal-btn confirm-btn">
                    <i class="fas fa-sign-out-alt"></i> Ya, logout
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners untuk modal
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        modal.remove();
        logout(true); // Immediate logout
    });
    
    // Close modal jika klik di luar
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Tampilkan logout message
function showLogoutMessage() {
    const message = document.createElement('div');
    message.className = 'logout-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-heart"></i>
            <div class="message-text">
                <strong>Sampai jumpa lagi! 👋</strong>
                <span>Selalu menunggumu kembali...</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Auto remove
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Tampilkan login overlay jika belum login
function showLoginOverlay(user) {
    console.log('🔐 Showing login overlay');
    
    // Buat overlay
    const overlay = document.createElement('div');
    overlay.className = 'login-required-overlay';
    overlay.innerHTML = `
        <div class="login-required-content">
            <div class="login-required-icon">
                <i class="fas fa-lock-heart"></i>
            </div>
            <h2 class="login-required-title">Akses Terbatas 💝</h2>
            <p class="login-required-message">
                Halaman ini khusus untuk Capi & Cipi saja.<br>
                Masuk dengan password cinta kita untuk melihat kenangan indah.
            </p>
            <div class="login-required-actions">
                <button class="login-required-btn" id="goToLogin">
                    <i class="fas fa-sign-in-alt"></i> Ke Halaman Login
                </button>
                <button class="back-home-btn" id="goToHomepage">
                    <i class="fas fa-home"></i> Kembali ke Homepage
                </button>
            </div>
            <p class="login-hint">
                <i class="fas fa-lightbulb"></i>
                Password: tanggal spesial pertama kita (6 digit)
            </p>
        </div>
    `;
    
    // Hide existing content
    document.body.style.overflow = 'hidden';
    const mainContent = document.querySelector('main, .container, section');
    if (mainContent) mainContent.style.opacity = '0.3';
    
    document.body.appendChild(overlay);
    
    // Event listeners
    overlay.querySelector('#goToLogin').addEventListener('click', redirectToLogin);
    overlay.querySelector('#goToHomepage').addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';
        if (mainContent) mainContent.style.opacity = '1';
    });
}

// Redirect ke login
function redirectToLogin() {
    console.log('🔄 Redirecting to login page...');
    
    // Simpan current URL untuk redirect back
    sessionStorage.setItem('redirectAfterLogin', window.location.href);
    
    // Add transition effect
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = LOGIN_PAGE;
    }, 500);
}

// Update page title
function updatePageTitle(user) {
    const title = document.querySelector('title');
    if (title && !title.textContent.includes(user)) {
        const originalTitle = title.textContent.replace(/^.*?\|/, '').trim();
        title.textContent = `${user}'s Love Story | ${originalTitle}`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button click (desktop)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.desktop-logout') || e.target.closest('.logout-btn')) {
            e.preventDefault();
            logout();
        }
    });
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.toggle('show');
                navToggle.classList.toggle('active');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target) &&
            navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });
}

// Start session monitor
function startSessionMonitor() {
    // Update last activity setiap 30 detik
    setInterval(() => {
        sessionStorage.setItem('lastActivity', Date.now());
    }, 30000);
    
    // Cek inactivity setiap menit
    setInterval(() => {
        const lastActivity = sessionStorage.getItem('lastActivity');
        const loginTime = sessionStorage.getItem('loginTime');
        
        if (lastActivity && loginTime) {
            const inactiveTime = Date.now() - parseInt(lastActivity);
            const totalTime = Date.now() - parseInt(loginTime);
            
            // Jika inactive lebih dari 30 menit ATAU session lebih dari 24 jam
            if (inactiveTime > 30 * 60 * 1000 || totalTime > SESSION_TIMEOUT) {
                console.log('🕐 Session timeout due to inactivity');
                logout(true);
            }
        }
    }, 60000); // Cek setiap 1 menit
}

// Tambahkan styles untuk auth components
function addAuthStyles() {
    const styleId = 'auth-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* ===== AUTH STYLES ===== */
            
            /* User Info for Desktop */
            .user-info-container {
                margin-left: auto;
                display: flex;
                align-items: center;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(184, 219, 128, 0.1));
                padding: 10px 18px;
                border-radius: 25px;
                border: 2px solid transparent;
                border-image: linear-gradient(135deg, #FF6B9D, #B8DB80) 1;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                overflow: hidden;
            }
            
            .user-info::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                transition: left 0.6s;
            }
            
            .user-info:hover::before {
                left: 100%;
            }
            
            .user-info:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(255, 107, 157, 0.2);
            }
            
            .user-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FF6B9D 0%, #B8DB80 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.1rem;
                box-shadow: 0 4px 10px rgba(255, 107, 157, 0.3);
                transition: transform 0.3s ease;
            }
            
            .user-info:hover .user-avatar {
                transform: rotate(15deg) scale(1.1);
            }
            
            .user-details {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            
            .user-name {
                font-weight: 700;
                color: #333;
                font-size: 0.95rem;
                font-family: 'Poppins', sans-serif;
            }
            
            .logout-btn {
                background: none;
                border: none;
                color: #FF6B9D;
                font-size: 0.8rem;
                cursor: pointer;
                padding: 0;
                text-align: left;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
            }
            
            .logout-btn:hover {
                color: #e0558a;
                gap: 8px;
                text-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
            }
            
            .logout-btn i {
                font-size: 0.8rem;
                transition: transform 0.3s ease;
            }
            
            .logout-btn:hover i {
                transform: translateX(2px);
            }
            
            /* Mobile Logout Item */
            .nav-link.mobile-logout {
                display: none;
                background: linear-gradient(to right, rgba(255, 107, 157, 0.1), rgba(184, 219, 128, 0.1));
                border-left: 4px solid #FF6B9D;
                margin-top: 10px;
                animation: slideInLeft 0.3s ease;
            }
            
            .nav-link.mobile-logout i {
                color: #FF6B9D;
            }
            
            .nav-link.mobile-logout span {
                color: #FF6B9D;
                font-weight: 600;
            }
            
            .nav-link.mobile-logout:hover {
                background: linear-gradient(to right, rgba(255, 107, 157, 0.2), rgba(184, 219, 128, 0.2));
            }
            
            /* Welcome Toast */
            .welcome-toast {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                max-width: 380px;
            }
            
            .toast-content {
                background: white;
                border-radius: 18px;
                padding: 20px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                border: 2px solid transparent;
                border-image: linear-gradient(135deg, #FF6B9D, #B8DB80) 1;
                display: flex;
                align-items: center;
                gap: 18px;
                position: relative;
                overflow: hidden;
            }
            
            .toast-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 6px;
                height: 100%;
                background: linear-gradient(to bottom, #FF6B9D, #B8DB80);
            }
            
            .toast-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #FF6B9D, #FFA8C8);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                animation: heartbeat 1.5s infinite;
                flex-shrink: 0;
            }
            
            .toast-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .toast-text strong {
                color: #333;
                font-size: 1.1rem;
                font-weight: 700;
            }
            
            .toast-text span {
                color: #666;
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 1.1rem;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.3s ease;
                flex-shrink: 0;
                align-self: flex-start;
            }
            
            .toast-close:hover {
                background: #f5f5f5;
                color: #666;
                transform: rotate(90deg);
            }
            
            /* Login Required Overlay */
            .login-required-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(255, 228, 239, 0.98), rgba(184, 219, 128, 0.98));
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                backdrop-filter: blur(10px);
            }
            
            .login-required-content {
                background: white;
                padding: 50px 40px;
                border-radius: 25px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
                text-align: center;
                max-width: 500px;
                width: 100%;
                animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 3px solid transparent;
                border-image: linear-gradient(135deg, #FF6B9D, #B8DB80) 1;
            }
            
            .login-required-icon {
                font-size: 4.5rem;
                color: #FF6B9D;
                margin-bottom: 25px;
                animation: heartbeat 1.5s infinite;
            }
            
            .login-required-title {
                font-family: 'Playfair Display', serif;
                font-size: 2.2rem;
                color: #333;
                margin-bottom: 15px;
                font-weight: 700;
            }
            
            .login-required-message {
                color: #666;
                margin-bottom: 35px;
                line-height: 1.7;
                font-size: 1.1rem;
            }
            
            .login-required-actions {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .login-required-btn {
                background: linear-gradient(135deg, #FF6B9D, #FFA8C8);
                color: white;
                border: none;
                padding: 18px 30px;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
            }
            
            .login-required-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(255, 107, 157, 0.4);
            }
            
            .back-home-btn {
                background: white;
                color: #666;
                border: 2px solid #FFA8C8;
                padding: 16px 30px;
                border-radius: 15px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .back-home-btn:hover {
                background: #FFA8C8;
                color: white;
                border-color: #FFA8C8;
            }
            
            .login-hint {
                color: #888;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            
            .login-hint i {
                color: #B8DB80;
            }
            
            /* Logout Modal */
            .logout-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            }
            
            .logout-modal {
                background: white;
                padding: 40px;
                border-radius: 25px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 3px solid transparent;
                border-image: linear-gradient(135deg, #FF6B9D, #B8DB80) 1;
            }
            
            .modal-icon {
                font-size: 3.5rem;
                color: #FF6B9D;
                margin-bottom: 20px;
                animation: heartbeat 1.2s infinite;
            }
            
            .logout-modal h3 {
                font-family: 'Playfair Display', serif;
                color: #333;
                margin-bottom: 10px;
                font-size: 1.8rem;
            }
            
            .logout-modal p {
                color: #666;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
            }
            
            .modal-btn {
                flex: 1;
                padding: 16px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .cancel-btn {
                background: #f0f0f0;
                color: #666;
            }
            
            .cancel-btn:hover {
                background: #e0e0e0;
                transform: translateY(-2px);
            }
            
            .confirm-btn {
                background: linear-gradient(135deg, #FF6B9D, #e0558a);
                color: white;
                box-shadow: 0 6px 20px rgba(255, 107, 157, 0.3);
            }
            
            .confirm-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(255, 107, 157, 0.4);
            }
            
            /* Logout Message */
            .logout-message {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                animation: slideInRight 0.5s ease;
                max-width: 350px;
            }
            
            .message-content {
                background: white;
                border-radius: 18px;
                padding: 20px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                border-left: 6px solid #B8DB80;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .message-content i {
                font-size: 1.8rem;
                color: #B8DB80;
                animation: fadeInOut 2s infinite;
            }
            
            .message-text {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .message-text strong {
                color: #333;
                font-size: 1rem;
            }
            
            .message-text span {
                color: #666;
                font-size: 0.9rem;
            }
            
            /* Animations */
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideInLeft {
                from {
                    transform: translateX(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes popIn {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeInOut {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }
            
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                5% { transform: scale(1.1); }
                10% { transform: scale(1); }
                15% { transform: scale(1.1); }
                20% { transform: scale(1); }
            }
            
            /* Responsive Styles */
            @media (max-width: 768px) {
                .user-info-container {
                    display: none;
                }
                
                .nav-link.mobile-logout {
                    display: flex;
                }
                
                .welcome-toast {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .toast-content {
                    padding: 15px;
                }
                
                .toast-icon {
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                }
                
                .login-required-content {
                    padding: 30px 20px;
                }
                
                .login-required-title {
                    font-size: 1.8rem;
                }
                
                .login-required-message {
                    font-size: 1rem;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
            }
            
            @media (max-width: 480px) {
                .user-avatar {
                    width: 35px;
                    height: 35px;
                    font-size: 1rem;
                }
                
                .user-name {
                    font-size: 0.85rem;
                }
                
                .logout-btn {
                    font-size: 0.75rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inisialisasi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting authentication system...');
    
    // Setup cache
    domCache = {
        navContainer: null,
        navMenu: null,
        navToggle: null
    };
    
    // Check authentication
    const isAuthenticated = checkAuth();
    
    // Expose functions globally
    window.logout = logout;
    window.checkAuth = checkAuth;
    
    console.log('🎯 Auth system ready. Status:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
});

// Fallback check (jika ada masalah dengan DOM ready)
setTimeout(() => {
    if (!sessionStorage.getItem('loveLoggedIn')) {
        const overlay = document.querySelector('.login-required-overlay');
        if (!overlay) {
            const user = sessionStorage.getItem('loveUser') || 'Guest';
            showLoginOverlay(user);
        }
    }
}, 2000);

// Handle browser back/forward
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        console.log('Page restored from bfcache, rechecking auth...');
        checkAuth();
    }
});
