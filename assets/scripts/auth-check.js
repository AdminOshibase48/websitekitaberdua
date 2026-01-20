/**
 * AUTHENTICATION CHECK SCRIPT
 * Cek apakah user sudah login sebelum mengakses halaman utama
 */

// Konfigurasi
const LOGIN_PAGE = 'index';
const VALID_USERS = ['Capi', 'Cipi'];

// Fungsi utama untuk cek authentication
function checkAuth() {
    // Ambil data dari sessionStorage
    const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
    const currentUser = sessionStorage.getItem('loveUser');
    
    // Debug (bisa dihapus setelah testing)
    console.log('🔒 Auth Status:', {
        isLoggedIn: isLoggedIn,
        currentUser: currentUser
    });
    
    // Cek jika belum login atau user tidak valid
    if (!isLoggedIn || !currentUser || !VALID_USERS.includes(currentUser)) {
        console.log('❌ Not authenticated, redirecting to login...');
        showLoginRequiredOverlay();
        return false;
    }
    
    // Jika sudah login, tampilkan user info
    displayUserInfo(currentUser);
    addLogoutToMobileMenu(currentUser);
    return true;
}

// Tampilkan overlay login required
function showLoginRequiredOverlay() {
    // Cek jika overlay sudah ada
    if (document.getElementById('loginRequiredOverlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'loginRequiredOverlay';
    overlay.className = 'login-required-overlay';
    overlay.innerHTML = `
        <div class="login-required-content" data-aos="zoom-in">
            <div class="login-required-icon">
                <i class="fas fa-heart-lock"></i>
            </div>
            <h2 class="login-required-title">Akses Terbatas</h2>
            <p class="login-required-message">
                Halaman ini hanya untuk Capi & Cipi.<br>
                Silakan login terlebih dahulu untuk melihat kenangan indah kita.
            </p>
            <button class="login-required-btn" onclick="goToLogin()">
                <i class="fas fa-sign-in-alt"></i>
                Pergi ke Halaman Login
            </button>
            <p class="login-required-note">
                <small><i class="fas fa-info-circle"></i> Password: tanggal spesial kita</small>
            </p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    addLoginRequiredStyles();
    
    // Redirect otomatis setelah 5 detik
    setTimeout(() => {
        if (overlay.parentNode) {
            goToLogin();
        }
    }, 5000);
}

// Go to login page
function goToLogin() {
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = LOGIN_PAGE;
}

// Tampilkan informasi user di navbar (untuk desktop)
function displayUserInfo(user) {
    // Tunggu hingga navbar siap
    setTimeout(() => {
        const navContainer = document.querySelector('.nav-container');
        
        if (navContainer && !document.querySelector('.user-info-desktop')) {
            // Buat container untuk desktop
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info-desktop';
            userInfo.innerHTML = `
                <div class="user-info-wrapper">
                    <div class="user-badge">
                        <i class="fas fa-user-heart"></i>
                        <span class="user-name">${user}</span>
                    </div>
                    <button class="logout-btn-desktop" onclick="logout()" title="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
            
            // Sisipkan sebelum nav-toggle (mobile menu button)
            const navToggle = document.querySelector('.nav-toggle');
            if (navToggle) {
                navContainer.insertBefore(userInfo, navToggle);
            } else {
                navContainer.appendChild(userInfo);
            }
            
            addDesktopUserStyles();
        }
        
        // Update judul halaman dengan nama user
        updatePageTitle(user);
        
        // Tampilkan welcome message
        showWelcomeMessage(user);
        
    }, 1000);
}

// Tambahkan logout option di mobile menu
function addLogoutToMobileMenu(user) {
    setTimeout(() => {
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu && !document.querySelector('.logout-mobile-item')) {
            // Buat logout item untuk mobile
            const logoutItem = document.createElement('div');
            logoutItem.className = 'logout-mobile-item';
            logoutItem.innerHTML = `
                <div class="mobile-user-info">
                    <i class="fas fa-user-heart"></i>
                    <span>Login sebagai: <strong>${user}</strong></span>
                </div>
                <a href="javascript:void(0)" class="nav-link logout-mobile-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            `;
            
            // Tambahkan ke akhir menu
            navMenu.appendChild(logoutItem);
            addMobileLogoutStyles();
        }
        
        // Setup mobile menu toggle untuk logout item
        setupMobileMenuToggle();
        
    }, 1500);
}

