/* =============================================================
   MINI RPG VISUAL NOVEL — "Untukmu, Dari Aku"
   Ganti teks di bagian STORY DATA sesuai kisahmu sendiri.
   Ganti gambar di folder /images/ sesuai namanya.
   ============================================================= */

/* ──────────────────────────────────────────────
   🌸 STORY DATA — Ubah di sini saja!
   ────────────────────────────────────────────── */
const STORY = [
  /* ── SCENE 1: Pembuka — Situasi Call ── */
  {
    id: 1,
    bg: "../assets/foryou/gambar/gambar2.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Jadi tadi kita lagi call.\n\n" +
      "Kamu keliatan cantik banget — " +
      "dan aku, dengan segala kejeniusan yang aku punya, " +
      "malah fokus ke bajunya. 😭\n\n" +
      "\"Bajunya itu yang kemaren?\"\n\n" +
      "Iya. Itu yang aku tanyain. Ke kamu. Yang lagi cantik-cantiknya di depan layar.\n\n" +
      "Kamu bilang, \"ada 2\" — dengan nada yang... " +
      "aku tau banget itu nada apa. " +
      "Itu nada kamu pura-pura biasa tapi sebenernya kesel. " +
      "Aku hapal. Kamu jangan pura-pura. 🙈",
    type: "next",
  },

  /* ── SCENE 2: Konflik — Pengakuan Receh tapi Tulus ── */
  {
    id: 2,
    bg: "../assets/foryou/gambar/gambar3.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Oke, aku mau jujur.\n\n" +
      "Pertanyaan itu keluar gitu aja — dan begitu aku bilang, " +
      "aku langsung tau itu salah. " +
      "Bukan karena bajunya nggak penting, " +
      "tapi karena... harusnya yang pertama aku bilang tuh bukan soal baju.\n\n" +
      "Harusnya aku bilang kamu keliatan cantik. " +
      "Atau sekedar senyum dulu. " +
      "Bukan malah langsung detektif fashion dadakan. 🕵️‍♂️\n\n" +
      "Gimana? Masih pura-pura marah atau udah mau dengerin aku dulu?",
    type: "choice",
    choices: [
      {
        label: "Oke, dengerin dulu deh... 🙄💕",
        next: 3,
      },
      {
        label: "Masiiih kesel nih 😤",
        extraMsg:
          "Iya iya, aku tau. 😔\n\n" +
          "Tapi kamu juga tau kan kalau aku sayang kamu? " +
          "Makanya aku bikin ini — bukan pake ngomong doang, " +
          "tapi beneran usaha. Baca dulu ya, sayang. " +
          "Aku janji bagian selanjutnya lebih manis. 🌸",
        showChoiceAfterExtra: true,
      },
    ],
  },

  /* ── SCENE 3: Surat — Puncak yang Tulus ── */
  {
    id: 3,
    bg: "../assets/foryou/gambar/gambar1.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Istriku, princessku...\n\n" +
      "Aku minta maaf soal pertanyaan baju tadi. " +
      "Kedengarannya sepele — dan emang sepele — " +
      "tapi aku nggak mau kamu nyimpen rasa keselnya, " +
      "sekecil apapun itu.\n\n" +
      "Karena kamu itu nggak pernah biarin aku nyimpen hal-hal kecil sendirian. " +
      "Waktu aku lagi susah, kamu selalu ada. " +
      "Nggak nunggu aku minta tolong dulu. " +
      "Kamu tau aja — dan langsung ada.\n\n" +
      "Aku mau jadi kayak gitu buat kamu juga. " +
      "Lebih peka, lebih perhatian — " +
      "mulai dari hal yang sekecil milih kata-kata pas kita lagi call.\n\n" +
      "Yang harusnya aku bilang tadi:\n" +
      "Kamu cantik banget. Bajunya dua atau dua ratus, " +
      "tetep kamu yang bikin semuanya keliatan bagus. 💕\n\n" +
      "Maafin aku ya, sayang. 🌸",
    type: "next",
    nextLabel: "Maafin aku? 🥺",
  },

  /* ── SCENE 4: Ending — Manis & Bikin Salting ── */
  {
    id: 4,
    bg: "https://res.cloudinary.com/deospx6aw/image/upload/v1768691347/IMG20251217134312_rjluot.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Aku tau kamu pura-pura marah.\n\n" +
      "Dan aku tau juga — di balik muka kesel itu — " +
      "ada senyum kecil yang kamu tahan-tahan. " +
      "Aku hapal. Jangan disangkal. 😏💕\n\n" +
      "Makanya aku bikin ini.\n\n" +
      "Bukan karena masalahnya gede — " +
      "tapi karena kamu berhak tau seberapa aku mikirin kamu. " +
      "Bahkan untuk hal sekecil pertanyaan baju yang harusnya nggak aku tanyain.\n\n" +
      "Kamu itu istriku, princessku.\n" +
      "Dan aku nggak mau kamu kesel — " +
      "bahkan satu detik pun. 🏡💕",
    type: "end",
    endLabel: "Selesai 🌷",
    popup: {
      emoji: "🥹",
      title: "Udah nggak kesel kan? 🌸",
      msg:
        "Kalau masih kesel — aku terima.\n" +
        "Tapi kalau udah senyum dari tadi tapi ditahan-tahan...\n\n" +
        "Boleh senyumnya dikeluarin sekarang. Aku tau kok. 😏\n\n" +
        "Aku sayang kamu, istriku, princessku.\n" +
        "Maafin aku ya — dari aku yang selalu mau jadi yang terbaik buat kamu. 💌",
    },
  },
];

