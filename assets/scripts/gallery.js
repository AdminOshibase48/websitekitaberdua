// Gallery JavaScript
class PhotoGallery {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.photosPerPage = 12;
        this.currentLightboxIndex = 0;
        this.searchTerm = '';
        
        this.init();
    }

    init() {
        // Load sample photos
        this.loadSamplePhotos();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Render gallery
        this.renderGallery();
        
        // Initialize particles if needed
        this.initParticles();
    }

    loadSamplePhotos() {
        // Sample photo data - replace with your actual photos
        this.photos = [
            {
                id: 1,
                src: 'assets/images/gallery/photo1.jpg',
                title: 'Pertemuan Pertama',
                date: '17 Desember 2025',
                description: 'Mata kita bertemu untuk pertama kalinya di kafe itu.',
                category: 'firsts',
                tags: ['first', 'meeting', 'special']
            },
            {
                id: 2,
                src: 'assets/images/gallery/photo2.jpg',
                title: 'Kencan Pertama',
                date: '24 Desember 2025',
                description: 'Makan malam romantis di restoran Italia.',
                category: 'firsts',
                tags: ['first', 'date', 'romantic']
            },
            {
                id: 3,
                src: 'assets/images/gallery/photo3.jpg',
                title: 'Pantai Bersama',
                date: '15 Januari 2026',
                description: 'Liburan pertama kami ke pantai.',
                category: 'travel',
                tags: ['travel', 'beach', 'vacation']
            },
            {
                id: 4,
                src: 'assets/images/gallery/photo4.jpg',
                title: 'Ulang Tahun',
                date: '14 Maret 2026',
                description: 'Merayakan ulang tahun bersama.',
                category: 'celebration',
                tags: ['birthday', 'celebration', 'party']
            },
            {
                id: 5,
                src: 'assets/images/gallery/photo5.jpg',
                title: 'Kopi Pagi',
                date: '20 Februari 2026',
                description: 'Sarapan pagi bersama di kafe favorit.',
                category: 'everyday',
                tags: ['coffee', 'breakfast', 'daily']
            },
            {
                id: 6,
                src: 'assets/images/gallery/photo6.jpg',
                title: 'Sunset Moment',
                date: '5 April 2026',
                description: 'Menikmati matahari terbenam bersama.',
                category: 'special',
                tags: ['sunset', 'romantic', 'special']
            },
            // Add more photos as needed
        ];
        
        // Update total photos count
        this.updateStats();
    }

    initEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Search input
        const searchInput = document.getElementById('gallery-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.filterPhotos();
                this.renderGallery();
            });
        }

        // Clear search
        const clearSearch = document.getElementById('clear-search');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.searchTerm = '';
                this.currentPage = 1;
                this.filterPhotos();
                this.renderGallery();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePhotos();
            });
        }

        // Photo upload
        const uploadBtn = document.getElementById('upload-photo');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                document.getElementById('file-input').click();
            });
        }

        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        // View album buttons
        document.querySelectorAll('.view-album-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const album = e.target.getAttribute('data-album');
                this.filterByAlbum(album);
            });
        });
    }

    handleFilterClick(button) {
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
                    ${photo.tags.join(' ')}
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
        if (!galleryGrid) return;

        // Clear gallery
        galleryGrid.innerHTML = '';

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.photosPerPage;
        const endIndex = startIndex + this.photosPerPage;
        const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);

        // Create photo elements
        photosToShow.forEach((photo, index) => {
            const photoElement = this.createPhotoElement(photo, startIndex + index);
            galleryGrid.appendChild(photoElement);
        });

        // Update load more button visibility
        this.updateLoadMoreButton();

        // Initialize lightbox for new photos
        this.initLightbox();
    }

    createPhotoElement(photo, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-aos', 'zoom-in');
        div.setAttribute('data-category', photo.category);
        div.setAttribute('data-index', index);

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
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openLightbox(index);
        });

        return div;
    }

    loadMorePhotos() {
        const totalPhotos = this.filteredPhotos.length;
        const loadedPhotos = this.currentPage * this.photosPerPage;

        if (loadedPhotos < totalPhotos) {
            this.currentPage++;
            
            // Show loading indicator
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.classList.add('active');
            }

            // Simulate loading delay
            setTimeout(() => {
                this.renderGallery();
                
                // Hide loading indicator
                if (loadingIndicator) {
                    loadingIndicator.classList.remove('active');
                }

                // Scroll to newly loaded photos
                this.scrollToNewPhotos();
            }, 500);
        }
    }

    scrollToNewPhotos() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        const lastPhoto = galleryGrid.lastElementChild;
        if (lastPhoto) {
            lastPhoto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;

        const totalPhotos = this.filteredPhotos.length;
        const loadedPhotos = this.currentPage * this.photosPerPage;

        if (loadedPhotos < totalPhotos) {
            loadMoreBtn.style.display = 'flex';
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
            const dates = this.photos.map(p => new Date(p.date));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const yearsCovered = maxDate.getFullYear() - minDate.getFullYear() + 1;
            
            const yearsElement = document.getElementById('years-covered');
            if (yearsElement) {
                yearsElement.textContent = yearsCovered;
            }
        }
    }

    initLightbox() {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.getAttribute('data-index'));
                this.openLightbox(index);
            });
        });

        // Lightbox navigation
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.showPrevPhoto());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showNextPhoto());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (!lightbox.classList.contains('active')) return;

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

        // Update lightbox content
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDate = document.getElementById('lightbox-date');
        const lightboxDescription = document.getElementById('lightbox-description');

        if (lightboxImage) lightboxImage.src = photo.src;
        if (lightboxTitle) lightboxTitle.textContent = photo.title;
        if (lightboxDate) lightboxDate.textContent = photo.date;
        if (lightboxDescription) lightboxDescription.textContent = photo.description;

        // Show lightbox
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Load thumbnails
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
            thumbnail.alt = photo.title;
            
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
        if (!files.length) return;

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
            document.querySelector('.gallery-grid-section').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 15px 25px;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    transform: translateX(400px);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    max-width: 300px;
                    border-left: 4px solid var(--color-accent-pink);
                }
                
                .notification.success {
                    border-left-color: var(--color-mint);
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification i {
                    font-size: 1.2rem;
                }
                
                .notification.success i {
                    color: var(--color-mint);
                }
                
                .notification span {
                    color: var(--color-dark);
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 3000);
    }

    initParticles() {
        // Initialize particles for hero section
        if (typeof particlesJS !== 'undefined') {
            particlesJS('gallery-particles', {
                particles: {
                    number: { value: 60 },
                    color: { value: ['#FF6B9D', '#B8DB80'] },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    move: { 
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: true
                    }
                }
            });
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const gallery = new PhotoGallery();
    
    // Add current year to footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
