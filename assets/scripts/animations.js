// Enhanced Animations JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (loadingScreen) {
        // Simulate loading
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }, 1500);
    }
    
    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
            
            // Interactive elements effect
            const interactiveElements = document.querySelectorAll('a, button, .nav-link, .gallery-item, .memory-card');
            
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.borderColor = 'var(--color-accent-pink)';
                });
                
                element.addEventListener('mouseleave', () => {
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.borderColor = 'var(--color-mint)';
                });
            });
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar-glass');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active section in navigation
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
    
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Music Player
    const musicToggle = document.querySelector('#music-toggle-fixed');
    const backgroundMusic = document.getElementById('background-music');
    const volumeSlider = document.querySelector('.volume-slider');
    
    if (musicToggle && backgroundMusic) {
        let isPlaying = false;
        
        // Try to autoplay with user interaction
        const tryAutoplay = () => {
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    updateMusicButton();
                }).catch(error => {
                    console.log('Autoplay prevented:', error);
                    // User needs to interact first
                });
            }
        };
        
        // Initial attempt (might fail due to browser restrictions)
        tryAutoplay();
        
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
            } else {
                backgroundMusic.play();
            }
            isPlaying = !isPlaying;
            updateMusicButton();
        });
        
        function updateMusicButton() {
            const icon = musicToggle.querySelector('i');
            const status = musicToggle.querySelector('.music-status');
            
            if (isPlaying) {
                icon.className = 'fas fa-pause';
                status.textContent = 'Pause';
                musicToggle.style.background = 'var(--gradient-accent)';
            } else {
                icon.className = 'fas fa-music';
                status.textContent = 'Play';
                musicToggle.style.background = 'var(--gradient-primary)';
            }
        }
        
        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                backgroundMusic.volume = e.target.value / 100;
            });
        }
        
        // Auto play on user interaction (to bypass restrictions)
        document.addEventListener('click', tryAutoplay, { once: true });
    }
    
    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDate = lightbox.querySelector('.lightbox-date');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentGalleryIndex = 0;
    const galleryImages = [];
    
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3')?.textContent || '';
            const date = item.querySelector('p')?.textContent || '';
            
            galleryImages.push({
                src: img.src,
                alt: img.alt,
                title: title,
                date: date
            });
            
            const viewBtn = item.querySelector('.view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentGalleryIndex = index;
                    openLightbox();
                });
            }
        });
        
        function openLightbox() {
            if (galleryImages[currentGalleryIndex]) {
                lightboxImage.src = galleryImages[currentGalleryIndex].src;
                lightboxImage.alt = galleryImages[currentGalleryIndex].alt;
                lightboxTitle.textContent = galleryImages[currentGalleryIndex].title;
                lightboxDate.textContent = galleryImages[currentGalleryIndex].date;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        function showNextImage() {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
            openLightbox();
        }
        
        function showPrevImage() {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox();
        }
        
        // Event listeners
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
        
        // Close on overlay click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                showNextImage(); // Swipe left
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                showPrevImage(); // Swipe right
            }
        }
    }
    
    // Gallery Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Love Notes Form
    const noteTextarea = document.querySelector('.note-textarea');
    const addNoteBtn = document.querySelector('.add-note-btn');
    
    if (noteTextarea && addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            const note = noteTextarea.value.trim();
            
            if (note) {
                // Create new note card
                const noteCard = document.createElement('div');
                noteCard.className = 'note-card';
                noteCard.setAttribute('data-aos', 'fade-up');
                noteCard.innerHTML = `
                    <div class="note-header">
                        <div class="note-avatar">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="note-info">
                            <h3 class="note-author">New Note</h3>
                            <span class="note-date">Just now</span>
                        </div>
                    </div>
                    <div class="note-content">
                        <p>${note}</p>
                    </div>
                    <div class="note-footer">
                        <span class="note-sign">With love</span>
                    </div>
                `;
                
                // Add to notes container
                const notesContainer = document.querySelector('.notes-container');
                if (notesContainer) {
                    notesContainer.prepend(noteCard);
                    
                    // Animate new note
                    setTimeout(() => {
                        noteCard.style.opacity = '1';
                        noteCard.style.transform = 'translateY(0)';
                    }, 10);
                    
                    // Clear textarea
                    noteTextarea.value = '';
                    
                    // Show confirmation
                    showNotification('Love note added! 💕', 'success');
                }
            } else {
                showNotification('Please write something first!', 'error');
            }
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-xl);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    transform: translateX(400px);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    max-width: 350px;
                    border-left: 4px solid var(--color-accent-pink);
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification.success {
                    border-left-color: var(--color-mint);
                }
                
                .notification.error {
                    border-left-color: #ff4757;
                }
                
                .notification i {
                    font-size: 1.2rem;
                }
                
                .notification.success i {
                    color: var(--color-mint);
                }
                
                .notification.error i {
                    color: #ff4757;
                }
                
                .notification span {
                    flex: 1;
                    color: var(--color-dark);
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--color-gray);
                    cursor: pointer;
                    padding: 5px;
                    border-radius: var(--radius-full);
                    transition: var(--transition-smooth);
                }
                
                .notification-close:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        });
    }
    
    // Update days together
    function updateDaysTogether() {
        const startDate = new Date('2025-12-17');
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        const daysElement = document.getElementById('days-together');
        if (daysElement) {
            daysElement.textContent = daysDiff;
        }
    }
    
    // Initialize
    updateDaysTogether();
    
    // Particles.js for hero section
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#FF6B9D', '#B8DB80', '#FFA8C8']
                },
                shape: {
                    type: ['circle', 'heart'],
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
                        enable: true,
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
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // Add current year to footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