/* ──────────────────────────────────────────────
   DOM REFERENCES
   ────────────────────────────────────────────── */
const sceneBg      = document.getElementById("scene-bg");
const scenePhoto   = document.getElementById("scene-photo");
const photoFrame   = document.getElementById("photo-frame");
const speakerEl    = document.getElementById("speaker-name");
const textEl       = document.getElementById("dialogue-text");
const extraMsgEl   = document.getElementById("extra-msg");
const choicesEl    = document.getElementById("choices");
const btnNext      = document.getElementById("btn-next");
const sceneCounter = document.getElementById("scene-counter");
const popup        = document.getElementById("popup");
const popupEmoji   = document.getElementById("popup-emoji");
const popupTitle   = document.getElementById("popup-title");
const popupMsg     = document.getElementById("popup-msg");
const popupClose   = document.getElementById("popup-close");

/* Gradients per scene — bisa diganti warnanya */
const SCENE_GRADIENTS = [
  "linear-gradient(145deg, #ffd6ec 0%, #ffb3d1 45%, #ff80b3 100%)",
  "linear-gradient(145deg, #ffe0ee 0%, #ffadd4 40%, #ff6eb0 100%)",
  "linear-gradient(145deg, #fff0f7 0%, #ffc8e0 45%, #ff85bb 100%)",
  "linear-gradient(145deg, #ffeaf5 0%, #ffbad6 40%, #ff70aa 100%)",
];

/* ──────────────────────────────────────────────
   STATE
   ────────────────────────────────────────────── */
let currentSceneIndex = 0;

/* ──────────────────────────────────────────────
   LOAD SCENE
   ────────────────────────────────────────────── */
function loadScene(index) {
  const scene = STORY[index];
  if (!scene) return;
  currentSceneIndex = index;

  /* Ganti gradient background per scene */
  const grad = SCENE_GRADIENTS[index % SCENE_GRADIENTS.length];
  sceneBg.classList.add("fade-out");
  setTimeout(() => {
    sceneBg.style.background = grad;
    sceneBg.classList.remove("fade-out");
  }, 300);

  /* Foto dekoratif di pojok — muncul jika ada, sembunyi jika tidak */
  if (scene.bg) {
    photoFrame.classList.remove("hidden-frame", "visible");
    scenePhoto.src = scene.bg;
    scenePhoto.alt = `Scene ${scene.id}`;
    // Munculkan dengan animasi kecil setelah gambar load
    scenePhoto.onload = () => {
      setTimeout(() => photoFrame.classList.add("visible"), 200);
    };
    // Fallback jika gambar gagal load — sembunyikan frame
    scenePhoto.onerror = () => {
      photoFrame.classList.add("hidden-frame");
    };
  } else {
    photoFrame.classList.add("hidden-frame");
  }

  /* Speaker & text */
  speakerEl.textContent = scene.speaker || "";
  typeText(textEl, scene.text);

  /* Scene counter */
  sceneCounter.textContent = `✨ Scene ${scene.id} / ${STORY.length}`;

  /* Reset UI */
  extraMsgEl.classList.add("hidden");
  extraMsgEl.textContent = "";
  choicesEl.innerHTML = "";
  btnNext.classList.add("hidden");
  btnNext.textContent = scene.nextLabel || "Lanjut ✨";

  /* Build UI per type */
  if (scene.type === "next") {
    setTimeout(() => {
      btnNext.classList.remove("hidden");
      btnNext.onclick = () => loadScene(currentSceneIndex + 1);
    }, 600);

  } else if (scene.type === "choice") {
    setTimeout(() => renderChoices(scene), 600);

  } else if (scene.type === "end") {
    setTimeout(() => {
      btnNext.classList.remove("hidden");
      btnNext.textContent = scene.endLabel || "Selesai 🌸";
      btnNext.onclick = () => showPopup(scene.popup);
    }, 600);
  }
}

