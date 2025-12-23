// TAMBAHKAN SETELAH CLASS PhotoGallery DAN SEBELUM DOMContentLoaded

// 1. FITUR DOWNLOAD FOTO - Tambahkan method ini ke dalam class PhotoGallery
addDownloadFeature() {
    // Method untuk menambahkan tombol download di lightbox
    this.addDownloadButtonToLightbox();
    
    // Method untuk menangani download
    this.initDownloadListener();
}

addDownloadButtonToLightbox() {
    // Cek apakah tombol download sudah ada
    const lightboxContent = document.querySelector('.lightbox-content');
    if (!lightboxContent) return;
    
    // Cek apakah tombol download sudah ada
    if (document.querySelector('.download-btn')) return;
    
    // Tambahkan tombol download di lightbox
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    downloadBtn.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 1001;
    `;
    
    downloadBtn.addEventListener('mouseenter', function() {
        this.style.background = '#fff';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
    
    downloadBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.9)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    lightboxContent.appendChild(downloadBtn);
}

initDownloadListener() {
    // Event listener untuk tombol download
    document.addEventListener('click', (e) => {
        if (e.target.closest('.download-btn')) {
            this.downloadCurrentPhoto();
        }
    });
}

downloadCurrentPhoto() {
    const currentPhoto = this.filteredPhotos[this.currentLightboxIndex];
    if (!currentPhoto) return;
    
    // Ambil URL gambar
    const imgUrl = currentPhoto.src;
    
    // Buat nama file
    const fileName = `${currentPhoto.title.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    
    // Buat elemen anchor untuk download
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // Tambahkan ke body dan trigger click
    document.body.appendChild(link);
    link.click();
    
    // Hapus elemen
    document.body.removeChild(link);
    
    // Tampilkan notifikasi
    this.showNotification(`Berhasil download: ${currentPhoto.title}`, 'success');
}

// Panggil method addDownloadFeature di init() method
// Tambahkan baris ini di dalam init() method setelah initEventListeners():
// this.addDownloadFeature();

// 2. NAVBAR MOBILE - Tambahkan kode ini setelah class PhotoGallery
class MobileNavbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuBtn = null;
        this.mobileMenu = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.initEventListeners();
        this.checkWindowSize();
        
        // Event listener untuk resize window
        window.addEventListener('resize', () => this.checkWindowSize());
    }

    createMobileMenu() {
        // Buat tombol hamburger
        this.menuBtn = document.createElement('button');
        this.menuBtn.className = 'mobile-menu-btn';
        this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        this.menuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: #FF6B9D;
            cursor: pointer;
            padding: 10px;
            z-index: 1002;
        `;

        // Buat mobile menu
        this.mobileMenu = document.createElement('div');
        this.mobileMenu.className = 'mobile-menu';
        this.mobileMenu.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(255, 255, 255, 0.98);
            z-index: 1001;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;

        // Salin menu items dari navbar desktop
        const navItems = this.navbar ? this.navbar.querySelectorAll('a') : [];
        navItems.forEach(item => {
            const mobileItem = item.cloneNode(true);
            mobileItem.style.cssText = `
                font-size: 24px;
                color: #333;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 30px;
                transition: all 0.3s ease;
            `;
            
            mobileItem.addEventListener('mouseenter', function() {
                this.style.background = '#FF6B9D';
                this.style.color = 'white';
            });
            
            mobileItem.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
                this.style.color = '#333';
            });
            
            // Tambahkan event untuk close menu saat diklik
            mobileItem.addEventListener('click', () => this.closeMenu());
            
            this.mobileMenu.appendChild(mobileItem);
        });

        // Tambahkan tombol close
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            position: absolute;
            top: 30px;
            right: 30px;
            background: none;
            border: none;
            font-size: 28px;
            color: #FF6B9D;
            cursor: pointer;
            padding: 10px;
        `;
        
        closeBtn.addEventListener('click', () => this.closeMenu());
        this.mobileMenu.appendChild(closeBtn);

        // Tambahkan ke body
        document.body.appendChild(this.menuBtn);
        document.body.appendChild(this.mobileMenu);
    }

    initEventListeners() {
        // Toggle menu
        this.menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu ketika klik di luar
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileMenu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu dengan ESC key
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.mobileMenu.style.display = 'flex';
        setTimeout(() => {
            this.mobileMenu.style.opacity = '1';
            this.mobileMenu.style.transform = 'translateY(0)';
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isOpen = false;
        this.mobileMenu.style.opacity = '0';
        this.mobileMenu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            this.mobileMenu.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    checkWindowSize() {
        if (window.innerWidth <= 768) {
            this.menuBtn.style.display = 'block';
            if (this.navbar) {
                this.navbar.style.display = 'none';
            }
        } else {
            this.menuBtn.style.display = 'none';
            this.mobileMenu.style.display = 'none';
            if (this.navbar) {
                this.navbar.style.display = 'flex';
            }
            this.closeMenu();
        }
    }
}

// MODIFIKASI DOMContentLoaded untuk include fitur baru
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing gallery...');
    
    // Pastikan loading screen dihapus dulu
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Initialize gallery
    const gallery = new PhotoGallery();
    
    // Tambahkan fitur download ke gallery
    gallery.addDownloadFeature();
    
    // Initialize mobile navbar
    const mobileNavbar = new MobileNavbar();
    
    // Add current year to footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    console.log('Gallery and mobile navbar initialized successfully');
});

// Tambahkan style untuk tombol download di lightbox
const addDownloadStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Animasi untuk download button */
        .download-btn:hover {
            background: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        
        /* Responsive untuk download button */
        @media (max-width: 768px) {
            .download-btn {
                bottom: 60px !important;
                right: 10px !important;
                padding: 6px 12px !important;
                font-size: 12px !important;
            }
        }
        
        /* Animasi untuk mobile menu */
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .mobile-menu {
            animation: slideDown 0.3s ease-out !important;
        }
    `;
    document.head.appendChild(style);
};

// Panggil fungsi untuk menambahkan styles
addDownloadStyles();
