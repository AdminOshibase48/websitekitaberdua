document.addEventListener('DOMContentLoaded', () => {
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const messageElement = document.getElementById('message');
    const buttonsContainer = document.querySelector('.buttons');
    const thankYouMessage = document.getElementById('thankYouMessage');

    const initialMessage = messageElement.innerHTML; // Simpan pesan awal

    yesButton.addEventListener('click', () => {
        messageElement.innerHTML = `
            Terima kasih, Sayangku! Kamu sudah membuatku sangat bahagia. Aku janji akan selalu menjaga hati dan kepercayaanmu.
            Aku cinta kamu!
            <br>
            <span class="heart-emoji">❤️</span>
        `;
        buttonsContainer.classList.add('hidden'); // Sembunyikan tombol
        thankYouMessage.classList.remove('hidden'); // Tampilkan pesan terima kasih final
        thankYouMessage.innerHTML = `Terima kasih, Sayangku! Aku janji akan selalu menjagamu. <span class="heart-emoji">❤️</span>`;
    });

    noButton.addEventListener('click', () => {
        // Daftar pesan yang bisa muncul jika dia memilih "Belum"
        const sadMessages = [
            "Yah, kok belum sih? 🥺 Aku janji akan lebih baik lagi...",
            "Aku akan berusaha lebih keras lagi untuk mendapatkan maafmu. Apa yang bisa kulakukan?",
            "Tolong beri aku kesempatan lagi ya, Sayang... Aku nyesel banget.",
            "Hatiku sedih kalau kamu masih marah. 💔 Tolong maafkan aku ya?"
        ];

        // Pilih pesan acak dari daftar
        const randomMessage = sadMessages[Math.floor(Math.random() * sadMessages.length)];
        messageElement.innerHTML = randomMessage; // Tampilkan pesan sedih

        // Sedikit goyangan pada tombol "Belum" atau card
        noButton.style.animation = 'shake 0.5s';
        setTimeout(() => {
            noButton.style.animation = '';
        }, 500);
    });

    // Tambahkan keyframe shake di CSS jika belum ada, atau bisa juga melalui JS
    const styleSheet = document.styleSheets[0];
    const shakeKeyframes = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
    `;
    styleSheet.insertRule(shakeKeyframes, styleSheet.cssRules.length);
});