/* ──────────────────────────────────────────────
   RENDER CHOICES
   ────────────────────────────────────────────── */
function renderChoices(scene) {
  choicesEl.innerHTML = "";

  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.label;

    btn.addEventListener("click", () => {
      if (choice.next !== undefined) {
        /* Find scene with matching id */
        const nextIndex = STORY.findIndex((s) => s.id === choice.next);
        loadScene(nextIndex >= 0 ? nextIndex : currentSceneIndex + 1);

      } else if (choice.extraMsg) {
        /* Show extra message */
        extraMsgEl.textContent = choice.extraMsg;
        extraMsgEl.classList.remove("hidden");
        extraMsgEl.classList.add("slide-in");

        /* Remove old choices, show only 'aku sadar' */
        if (choice.showChoiceAfterExtra) {
          choicesEl.innerHTML = "";
          const sadarBtn = document.createElement("button");
          sadarBtn.className = "choice-btn";
          sadarBtn.textContent = "Aku Sadar Aku Salah 💔";
          sadarBtn.addEventListener("click", () => {
            const nextIndex = STORY.findIndex((s) => s.id === scene.choices[0].next);
            loadScene(nextIndex >= 0 ? nextIndex : currentSceneIndex + 1);
          });
          choicesEl.appendChild(sadarBtn);
        }
      }
    });

    choicesEl.appendChild(btn);
  });
}

/* ──────────────────────────────────────────────
   TYPEWRITER EFFECT
   ────────────────────────────────────────────── */
let typingTimer = null;

function typeText(el, fullText) {
  if (typingTimer) clearTimeout(typingTimer);
  el.textContent = "";
  let i = 0;
  const speed = 22; // ms per char

  function step() {
    if (i < fullText.length) {
      el.textContent += fullText[i];
      i++;
      typingTimer = setTimeout(step, speed);
    }
  }

  // Click to skip typing
  el.onclick = () => {
    if (i < fullText.length) {
      clearTimeout(typingTimer);
      el.textContent = fullText;
      i = fullText.length;
    }
  };

  step();
}

/* ──────────────────────────────────────────────
   POPUP
   ────────────────────────────────────────────── */
function showPopup(data) {
  if (!data) return;
  popupEmoji.textContent = data.emoji || "💕";
  popupTitle.textContent = data.title || "Terima kasih...";
  popupMsg.textContent   = data.msg   || "";
  popup.classList.remove("hidden");
}

popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
});

/* ──────────────────────────────────────────────
   FLOATING HEARTS
   ────────────────────────────────────────────── */
const HEART_CHARS = ["❤️", "🌸", "💕", "💗", "🌷", "✨", "💖"];
const heartsContainer = document.getElementById("hearts-container");

function spawnHeart() {
  const el = document.createElement("span");
  el.className = "heart";
  el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  el.style.left = Math.random() * 100 + "vw";
  const dur = 6 + Math.random() * 8;
  el.style.animationDuration = dur + "s";
  el.style.animationDelay   = Math.random() * 4 + "s";
  el.style.fontSize = (0.9 + Math.random() * 1.2) + "rem";
  heartsContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 5) * 1000);
}

/* Spawn hearts periodically */
setInterval(spawnHeart, 1200);
/* Spawn a burst on start */
for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

/* ──────────────────────────────────────────────
   START GAME
   ────────────────────────────────────────────── */
loadScene(0);
