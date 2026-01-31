/**
 * AUTHENTICATION CHECK SCRIPT
 * Cek apakah user sudah login sebelum mengakses halaman utama
 */

// Konfigurasi
const LOGIN_PAGE = 'index';
const VALID_USERS = ['Capi', 'Cipi'];

// Variabel global untuk toggle menu
let isMobileMenuOpen = false;

// Fungsi utama untuk cek authentication
function checkAuth() {
    // Ambil data dari sessionStorage
    const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
    const currentUser = sessionStorage.getItem('loveUser');
    
    // Debug (bisa dihapus setelah testing)
    console.log('Auth Status:', {
        isLoggedIn: isLoggedIn,
        currentUser: currentUser
    });
    
    // Cek jika belum login atau user tidak valid
    if (!isLoggedIn || !currentUser || !VALID_USERS.includes(currentUser)) {
        console.log('❌ Not authenticated, redirecting to login...');
        redirectToLogin();
        return false;
    }
    
    // Jika sudah login, tampilkan user info
    displayUserInfo(currentUser);
    
    // Setup mobile menu handler
    setupMobileMenu();
    
    return true;
}

// Redirect ke halaman login
function redirectToLogin() {
    // Simpan halaman saat ini untuk redirect back setelah login (opsional)
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    
    // Redirect ke login page
    window.location.href = LOGIN_PAGE;
}

// Tampilkan informasi user di navbar
function displayUserInfo(user) {
    // Tunggu hingga DOM siap
    setTimeout(() => {
        // Cari navbar container
        const navContainer = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navContainer) return;
        
        // Hapus user info lama jika ada
        const oldUserInfo = document.querySelector('.user-info-container');
        if (oldUserInfo) oldUserInfo.remove();
        
        // Buat container info user untuk desktop
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info-container';
        userInfo.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="user-details">
                    <span class="user-name">${user}</span>
                    <button class="logout-btn" onclick="logout()" title="Logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
        
        // Tambahkan ke navbar (sebelah kanan sebelum toggle button)
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navContainer.insertBefore(userInfo, navToggle);
        } else {
            navContainer.appendChild(userInfo);
        }
        
        // Tambahkan logout option di mobile menu
        addMobileLogoutOption(user);
        
        // Tambahkan style jika belum ada
        addUserInfoStyles();
        
        // Update judul halaman dengan nama user
        updatePageTitle(user);
        
        // Tampilkan welcome message
        showWelcomeMessage(user);
        
    }, 500);
}

// Tambahkan logout option di mobile menu
function addMobileLogoutOption(user) {
    // Cari nav menu
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Hapus logout mobile lama jika ada
    const oldLogout = document.querySelector('.nav-link.logout-mobile');
    if (oldLogout) oldLogout.remove();
    
    // Buat logout link untuk mobile
    const logoutLink = document.createElement('a');
    logoutLink.className = 'nav-link logout-mobile';
    logoutLink.href = '#';
    logoutLink.innerHTML = `
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout (${user})</span>
    `;
    
    // Tambahkan event listener
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Tambahkan ke mobile menu
    navMenu.appendChild(logoutLink);
}

// Update judul halaman
function updatePageTitle(user) {
    const title = document.querySelector('title');
    if (title && !title.textContent.includes(user)) {
        title.textContent = `${user}'s Love Story | our story together`;
    }
}

