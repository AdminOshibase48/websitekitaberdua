/**
 * AUTHENTICATION CHECK SCRIPT
 * Cek apakah user sudah login sebelum mengakses halaman utama
 */

// Konfigurasi
const LOGIN_PAGE = 'index.html';
const VALID_USERS = ['Capi', 'Cipi'];

// Fungsi utama untuk cek authentication
function checkAuth() {
    // Ambil data dari sessionStorage
    const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
    const currentUser = sessionStorage.getItem('loveUser');
    
    // Debug (bisa dihapus setelah testing)
    console.log('Auth Status:', {
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        sessionStorage: sessionStorage
    });
    
    // Cek jika belum login atau user tidak valid
    if (!isLoggedIn || !currentUser || !VALID_USERS.includes(currentUser)) {
        console.log('❌ Not authenticated, redirecting to login...');
        redirectToLogin();
        return false;
    }
    
    // Jika sudah login, tampilkan user info
    displayUserInfo(currentUser);
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
        
        if (navContainer && !document.querySelector('.user-info-container')) {
            // Buat container info user
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info-container';
            userInfo.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-heart"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-name">${user}</span>
                        <button class="logout-btn" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
            
            // Tambahkan ke navbar (sebelah kanan)
            navContainer.appendChild(userInfo);
            
            // Tambahkan style jika belum ada
            addUserInfoStyles();
        }
        
        // Update judul halaman dengan nama user (opsional)
        updatePageTitle(user);
        
        // Tampilkan welcome message (opsional)
        showWelcomeMessage(user);
        
    }, 1000); // Delay untuk memastikan navbar sudah load
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
    // Buat toast notification
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-heart"></i>
            <div class="toast-text">
                <strong>Selamat datang, ${user}!</strong>
                <span>Nikmati setiap momen indah kita</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(toast);
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
    
    // Tambahkan style untuk toast
    addToastStyles();
}

// Fungsi logout
function logout() {
    // Konfirmasi logout
    if (confirm('Yakin mau logout dari dunia cinta kita? 😢')) {
        // Hapus session data
        sessionStorage.removeItem('loveLoggedIn');
        sessionStorage.removeItem('loveUser');
        
        // Hapus redirect URL
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Redirect ke login page
        window.location.href = LOGIN_PAGE;
    }
}

// Tambahkan styles untuk user info
function addUserInfoStyles() {
    const styleId = 'user-info-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* User Info Styles */
            .user-info-container {
                margin-left: auto;
                display: flex;
                align-items: center;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(255, 107, 157, 0.1);
                padding: 8px 15px;
                border-radius: 25px;
                border: 1px solid rgba(255, 107, 157, 0.2);
                transition: all 0.3s ease;
            }
            
            .user-info:hover {
                background: rgba(255, 107, 157, 0.15);
                transform: translateY(-2px);
            }
            
            .user-avatar {
                width: 35px;
                height: 35px;
                background: linear-gradient(135deg, #FF6B9D 0%, #FFA8C8 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1rem;
            }
            
            .user-details {
                display: flex;
                flex-direction: column;
            }
            
            .user-name {
                font-weight: 600;
                color: #333;
                font-size: 0.9rem;
            }
            
            .logout-btn {
                background: none;
                border: none;
                color: #FF6B9D;
                font-size: 0.75rem;
                cursor: pointer;
                padding: 2px 0;
                text-align: left;
                transition: color 0.3s ease;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .logout-btn:hover {
                color: #e0558a;
                text-decoration: underline;
            }
            
            .logout-btn i {
                font-size: 0.7rem;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .user-info-container {
                    display: none;
                }
                
                .nav-menu {
                    margin-left: auto;
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
                animation: slideInRight 0.5s ease;
            }
            
            .toast-content {
                background: white;
                border-radius: 15px;
                padding: 15px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                border-left: 5px solid #FF6B9D;
                display: flex;
                align-items: center;
                gap: 15px;
                max-width: 350px;
                animation: fadeIn 0.5s ease;
            }
            
            .toast-content i.fa-heart {
                color: #FF6B9D;
                font-size: 1.5rem;
                animation: heartbeat 1.5s infinite;
            }
            
            .toast-text {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .toast-text strong {
                color: #333;
                font-size: 1rem;
                margin-bottom: 3px;
            }
            
            .toast-text span {
                color: #666;
                font-size: 0.85rem;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 1rem;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
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
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Fungsi untuk cek login secara periodik (opsional)
function startAuthMonitor() {
    // Cek setiap 30 detik apakah masih login
    setInterval(() => {
        const isLoggedIn = sessionStorage.getItem('loveLoggedIn');
        if (!isLoggedIn) {
            console.log('Session expired, redirecting...');
            redirectToLogin();
        }
    }, 30000); // 30 detik
}

// Fungsi untuk proteksi route (mencegah akses langsung)
function protectRoutes() {
    // Cek jika user mencoba akses home.html secara langsung
    if (window.location.pathname.includes('home.html') || 
        window.location.pathname.includes('index.html') && 
        !window.location.pathname.includes('index.html')) {
        
        // Jika tidak ada session, redirect ke login
        if (!sessionStorage.getItem('loveLoggedIn')) {
            console.log('Direct access detected, redirecting to login...');
            redirectToLogin();
        }
    }
}

// Event listener untuk sebelum page unload
function setupBeforeUnload() {
    window.addEventListener('beforeunload', function() {
        // Optional: Simpan timestamp terakhir aktif
        sessionStorage.setItem('lastActivity', Date.now());
    });
}

// Inisialisasi semua fungsi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Initializing authentication check...');
    
    // Jalankan cek auth utama
    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
        console.log('✅ User authenticated, loading page...');
        
        // Setup monitor (opsional)
        startAuthMonitor();
        
        // Setup beforeunload listener
        setupBeforeUnload();
        
        // Setup logout button event listeners
        setTimeout(() => {
            const logoutBtns = document.querySelectorAll('.logout-btn');
            logoutBtns.forEach(btn => {
                btn.addEventListener('click', logout);
            });
        }, 2000);
        
    } else {
        console.log('❌ User not authenticated');
    }
});

// Expose logout function globally
window.logout = logout;

// Auto redirect jika session expired (untuk tab yang idle)
window.addEventListener('storage', function(e) {
    if (e.key === 'loveLoggedIn' && !e.newValue) {
        redirectToLogin();
    }
});
