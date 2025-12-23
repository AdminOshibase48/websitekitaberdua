// Gallery JavaScript - FIXED LOADING
class PhotoGallery {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.photosPerPage = 12;
        this.currentLightboxIndex = 0;
        this.searchTerm = '';
        
        // TAMBAHKAN FLAG UNTUK LOADING
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Hapus loading screen dulu sebelum mulai
        this.removeLoadingScreen();
        
        // Load sample photos
        this.loadSamplePhotos();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Render gallery
        this.renderGallery();
        
        this.isInitialized = true;
    }

    // FUNGSI BARU UNTUK HAPUS LOADING SCREEN
    removeLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            // Langsung hide tanpa animasi jika butuh
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
            
            // Atau dengan animasi jika mau
            // loadingScreen.classList.add('loaded');
            // setTimeout(() => {
            //     loadingScreen.style.display = 'none';
            //     document.body.style.overflow = '';
            // }, 500);
        }
    }

    loadSamplePhotos() {
        // Gunakan placeholder images untuk testing
        this.photos = [
            {
                id: 1,
                src: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=500&h=500&fit=crop',
                title: 'Pertemuan Pertama',
                date: '17 Desember 2025',
                description: 'Mata kita bertemu untuk pertama kalinya di kafe itu.',
                category: 'firsts',
                tags: ['first', 'meeting', 'special']
            },
            {
                id: 2,
                src: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=500&h=500&fit=crop',
                title: 'Kencan Pertama',
                date: '24 Desember 2025',
                description: 'Makan malam romantis di restoran Italia.',
                category: 'firsts',
                tags: ['first', 'date', 'romantic']
            },
            {
                id: 3,
                src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop',
                title: 'Pantai Bersama',
                date: '15 Januari 2026',
                description: 'Liburan pertama kami ke pantai.',
                category: 'travel',
                tags: ['travel', 'beach', 'vacation']
            },
            {
                id: 4,
                src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=500&fit=crop',
                title: 'Sunset Moment',
                date: '20 Januari 2026',
                description: 'Menikmati matahari terbenam bersama.',
                category: 'travel',
                tags: ['sunset', 'romantic', 'special']
            },
            {
                id: 5,
                src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop',
                title: 'Ulang Tahun',
                date: '14 Maret 2026',
                description: 'Merayakan ulang tahun bersama.',
                category: 'celebration',
                tags: ['birthday', 'celebration', 'party']
            },
            {
                id: 6,
                src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
                title: 'Coffee Date',
                date: '5 Februari 2026',
                description: 'Sarapan pagi bersama di kafe favorit.',
                category: 'everyday',
                tags: ['coffee', 'breakfast', 'daily']
            }
        ];
        
        // Update total photos count
        this.updateStats();
    }

    initEventListeners() {
        // Filter buttons - FIXED
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleFilterClick(e.target.closest('.filter-btn'));
                });
            });
        }

        // Search input - OPTIONAL, bisa di-comment jika belum ada
        const searchInput = document.getElementById('gallery-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.filterPhotos();
                this.renderGallery();
            });
        }

        // Clear search - OPTIONAL
        const clearSearch = document.getElementById('clear-search');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchTerm = '';
                this.currentPage = 1;
                this.filterPhotos();
                this.renderGallery();
            });
        }

        // Load more button - SIMPLIFIED
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePhotos();
            });
        }

        // Photo upload - OPTIONAL, bisa di-comment
        const uploadBtn = document.getElementById('upload-photo');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                const fileInput = document.getElementById('file-input');
                if (fileInput) fileInput.click();
            });
        }

        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        // View album buttons - OPTIONAL
        const albumButtons = document.querySelectorAll('.view-album-btn');
        if (albumButtons.length > 0) {
            albumButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const album = e.target.closest('.view-album-btn').getAttribute('data-album');
                    this.filterByAlbum(album);
                });
            });
        }
    }

    handleFilterClick(button) {
        if (!button) return;
        
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Get filter value
        const filter = button.getAttribute('data-filter');
        this.currentFilter = filter;
        this.currentPage = 1;

        // Filter and render
        this.filterPhotos();
        this.renderGallery();
    }

    filterPhotos() {
        this.filteredPhotos = this.photos.filter(photo => {
            // Apply category filter
            if (this.currentFilter !== 'all' && photo.category !== this.currentFilter) {
                return false;
            }

            // Apply search filter
            if (this.searchTerm) {
                const searchableText = `
                    ${photo.title} 
                    ${photo.description} 
                    ${photo.tags?.join(' ') || ''}
                `.toLowerCase();

                if (!searchableText.includes(this.searchTerm)) {
                    return false;
                }
            }

            return true;
        });
    }

    renderGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) {
            console.error('Gallery grid element not found');
            return;
        }

        // Clear gallery
        galleryGrid.innerHTML = '';

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.photosPerPage;
        const endIndex = startIndex + this.photosPerPage;
        const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);

        // Create photo elements
        photosToShow.forEach((photo, index) => {
            try {
                const photoElement = this.createPhotoElement(photo, startIndex + index);
                galleryGrid.appendChild(photoElement);
            } catch (error) {
                console.error('Error creating photo element:', error);
            }
        });

        // Update load more button visibility
        this.updateLoadMoreButton();

        // Initialize lightbox for new photos
        this.initLightbox();
    }

    createPhotoElement(photo, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-category', photo.category);

        div.innerHTML = `
            <div class="gallery-img">
                <img src="${photo.src}" alt="${photo.title}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="overlay-content">
                        <h3>${photo.title}</h3>
                        <p>${photo.date}</p>
                        <button class="view-btn" data-index="${index}">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add click event for lightbox
        const viewBtn = div.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(index);
            });
        }

        return div;
    }

    loadMorePhotos() {
        const totalPhotos = this.filteredPhotos.length;
        const loadedPhotos = this.currentPage * this.photosPerPage;

        if (loadedPhotos < totalPhotos) {
            this.currentPage++;
            this.renderGallery();
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;

        const totalPhotos = this.filteredPhotos.length;
        const loadedPhotos = this.currentPage * this.photosPerPage;

        if (loadedPhotos < totalPhotos) {
            loadMoreBtn.style.display = 'inline-flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    updateStats() {
        // Update total photos count
        const totalPhotosElement = document.getElementById('total-photos');
        if (totalPhotosElement) {
            totalPhotosElement.textContent = this.photos.length;
        }

        // Calculate years covered
        if (this.photos.length > 0) {
            const dates = this.photos.map(p => {
                try {
                    return new Date(p.date);
                } catch {
                    return new Date(); // Fallback ke tanggal sekarang
                }
            });
            
            const validDates = dates.filter(d => !isNaN(d.getTime()));
            
            if (validDates.length > 0) {
                const minDate = new Date(Math.min(...validDates));
                const maxDate = new Date(Math.max(...validDates));
                const yearsCovered = maxDate.getFullYear() - minDate.getFullYear() + 1;
                
                const yearsElement = document.getElementById('years-covered');
                if (yearsElement) {
                    yearsElement.textContent = yearsCovered;
                }
            }
        }
    }

    initLightbox() {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.getAttribute('data-index') || '0');
                this.openLightbox(index);
            });
        });

        // Lightbox navigation
        const closeBtn = document.getElementById('lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        // OPTIONAL: Navigation buttons
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.showPrevPhoto());
        if (nextBtn) nextBtn.addEventListener('click', () => this.showNextPhoto());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (!lightbox || !lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.showPrevPhoto();
                    break;
                case 'ArrowRight':
                    this.showNextPhoto();
                    break;
            }
        });

        // Close on overlay click
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
    }

    openLightbox(index) {
        this.currentLightboxIndex = index;
        const photo = this.filteredPhotos[index];

        if (!photo) return;

        // Update lightbox content
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDate = document.getElementById('lightbox-date');
        const lightboxDescription = document.getElementById('lightbox-description');

        if (lightboxImage) lightboxImage.src = photo.src;
        if (lightboxTitle) lightboxTitle.textContent = photo.title || '';
        if (lightboxDate) lightboxDate.textContent = photo.date || '';
        if (lightboxDescription) lightboxDescription.textContent = photo.description || '';

        // Show lightbox
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Load thumbnails jika ada
        this.loadThumbnails();
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showPrevPhoto() {
        if (this.currentLightboxIndex > 0) {
            this.currentLightboxIndex--;
            this.openLightbox(this.currentLightboxIndex);
        }
    }

    showNextPhoto() {
        if (this.currentLightboxIndex < this.filteredPhotos.length - 1) {
            this.currentLightboxIndex++;
            this.openLightbox(this.currentLightboxIndex);
        }
    }

    loadThumbnails() {
        const thumbnailsContainer = document.getElementById('lightbox-thumbnails');
        if (!thumbnailsContainer) return;

        thumbnailsContainer.innerHTML = '';

        this.filteredPhotos.forEach((photo, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.className = 'thumbnail';
            thumbnail.src = photo.src;
            thumbnail.alt = photo.title || '';
            
            if (index === this.currentLightboxIndex) {
                thumbnail.classList.add('active');
            }

            thumbnail.addEventListener('click', () => {
                this.openLightbox(index);
            });

            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    handleFileUpload(files) {
        if (!files || !files.length) return;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    // Create new photo object
                    const newPhoto = {
                        id: this.photos.length + 1,
                        src: e.target.result,
                        title: 'Foto Baru',
                        date: new Date().toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }),
                        description: 'Foto baru yang diupload',
                        category: 'everyday',
                        tags: ['uploaded', 'new']
                    };

                    // Add to photos array
                    this.photos.unshift(newPhoto);
                    
                    // Update gallery
                    this.updateStats();
                    this.filterPhotos();
                    this.currentPage = 1;
                    this.renderGallery();

                    // Show success message
                    this.showNotification('Foto berhasil diupload!', 'success');
                };

                reader.readAsDataURL(file);
            }
        });
    }

    filterByAlbum(album) {
        // Map album names to categories
        const albumMap = {
            'first-year': 'firsts',
            'travel': 'travel',
            'celebration': 'celebration',
            'everyday': 'everyday'
        };

        const category = albumMap[album];
        if (category) {
            // Set active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === category) {
                    btn.classList.add('active');
                }
            });

            this.currentFilter = category;
            this.currentPage = 1;
            this.filterPhotos();
            this.renderGallery();

            // Scroll to gallery section
            const gallerySection = document.querySelector('.gallery-grid-section');
            if (gallerySection) {
                gallerySection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }

    showNotification(message, type = 'info') {
        // Hapus dulu notifikasi yang sudah ada
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add inline styles untuk simple
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            border-left: 4px solid ${type === 'success' ? '#B8DB80' : '#FF6B9D'};
            animation: slideInRight 0.3s ease-out;
        `;

        // Add keyframe animation
        if (!document.querySelector('#notification-animation')) {
            const style = document.createElement('style');
            style.id = 'notification-animation';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Initialize gallery when DOM is loaded - FIXED VERSION
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
    
    // Add current year to footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    console.log('Gallery initialized successfully');
});

// Fallback: Force remove loading after 3 seconds
setTimeout(function() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('Fallback: Removing loading screen...');
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
    }
}, 3000);