// Tampilkan welcome message
function showWelcomeMessage(user) {
    // Cek jika sudah pernah tampil di session ini
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    if (welcomeShown === 'true') return;
    
    // Buat toast notification
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-heart"></i>
            <div class="toast-text">
                <strong>Selamat datang, ${user}!</strong>
                <span>Nikmati setiap momen indah kita ❤️</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(toast);
    
    // Setup close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    });
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (toast.parentNode && !toast.classList.contains('fade-out')) {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Tandai sudah ditampilkan
    sessionStorage.setItem('welcomeShown', 'true');
    
    // Tambahkan style untuk toast
    addToastStyles();
}

// Setup mobile menu handler
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    // Hapus event listener lama
    const newToggle = navToggle.cloneNode(true);
    navToggle.parentNode.replaceChild(newToggle, navToggle);
    
    // Tambahkan event listener baru
    newToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        toggleMobileMenu();
    });
    
    // Close menu ketika klik di luar
    document.addEventListener('click', function(e) {
        if (isMobileMenuOpen && 
            !navMenu.contains(e.target) && 
            !newToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu ketika klik link di dalam menu
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (!navMenu || !navToggle) return;
    
    if (!isMobileMenuOpen) {
        // Open menu
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        
        // Animate hamburger to X
        hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburgerLines[1].style.opacity = '0';
        hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        
        isMobileMenuOpen = true;
    } else {
        // Close menu
        closeMobileMenu();
    }
}

// Close mobile menu
function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    
    // Reset hamburger
    hamburgerLines[0].style.transform = 'none';
    hamburgerLines[1].style.opacity = '1';
    hamburgerLines[2].style.transform = 'none';
    
    isMobileMenuOpen = false;
}

// Fungsi logout
function logout() {
    // Konfirmasi logout dengan sweet message
    const user = sessionStorage.getItem('loveUser') || 'Sayang';
    const confirmLogout = confirm(`${user}, yakin mau logout dari dunia cinta kita? 😢\n\nKamu bisa login lagi kapan saja dengan password cinta kita ❤️`);
    
    if (confirmLogout) {
        // Animasi sebelum logout
        const logoutBtns = document.querySelectorAll('.logout-btn, .logout-mobile');
        logoutBtns.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            btn.disabled = true;
        });
        
        // Hapus session data setelah delay
        setTimeout(() => {
            sessionStorage.removeItem('loveLoggedIn');
            sessionStorage.removeItem('loveUser');
            sessionStorage.removeItem('welcomeShown');
            sessionStorage.removeItem('redirectAfterLogin');
            
            // Redirect ke login page
            window.location.href = LOGIN_PAGE;
        }, 1000);
    }
}

