// Story Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Hitung hari, bulan, dan anniversary
    function calculateTimeTogether() {
        const startDate = new Date('2025-12-17');
        const today = new Date();
        
        // Hitung selisih dalam milidetik
        const timeDiff = today.getTime() - startDate.getTime();
        
        // Konversi ke hari
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        // Hitung bulan
        const monthsDiff = today.getMonth() - startDate.getMonth() + 
                          (12 * (today.getFullYear() - startDate.getFullYear()));
        
        // Update elemen HTML
        document.getElementById('days-together').textContent = daysDiff;
        document.getElementById('months-together').textContent = monthsDiff;
        
        // Hitung anniversary number
        const anniversaryThisYear = new Date(today.getFullYear(), 11, 17); // 17 Desember tahun ini
        let anniversaryCount = today.getFullYear() - startDate.getFullYear();
        
        if (today < anniversaryThisYear) {
            anniversaryCount--; // Belum anniversary tahun ini
        }
        
        document.getElementById('anniversary-count').textContent = Math.max(1, anniversaryCount);
    }
    
    // Image Gallery untuk Confession Section
    const galleryImages = document.querySelectorAll('.image-gallery img');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    let currentImageIndex = 0;
    
    function showImage(index) {
        // Sembunyikan semua gambar
        galleryImages.forEach(img => img.classList.remove('active'));
        
        // Tampilkan gambar yang dipilih
        galleryImages[index].classList.add('active');
        currentImageIndex = index;
    }
    
    if (galleryPrev && galleryNext) {
        galleryPrev.addEventListener('click', function() {
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) {
                newIndex = galleryImages.length - 1;
            }
            showImage(newIndex);
        });
        
        galleryNext.addEventListener('click', function() {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= galleryImages.length) {
                newIndex = 0;
            }
            showImage(newIndex);
        });
        
        // Auto slide setiap 5 detik
        setInterval(function() {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= galleryImages.length) {
                newIndex = 0;
            }
            showImage(newIndex);
        }, 5000);
    }
    
    // Animasi untuk moment cards
    const momentCards = document.querySelectorAll('.moment-card');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    momentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Animasi untuk letter cards
    const letterCards = document.querySelectorAll('.letter-card');
    
    letterCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            observer.observe(card);
        }, index * 200);
    });
    
    // Update stats setiap hari
    calculateTimeTogether();
    
    // Update stats setiap 24 jam
    setInterval(calculateTimeTogether, 24 * 60 * 60 * 1000);
    
    // Tambahan: Parallax effect untuk header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.story-header');
        if (header) {
            header.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
    
    // Tambahan: Smooth scroll untuk internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Tambahan: Highlight section saat scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Tambahkan kelas active ke navigasi
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `../pages/${currentSection}.html` || 
                link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Tambahan: Load more untuk moments (jika ada banyak)
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Tampilkan Lebih Banyak Momen';
    loadMoreBtn.style.display = 'none';
    
    const momentsGrid = document.querySelector('.moments-grid');
    if (momentsGrid) {
        momentsGrid.parentNode.appendChild(loadMoreBtn);
        
        // Simulasi data tambahan
        const additionalMoments = [
            {
                icon: 'fas fa-campground',
                title: 'Kemah Pertama',
                date: '10 April 2026',
                desc: 'Berkemah di gunung dan menikmati alam bersama'
            },
            {
                icon: 'fas fa-music',
                title: 'Konser Pertama',
                date: '5 Mei 2026',
                desc: 'Menonton konser band favorit bersama'
            },
            {
                icon: 'fas fa-book',
                title: 'Klub Buku',
                date: '20 Mei 2026',
                desc: 'Bergabung klub buku dan membaca bersama'
            }
        ];
        
        let momentsLoaded = 4; // Sudah ada 4 moments awal
        
        loadMoreBtn.addEventListener('click', function() {
            // Tambahkan 3 moments baru
            for (let i = 0; i < 3 && i < additionalMoments.length; i++) {
                const moment = additionalMoments[i];
                const momentCard = document.createElement('div');
                momentCard.className = 'moment-card';
                momentCard.innerHTML = `
                    <div class="moment-icon">
                        <i class="${moment.icon}"></i>
                    </div>
                    <h3>${moment.title}</h3>
                    <p class="moment-date">${moment.date}</p>
                    <p>${moment.desc}</p>
                `;
                
                // Tambahkan animasi
                momentCard.style.opacity = '0';
                momentCard.style.transform = 'translateY(20px)';
                
                momentsGrid.appendChild(momentCard);
                
                // Animasikan masuk
                setTimeout(() => {
                    momentCard.style.opacity = '1';
                    momentCard.style.transform = 'translateY(0)';
                }, 100);
                
                // Observe untuk animasi
                observer.observe(momentCard);
            }
            
            momentsLoaded += 3;
            
            // Sembunyikan tombol jika sudah semua dimuat
            if (momentsLoaded >= 4 + additionalMoments.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
        
        // Tampilkan tombol jika ada moments tambahan
        if (additionalMoments.length > 0) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.style.margin = '3rem auto 0';
            loadMoreBtn.style.padding = '12px 30px';
            loadMoreBtn.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-accent))';
            loadMoreBtn.style.color = 'white';
            loadMoreBtn.style.border = 'none';
            loadMoreBtn.style.borderRadius = '30px';
            loadMoreBtn.style.cursor = 'pointer';
            loadMoreBtn.style.transition = 'all 0.3s ease';
            loadMoreBtn.style.fontWeight = '600';
            
            loadMoreBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            });
            
            loadMoreBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        }
    }
});
