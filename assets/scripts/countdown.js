// REVISI COUNTDOWN.JS DENGAN TANGGAL JELAS
class AnniversaryCountdown {
    constructor() {
        // Tanggal jadian: 17 Desember 2025
        this.startDate = new Date('2025-12-17T00:00:00');
        // Next anniversary: 17 Desember tahun depan
        this.targetDate = this.getNextAnniversary();
        
        this.elements = {};
        this.timerInterval = null;
        this.init();
    }

    // Get next anniversary date
    getNextAnniversary() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Anniversary tahun ini (17 Desember tahun ini)
        let anniversary = new Date(currentYear, 11, 17); // Desember = bulan 11 (0-indexed)
        
        // Jika anniversary tahun ini sudah lewat, gunakan tahun depan
        if (now > anniversary) {
            anniversary = new Date(currentYear + 1, 11, 17);
        }
        
        // Set waktu ke tengah malam
        anniversary.setHours(0, 0, 0, 0);
        return anniversary;
    }

    init() {
        // Get all DOM elements
        this.elements = {
            // Countdown timer
            days: document.getElementById('countdown-days'),
            hours: document.getElementById('countdown-hours'),
            minutes: document.getElementById('countdown-minutes'),
            seconds: document.getElementById('countdown-seconds'),
            
            // Date display
            anniversaryDate: document.getElementById('anniversary-date'),
            anniversaryDay: document.getElementById('anniversary-day'),
            anniversaryNumber: document.getElementById('anniversary-number'),
            
            // Status and info
            status: document.getElementById('countdown-status'),
            progressFill: document.getElementById('progress-fill'),
            progressPercentage: document.getElementById('progress-percentage'),
            timeTogether: document.getElementById('time-together'),
            heartbeats: document.getElementById('heartbeats'),
            laughterCount: document.getElementById('laughter-count')
        };

        // Validate elements
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element && key !== 'laughterCount') { // laughterCount optional
                console.warn(`Element not found: ${key}`);
            }
        }

        // Initialize date display
        this.updateDateDisplay();
        
        // Start countdown
        this.startCountdown();
        
        // Update additional info
        this.updateAdditionalInfo();
    }

    updateDateDisplay() {
        if (!this.elements.anniversaryDate || !this.elements.anniversaryDay) return;
        
        // Format tanggal
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = this.targetDate.toLocaleDateString('id-ID', options);
        
        // Split date and day
        const [day, ...dateParts] = formattedDate.split(', ');
        const date = dateParts.join(', ');
        
        // Calculate anniversary number
        const anniversaryNumber = this.targetDate.getFullYear() - this.startDate.getFullYear();
        const numberText = this.getNumberText(anniversaryNumber);
        
        // Update DOM
        this.elements.anniversaryDate.textContent = date;
        this.elements.anniversaryDay.textContent = day;
        this.elements.anniversaryNumber.textContent = numberText;
    }

    getNumberText(number) {
        const numbers = [
            'Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima',
            'Keenam', 'Ketujuh', 'Kedelapan', 'Kesembilan', 'Kesepuluh'
        ];
        
        if (number <= numbers.length) {
            return numbers[number - 1];
        }
        return `Ke-${number}`;
    }

    startCountdown() {
        // Initial update
        this.updateCountdown();
        
        // Update every second
        this.timerInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = new Date();
        const timeRemaining = this.targetDate - now;
        
        // If countdown finished
        if (timeRemaining <= 0) {
            this.handleCountdownFinished();
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Update countdown display
        this.updateTimerDisplay(days, hours, minutes, seconds);
        
        // Update progress bar
        this.updateProgressBar(timeRemaining);
        
        // Update status message
        this.updateStatusMessage(days);
    }

    updateTimerDisplay(days, hours, minutes, seconds) {
        const values = {
            days: days.toString().padStart(2, '0'),
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        };
        
        // Update with animation
        for (const [unit, value] of Object.entries(values)) {
            const element = this.elements[unit];
            if (!element) continue;
            
            if (element.textContent !== value) {
                element.classList.add('changing');
                element.textContent = value;
                
                setTimeout(() => {
                    element.classList.remove('changing');
                }, 300);
            }
        }
    }

    updateProgressBar(timeRemaining) {
        if (!this.elements.progressFill || !this.elements.progressPercentage) return;
        
        const totalTime = this.targetDate - new Date(this.targetDate.getFullYear() - 1, 11, 17);
        const timePassed = totalTime - timeRemaining;
        const percentage = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
        
        // Update progress bar
        this.elements.progressFill.style.width = `${percentage}%`;
        this.elements.progressPercentage.textContent = `${Math.round(percentage)}%`;
    }

    updateStatusMessage(daysRemaining) {
        if (!this.elements.status) return;
        
        let message = '';
        
        if (daysRemaining > 365) {
            const years = Math.floor(daysRemaining / 365);
            const remainingDays = daysRemaining % 365;
            message = `Masih ${years} tahun ${remainingDays} hari lagi!`;
        } else if (daysRemaining > 60) {
            const months = Math.floor(daysRemaining / 30);
            message = `Tinggal ${months} bulan ${daysRemaining % 30} hari lagi!`;
        } else if (daysRemaining > 30) {
            message = `Tinggal ${daysRemaining} hari lagi!`;
        } else if (daysRemaining > 14) {
            message = `${daysRemaining} hari menuju anniversary! 💕`;
        } else if (daysRemaining > 7) {
            message = `Hanya ${daysRemaining} hari lagi! Sudah dekat!`;
        } else if (daysRemaining > 3) {
            message = `${daysRemaining} hari lagi! Siap-siap merayakan!`;
        } else if (daysRemaining > 1) {
            message = `HANYA ${daysRemaining} HARI LAGI! 🎉`;
        } else if (daysRemaining === 1) {
            message = `BESOK HARI ANNIVERSARY! GET READY! 🥳`;
        } else if (daysRemaining === 0) {
            message = `HARI INI HARI ANNIVERSARY! SELAMAT! 🎊`;
        }
        
        this.elements.status.textContent = message;
    }

    updateAdditionalInfo() {
        // Calculate days together
        const now = new Date();
        const daysTogether = Math.floor((now - this.startDate) / (1000 * 60 * 60 * 24));
        
        // Estimate heartbeats (average 72 bpm)
        const heartbeats = daysTogether * 24 * 60 * 72;
        
        // Update DOM
        if (this.elements.timeTogether) {
            this.elements.timeTogether.textContent = `${daysTogether} hari`;
        }
        
        if (this.elements.heartbeats) {
            this.elements.heartbeats.textContent = this.formatNumber(heartbeats);
        }
        
        // Random laughter count
        if (this.elements.laughterCount) {
            const laughterCount = Math.floor(Math.random() * 10000) + 1000;
            this.elements.laughterCount.textContent = `${this.formatNumber(laughterCount)}+`;
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + ' juta';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + ' ribu';
        }
        return num.toLocaleString('id-ID');
    }

    handleCountdownFinished() {
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Show celebration
        this.showCelebration();
        
        // Update for next anniversary
        setTimeout(() => {
            this.targetDate = new Date(this.targetDate.getFullYear() + 1, 11, 17);
            this.updateDateDisplay();
            this.startCountdown();
        }, 10000); // Reset after 10 seconds
    }

    showCelebration() {
        // Update all counters to 00
        const counters = ['days', 'hours', 'minutes', 'seconds'];
        counters.forEach(counter => {
            if (this.elements[counter]) {
                this.elements[counter].textContent = '00';
            }
        });
        
        // Update status
        if (this.elements.status) {
            this.elements.status.textContent = '🎉 SELAMAT ANNIVERSARY! 🎉';
            this.elements.status.style.fontSize = '1.5rem';
            this.elements.status.style.color = 'var(--color-accent-pink)';
            this.elements.status.style.fontWeight = '700';
        }
        
        // Update progress to 100%
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = '100%';
        }
        if (this.elements.progressPercentage) {
            this.elements.progressPercentage.textContent = '100%';
        }
        
        // Trigger confetti
        this.startConfetti();
        
        // Play celebration sound
        this.playCelebrationSound();
    }

    startConfetti() {
        const colors = ['#FF6B9D', '#B8DB80', '#FFA8C8', '#FFFFFF', '#FFD1E0'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.5};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                z-index: 9999;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Add confetti animation style
        if (!document.querySelector('#confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    playCelebrationSound() {
        // Create audio element
        const audio = document.createElement('audio');
        
        // Try to play celebration sound
        try {
            // You can add your own celebration sound file
            // audio.src = 'assets/sounds/celebration.mp3';
            // audio.volume = 0.3;
            // audio.play();
            
            // Fallback: Play browser beep
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.value = 880;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
            
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 1);
            
        } catch (error) {
            console.log('Audio playback not supported:', error);
        }
    }
}

// Initialize countdown when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create countdown instance
    const anniversaryCountdown = new AnniversaryCountdown();
    
    // Add styles for countdown animations
    const styles = document.createElement('style');
    styles.textContent = `
        .countdown-value.changing {
            animation: countdownPulse 0.3s ease;
            color: var(--color-accent-pink);
        }
        
        @keyframes countdownPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .countdown-status {
            font-size: 1.2rem;
            color: var(--color-accent-pink);
            text-align: center;
            margin: 20px 0;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .countdown-container {
                gap: 10px;
            }
            
            .countdown-card {
                min-width: 70px;
                padding: 15px;
            }
            
            .countdown-value {
                font-size: 2rem;
            }
            
            .date-card {
                flex-direction: column;
                text-align: center;
            }
            
            .date-details {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(styles);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Refresh countdown when page becomes visible
            anniversaryCountdown.updateCountdown();
        }
    });
    
    // Export for debugging
    window.anniversaryCountdown = anniversaryCountdown;
});

// Fallback for older browsers
if (!window.AudioContext && !window.webkitAudioContext) {
    console.log('Web Audio API not supported');
}