// Tambahkan styles untuk user info
function addUserInfoStyles() {
    const styleId = 'user-info-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* User Info Styles - PERTAHANKAN WARNA PINK */
            .user-info-container {
                margin-left: auto;
                margin-right: 15px;
                display: flex;
                align-items: center;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 107, 157, 0.15);
                padding: 6px 12px;
                border-radius: 20px;
                border: 2px solid #FFA8C8;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 107, 157, 0.1);
            }
            
            .user-info:hover {
                background: rgba(255, 107, 157, 0.25);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 107, 157, 0.2);
                border-color: #FF6B9D;
            }
            
            .user-avatar {
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #FF6B9D 0%, #FFA8C8 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.9rem;
                border: 2px solid white;
                box-shadow: 0 3px 10px rgba(255, 107, 157, 0.3);
            }
            
            .user-details {
                display: flex;
                flex-direction: column;
            }
            
            .user-name {
                font-weight: 600;
                color: #FF6B9D;
                font-size: 0.85rem;
                font-family: 'Poppins', sans-serif;
            }
            
            .logout-btn {
                background: none;
                border: none;
                color: #FF6B9D;
                font-size: 0.7rem;
                cursor: pointer;
                padding: 0;
                text-align: left;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 4px;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
            }
            
            .logout-btn:hover {
                color: #e0558a;
                transform: translateX(2px);
            }
            
            .logout-btn i {
                font-size: 0.65rem;
            }
            
            /* Mobile Menu Logout Option */
            .logout-mobile {
                display: none !important;
                background: rgba(255, 107, 157, 0.1) !important;
                border-left: 3px solid #FF6B9D !important;
            }
            
            .logout-mobile i {
                color: #FF6B9D !important;
            }
            
            .logout-mobile span {
                color: #FF6B9D !important;
                font-weight: 600;
            }
            
            /* Mobile responsive untuk user info */
            @media (max-width: 768px) {
                .user-info-container {
                    display: none !important;
                }
                
                .logout-mobile {
                    display: flex !important;
                    margin-top: 10px;
                    border-top: 1px solid rgba(255, 107, 157, 0.2);
                    padding-top: 10px;
                }
                
                /* Fix mobile menu z-index */
                .nav-menu {
                    z-index: 1001 !important;
                }
                
                .nav-toggle {
                    z-index: 1002 !important;
                    position: relative;
                }
            }
            
            /* Fix untuk navbar glass di mobile */
            @media (max-width: 768px) {
                .navbar-glass {
                    padding: 12px 20px;
                }
                
                .nav-menu {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    flex-direction: column;
                    padding: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    border-radius: 0 0 20px 20px;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1000;
                }
                
                .nav-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-link {
                    padding: 15px 20px;
                    width: 100%;
                    justify-content: flex-start;
                    border-radius: 12px;
                    margin: 5px 0;
                }
                
                .hamburger-line {
                    transition: all 0.3s ease;
                }
                
                .nav-toggle.active .hamburger-line:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .nav-toggle.active .hamburger-line:nth-child(2) {
                    opacity: 0;
                }
                
                .nav-toggle.active .hamburger-line:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Tambahkan styles untuk welcome toast
function addToastStyles() {
    const styleId = 'toast-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Welcome Toast Styles */
            .welcome-toast {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .toast-content {
                background: white;
                border-radius: 15px;
                padding: 15px 20px;
                box-shadow: 0 10px 40px rgba(255, 107, 157, 0.2);
                border-left: 4px solid #FF6B9D;
                display: flex;
                align-items: center;
                gap: 15px;
                max-width: 350px;
                animation: fadeIn 0.5s ease;
                border: 1px solid #FFD1E0;
            }
            
            .toast-content i.fa-heart {
                color: #FF6B9D;
                font-size: 1.8rem;
                animation: heartbeat 1.5s infinite;
                filter: drop-shadow(0 3px 5px rgba(255, 107, 157, 0.3));
            }
            
            .toast-text {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .toast-text strong {
                color: #FF6B9D;
                font-size: 1.1rem;
                margin-bottom: 5px;
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
            }
            
            .toast-text span {
                color: #FF6B9D;
                font-size: 0.9rem;
                opacity: 0.8;
                font-family: 'Poppins', sans-serif;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #FFA8C8;
                cursor: pointer;
                font-size: 1.1rem;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .toast-close:hover {
                background: rgba(255, 107, 157, 0.1);
                color: #FF6B9D;
                transform: rotate(90deg);
            }
            
            .fade-out {
                animation: fadeOut 0.3s ease forwards !important;
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
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.9); }
            }
            
            @media (max-width: 768px) {
                .welcome-toast {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .toast-content {
                    padding: 12px 15px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Fungsi untuk cek login secara periodik
function startAuthMonitor() {
    // Cek setiap 60 detik apakah masih login
    setInterval(() => {
        const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
        if (!isLoggedIn && window.location.pathname.includes('home.html')) {
            console.log('Session expired, redirecting...');
            redirectToLogin();
        }
    }, 60000);
}

// Setup event listener untuk sebelum page unload
function setupBeforeUnload() {
    window.addEventListener('beforeunload', function() {
        // Simpan timestamp terakhir aktif
        sessionStorage.setItem('lastActivity', Date.now());
    });
}

// Inisialisasi semua fungsi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Initializing authentication check...');
    
    // Close mobile menu jika open
    closeMobileMenu();
    
    // Jalankan cek auth utama
    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
        console.log('✅ User authenticated, loading page...');
        
        // Setup monitor
        startAuthMonitor();
        
        // Setup beforeunload listener
        setupBeforeUnload();
        
    } else {
        console.log('❌ User not authenticated');
    }
});

// Expose logout function globally
window.logout = logout;

// Expose mobile menu functions
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// Auto redirect jika session expired
window.addEventListener('storage', function(e) {
    if (e.key === 'loveLoggedIn' && !e.newValue) {
        if (window.location.pathname.includes('home.html')) {
            redirectToLogin();
        }
    }
});