// Setup mobile menu toggle behavior
function setupMobileMenuToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu ketika klik diluar
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Update judul halaman
function updatePageTitle(user) {
    const title = document.querySelector('title');
    if (title && !title.textContent.includes(user)) {
        // Hanya tambahkan jika belum ada
        const baseTitle = title.textContent.replace(" | our story together", "");
        title.textContent = `${baseTitle} | ${user}'s Love Story`;
    }
}

// Tampilkan welcome message
function showWelcomeMessage(user) {
    // Hanya tampilkan sekali per session
    if (sessionStorage.getItem('welcomeShown')) return;
    
    setTimeout(() => {
        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.setAttribute('data-aos', 'fade-left');
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-heart">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="toast-text">
                    <div class="toast-title">Hai, ${user}! 💕</div>
                    <div class="toast-subtitle">Selamat menikmati kenangan indah kita</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove setelah 5 detik
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Tandai sudah ditampilkan
        sessionStorage.setItem('welcomeShown', 'true');
        
        addWelcomeToastStyles();
        
    }, 2000);
}

// Fungsi logout
function logout() {
    // Sweet confirmation
    const confirmLogout = confirm('Yakin mau keluar dari dunia cinta kita? 💔\n\nKamu bisa login lagi kapan saja dengan password spesial kita.');
    
    if (confirmLogout) {
        // Animation sebelum logout
        const logoutBtn = event?.target?.closest('.logout-btn-desktop, .logout-mobile-btn') || 
                          document.querySelector('.logout-btn-desktop, .logout-mobile-btn');
        
        if (logoutBtn) {
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            logoutBtn.disabled = true;
        }
        
        // Hapus session data
        setTimeout(() => {
            sessionStorage.clear();
            localStorage.removeItem('rememberedLoveUser');
            
            // Redirect ke login page
            window.location.href = LOGIN_PAGE;
        }, 1000);
    }
}

// ===== STYLE FUNCTIONS =====

