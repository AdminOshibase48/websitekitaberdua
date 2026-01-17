// Konfigurasi Login
const VALID_PASSWORD = '171225';
const VALID_USERS = ['Capi', 'Cipi'];
const MAIN_PAGE = 'home'; // Ganti dengan nama file utama kamu

// Elemen DOM
let currentUser = 'Capi';
let particlesInstance = null;

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi Particles.js
    initParticles();
    
    // Setup user selection
    setupUserSelection();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup password toggle
    setupPasswordToggle();
    
    // Check remember me
    checkRememberedUser();
});

// Setup Particles Background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('login-particles', {
            particles: {
                number: {
                    value: 30,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#FF6B9D', '#B8DB80', '#FFA8C8']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#FFA8C8',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// Setup User Selection
function setupUserSelection() {
    const userOptions = document.querySelectorAll('.user-option');
    
    userOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all
            userOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Set current user
            currentUser = this.dataset.user;
            
            // Update remember me if checked
            if (document.getElementById('remember').checked) {
                rememberUser(currentUser);
            }
            
            // Animate heart
            const heart = this.querySelector('.user-avatar i');
            heart.style.transform = 'scale(1.3)';
            setTimeout(() => {
                heart.style.transform = 'scale(1)';
            }, 300);
        });
    });
}

// Setup Form Submission
function setupFormSubmission() {
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = form.querySelector('.login-btn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        // Reset error
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        
        // Validation
        if (!password) {
            showError('Masukkan password cinta kita dulu yaa ❤️');
            shakeInput(passwordInput);
            return;
        }
        
        if (password !== VALID_PASSWORD) {
            showError('Password salah sayang 😔 Coba ingat-ingat tanggal spesial kita');
            shakeInput(passwordInput);
            passwordInput.value = '';
            return;
        }
        
        // Validasi berhasil
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat kenangan...';
        loginBtn.disabled = true;
        
        // Simpan user jika remember me dicentang
        if (document.getElementById('remember').checked) {
            rememberUser(currentUser);
        } else {
            forgetUser();
        }
        
        // Simpan sesi login
        sessionStorage.setItem('loveLoggedIn', 'true');
        sessionStorage.setItem('loveUser', currentUser);
        
        // Delay untuk efek, lalu redirect
        setTimeout(() => {
            // Animasi sukses
            loginBtn.innerHTML = '<i class="fas fa-heart"></i> Login Berhasil! <i class="fas fa-heart"></i>';
            loginBtn.style.background = 'linear-gradient(135deg, #B8DB80 0%, #9BC661 100%)';
            
            setTimeout(() => {
                window.location.href = MAIN_PAGE;
            }, 1000);
        }, 1500);
    });
}

// Setup Password Toggle
function setupPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
}

// Check Remembered User
function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedLoveUser');
    if (rememberedUser && VALID_USERS.includes(rememberedUser)) {
        currentUser = rememberedUser;
        
        // Set active user
        document.querySelectorAll('.user-option').forEach(option => {
            if (option.dataset.user === rememberedUser) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Check remember me
        document.getElementById('remember').checked = true;
    }
}

// Remember User Function
function rememberUser(user) {
    localStorage.setItem('rememberedLoveUser', user);
}

// Forget User Function
function forgetUser() {
    localStorage.removeItem('rememberedLoveUser');
}

// Show Error Message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Shake Input Animation
function shakeInput(input) {
    input.classList.add('shake');
    setTimeout(() => {
        input.classList.remove('shake');
    }, 500);
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s ease;
    }
`;
document.head.appendChild(style);
