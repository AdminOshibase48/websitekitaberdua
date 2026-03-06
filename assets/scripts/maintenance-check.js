// maintenance-check.js
// MAINTENANCE REDIRECT CHECKER

(function() {
    // Konfigurasi Maintenance
    const MAINTENANCE_CONFIG = {
        // Mode: 'manual' atau 'auto'
        mode: 'manual', // 'manual' untuk atur manual, 'auto' untuk otomatis dari file
            
        // Untuk mode manual: daftar tanggal maintenance (format YYYY-MM-DD)
        manualDates: [
            '2026-03-07', // Ganti dengan tanggal hari ini untuk testing
            '2026-03-08',
            '2026-03-09'
        ],
        
        // Untuk mode auto: ambil dari file eksternal
        autoUrl: '/maintenance-dates.json',
        
        // Halaman maintenance
        maintenancePage: '/maintenance.html',
        
        // Redirect langsung atau kasih peringatan dulu?
        redirectImmediately: true,
        
        // Debug mode (tampilkan console.log)
        debug: true
    };

    // Fungsi debug log
    function debugLog(message, data = null) {
        if (MAINTENANCE_CONFIG.debug) {
            if (data) {
                console.log(`[Maintenance Check] ${message}:`, data);
            } else {
                console.log(`[Maintenance Check] ${message}`);
            }
        }
    }

    // Cek apakah hari ini maintenance
    async function checkMaintenance() {
        try {
            debugLog('Memulai pengecekan maintenance...');
            
            // Ambil tanggal hari ini dengan format yang konsisten
            const today = getTodayDate();
            debugLog('Tanggal hari ini', today);
            
            // Dapatkan daftar tanggal maintenance
            let maintenanceDates = [];
            
            if (MAINTENANCE_CONFIG.mode === 'auto') {
                // Ambil dari file JSON
                maintenanceDates = await fetchMaintenanceDates();
            } else {
                // Gunakan daftar manual
                maintenanceDates = MAINTENANCE_CONFIG.manualDates;
            }
            
            debugLog('Daftar tanggal maintenance', maintenanceDates);
            
            // Cek apakah hari ini termasuk maintenance
            const isMaintenanceDay = maintenanceDates.includes(today);
            debugLog('Hari ini maintenance?', isMaintenanceDay);
            
            // Cek apakah kita sudah di halaman maintenance
            const currentPath = window.location.pathname;
            const isOnMaintenancePage = currentPath.includes('maintenance') || 
                                        currentPath.endsWith('maintenance.html');
            
            debugLog('Path saat ini', currentPath);
            debugLog('Di halaman maintenance?', isOnMaintenancePage);
            
            // Logika redirect
            if (isMaintenanceDay && !isOnMaintenancePage) {
                // Hari ini maintenance dan belum di halaman maintenance
                debugLog('Redirect ke halaman maintenance...');
                
                if (MAINTENANCE_CONFIG.redirectImmediately) {
                    // Redirect langsung
                    window.location.href = MAINTENANCE_CONFIG.maintenancePage;
                } else {
                    // Kasih konfirmasi dulu
                    if (confirm('Website sedang dalam pemeliharaan. Ingin ke halaman maintenance?')) {
                        window.location.href = MAINTENANCE_CONFIG.maintenancePage;
                    }
                }
            } else if (!isMaintenanceDay && isOnMaintenancePage) {
                // Bukan hari maintenance tapi ada di halaman maintenance
                debugLog('Bukan hari maintenance, redirect ke home...');
                window.location.href = '/';
            } else {
                debugLog('Tidak perlu redirect');
            }
            
        } catch (error) {
            console.error('[Maintenance Check] Error:', error);
        }
    }

    // Ambil tanggal hari ini dengan format YYYY-MM-DD (handle timezone)
    function getTodayDate() {
        const date = new Date();
        
        // Gunakan UTC untuk konsistensi
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    // Ambil daftar tanggal maintenance dari file JSON
    async function fetchMaintenanceDates() {
        try {
            const response = await fetch(MAINTENANCE_CONFIG.autoUrl);
            if (!response.ok) {
                throw new Error('Gagal mengambil file konfigurasi');
            }
            const data = await response.json();
            return data.dates || [];
        } catch (error) {
            console.error('[Maintenance Check] Gagal fetch maintenance dates:', error);
            return []; // Return empty array kalau gagal
        }
    }

    // Jalankan pengecekan setelah DOM loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkMaintenance);
    } else {
        checkMaintenance();
    }

})();