// Styles untuk login required overlay
function addLoginRequiredStyles() {
    const styleId = 'login-required-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Login Required Overlay */
            .login-required-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #FFE4EF 0%, #B8DB80 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                padding: 20px;
                text-align: center;
            }
            
            .login-required-content {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 40px 30px;
                border-radius: 25px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                border: 2px solid rgba(255, 107, 157, 0.3);
                max-width: 500px;
                width: 90%;
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
                margin-bottom: 30px;
                line-height: 1.7;
                font-size: 1.1rem;
            }
            
            .login-required-btn {
                background: linear-gradient(135deg, #FF6B9D 0%, #FFA8C8 100%);
                color: white;
                border: none;
                padding: 16px 35px;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin: 0 auto;
                box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
            }
            
            .login-required-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 30px rgba(255, 107, 157, 0.4);
            }
            
            .login-required-btn:active {
                transform: translateY(-1px);
            }
            
            .login-required-note {
                margin-top: 25px;
                color: #888;
                font-size: 0.9rem;
            }
            
            .login-required-note i {
                color: #B8DB80;
                margin-right: 8px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Styles untuk user info desktop
function addDesktopUserStyles() {
    const styleId = 'desktop-user-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Desktop User Info */
            .user-info-desktop {
                display: flex;
                align-items: center;
                margin-left: auto;
                margin-right: 20px;
            }
            
            .user-info-wrapper {
                display: flex;
                align-items: center;
                gap: 15px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(5px);
                padding: 8px 15px;
                border-radius: 25px;
                border: 1px solid rgba(255, 107, 157, 0.2);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
            }
            
            .user-info-wrapper:hover {
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
                transform: translateY(-2px);
                border-color: rgba(255, 107, 157, 0.4);
            }
            
            .user-badge {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #333;
                font-weight: 500;
            }
            
            .user-badge i {
                color: #FF6B9D;
                font-size: 1.1rem;
            }
            
            .user-name {
                font-size: 0.95rem;
                font-weight: 600;
            }
            
            .logout-btn-desktop {
                background: none;
                border: none;
                color: #FF6B9D;
                cursor: pointer;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                padding: 0;
            }
            
            .logout-btn-desktop:hover {
                background: rgba(255, 107, 157, 0.1);
                color: #e0558a;
                transform: rotate(15deg);
            }
            
            /* Responsive untuk desktop user info */
            @media (max-width: 768px) {
                .user-info-desktop {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Styles untuk mobile logout
function addMobileLogoutStyles() {
    const styleId = 'mobile-logout-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Mobile Logout Styles */
            .logout-mobile-item {
                margin-top: auto;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .mobile-user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-size: 0.9rem;
            }
            
            .mobile-user-info i {
                color: #FFA8C8;
                font-size: 1.2rem;
            }
            
            .mobile-user-info strong {
                color: #FFA8C8;
            }
            
            .logout-mobile-btn {
                display: flex !important;
                align-items: center;
                gap: 12px;
                padding: 15px !important;
                background: rgba(255, 107, 157, 0.15) !important;
                border-radius: 12px !important;
                margin-top: 5px !important;
                color: white !important;
                transition: all 0.3s ease !important;
            }
            
            .logout-mobile-btn:hover {
                background: rgba(255, 107, 157, 0.25) !important;
                transform: translateX(5px);
            }
            
            .logout-mobile-btn i {
                color: #FFA8C8 !important;
                font-size: 1.2rem;
            }
            
            /* Mobile menu active state */
            @media (max-width: 768px) {
                .nav-menu.active .logout-mobile-item {
                    display: flex !important;
                    animation: slideUp 0.4s ease;
                }
                
                .logout-mobile-item {
                    display: none;
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Styles untuk welcome toast
function addWelcomeToastStyles() {
    const styleId = 'welcome-toast-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Welcome Toast */
            .welcome-toast {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            @media (max-width: 768px) {
                .welcome-toast {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                }
            }
            
            .toast-content {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                border: 2px solid rgba(255, 107, 157, 0.3);
                display: flex;
                align-items: center;
                gap: 18px;
                max-width: 380px;
                width: 100%;
                animation: fadeIn 0.5s ease;
            }
            
            @media (max-width: 768px) {
                .toast-content {
                    max-width: 100%;
                }
            }
            
            .toast-heart {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #FF6B9D 0%, #FFA8C8 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                flex-shrink: 0;
                animation: heartbeat 1.5s infinite;
            }
            
            .toast-text {
                flex: 1;
                text-align: left;
            }
            
            .toast-title {
                color: #333;
                font-weight: 700;
                font-size: 1.2rem;
                margin-bottom: 5px;
                font-family: 'Playfair Display', serif;
            }
            
            .toast-subtitle {
                color: #666;
                font-size: 0.95rem;
                line-height: 1.4;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 1rem;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                flex-shrink: 0;
                align-self: flex-start;
                margin-top: -5px;
                margin-right: -5px;
            }
            
            .toast-close:hover {
                background: #f5f5f5;
                color: #666;
            }
            
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
        `;
        document.head.appendChild(style);
    }
}

// ===== UTILITY FUNCTIONS =====

// Fungsi untuk cek login secara periodik
function startAuthMonitor() {
    setInterval(() => {
        const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
        if (!isLoggedIn && !window.location.href.includes('index.html')) {
            console.log('Session expired, redirecting...');
            goToLogin();
        }
    }, 60000); // Cek setiap 60 detik
}

// Setup beforeunload listener
function setupBeforeUnload() {
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('lastActivity', Date.now());
    });
}

// ===== INITIALIZATION =====

// Inisialisasi semua fungsi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Initializing authentication system...');
    
    // Jalankan cek auth utama
    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
        console.log('✅ User authenticated, welcome!');
        
        // Setup monitor session
        startAuthMonitor();
        
        // Setup beforeunload listener
        setupBeforeUnload();
        
        // Expose logout function globally
        window.logout = logout;
        window.goToLogin = goToLogin;
        
    } else {
        console.log('❌ Authentication required');
    }
});

// Handle storage events (untuk multi-tab)
window.addEventListener('storage', function(e) {
    if (e.key === 'loveLoggedIn' && !e.newValue && !window.location.href.includes('index.html')) {
        goToLogin();
    }
});

// Expose fungsi ke global scope
window.logout = logout;
window.goToLogin = goToLogin;
