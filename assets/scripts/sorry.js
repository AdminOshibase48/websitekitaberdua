/* =============================================================
   MINI RPG VISUAL NOVEL — "Untukmu, Dari Aku"
   Ganti teks di bagian STORY DATA sesuai kisahmu sendiri.
   Ganti gambar di folder /images/ sesuai namanya.
   ============================================================= */

/* ──────────────────────────────────────────────
   🌸 STORY DATA — Ubah di sini saja!
   ────────────────────────────────────────────── */
const STORY = [
  /* ── SCENE 1: Pembuka — Kenangan ── */
  {
    id: 1,
    bg: "images/kenangan.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Eh, boleh aku cerita sesuatu nggak?\n\n" +
      "Aku lagi mikirin momen-momen waktu kita saling ada buat satu sama lain. " +
      "Kamu tau yang itu — waktu salah satu dari kita lagi nggak baik-baik aja, " +
      "dan yang satunya langsung ada. Nggak nanya banyak. Nggak menghakimi. " +
      "Cuma... ada.\n\n" +
      "Aku selalu kagum sama itu. Kagum sama kamu.\n\n" +
      "Dan sekarang, giliran aku yang mau ada buat kamu — " +
      "dimulai dari ngomong jujur. 💕",
    type: "next",
  },

  /* ── SCENE 2: Konflik — Pengakuan ── */
  {
    id: 2,
    bg: "images/konflik.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Tadi aku bikin kamu marah. Dan aku tau itu.\n\n" +
      "Jujur, ada bagian kecil dari aku yang ngelakuin itu... " +
      "ya karena aku pengen kamu salting. " +
      "Pengen kamu dapet sesuatu yang bikin kamu kaget tapi terharu gitu. " +
      "Tapi caranya salah, dan aku minta maaf buat itu.\n\n" +
      "Niatnya mau bikin kamu senyum, malah bikin kamu kesel duluan. " +
      "Classic aku banget, sih. 😅\n\n" +
      "Gimana perasaan kamu sekarang?",
    type: "choice",
    choices: [
      {
        label: "Oke aku dengerin dulu... 👂",
        next: 3,
      },
      {
        label: "Masih agak kesel nih 😤",
        extraMsg:
          "Iya, wajar banget.\n\n" +
          "Aku nggak minta kamu langsung oke. " +
          "Aku cuma minta satu hal — baca sampai selesai dulu, ya? " +
          "Setelah itu, kalau kamu masih mau marah, aku siap dengerin juga. " +
          "Kali ini beneran dengerin, bukan cuma diem. 🙏",
        showChoiceAfterExtra: true,
      },
    ],
  },

  /* ── SCENE 3: Surat — Puncak ── */
  {
    id: 3,
    bg: "images/maaf.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Sayang...\n\n" +
      "Aku mau minta maaf. Bukan karena terpaksa atau karena takut kamu terus marah. " +
      "Tapi karena aku beneran ngerasa salah — dan kamu layak denger itu langsung dari aku.\n\n" +
      "Kamu itu selalu jadi orang pertama yang ada waktu aku lagi susah. " +
      "Nggak pernah sekalipun kamu ninggalin aku sendirian pas aku butuh. " +
      "Dan itu bukan hal kecil. Itu salah satu hal yang bikin aku sayang sama kamu makin hari makin dalam.\n\n" +
      "Jadi waktu aku malah bikin kamu kesel — " +
      "apalagi dengan cara yang harusnya bikin kamu senyum — " +
      "rasanya nyesek banget di sini. 🫀\n\n" +
      "Aku janji: lain kali aku mau lebih mikirin perasaan kamu duluan " +
      "sebelum ngelakuin hal-hal 'spontan' yang cuma lucu di kepala aku doang. " +
      "Kamu berhak dapet yang lebih baik dari itu.\n\n" +
      "Maafin aku ya, istriku, princessku. 🌸",
    type: "next",
    nextLabel: "Terima Maafku? 🥺",
  },

  /* ── SCENE 4: Ending ── */
  {
    id: 4,
    bg: "images/istana.jpg",
    speaker: "♡ Istriku, Princessku",
    text:
      "Kamu tau yang aku suka dari kita?\n\n" +
      "Kita bisa ketawa bareng soal hal paling random sekalipun. " +
      "Kita bisa deep talk jam 2 malem tentang hal-hal yang bahkan nggak ada hubungannya sama kehidupan kita. " +
      "Kita bisa berantem, terus baikan, " +
      "terus ketawa lagi seolah nggak ada yang terjadi — " +
      "tapi sebenernya kita sama-sama tumbuh dari situ.\n\n" +
      "Aku nggak sempurna. Kamu juga nggak (walaupun kamu deket banget). " +
      "Tapi kita bagus banget kalau lagi bareng.\n\n" +
      "Aku sayang kamu — kemarin, hari ini, dan semua hari yang belum datang. 💕",
    type: "end",
    endLabel: "Selesai 🌷",
    popup: {
      emoji: "🥹",
      title: "Makasih udah mau baca sampai sini...",
      msg:
        "Ini bukan cuma permintaan maaf.\n" +
        "Ini juga pengingat buat aku sendiri — " +
        "bahwa kamu itu berharga, dan aku nggak mau lupa itu.\n\n" +
        "Kalau kamu udah nggak marah, boleh aku minta senyumnya? 🌸\n\n" +
        "— Yang sayangnya nggak ada habisnya, aku 💌",
    },
  },
];

/* ──────────────────────────────────────────────
   DOM REFERENCES
   ────────────────────────────────────────────── */
const sceneBg      = document.getElementById("scene-bg");
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

  /* Fade background */
  sceneBg.classList.add("fade-out");
  setTimeout(() => {
    sceneBg.src = scene.bg;
    sceneBg.alt = `Scene ${scene.id}`;
    sceneBg.classList.remove("fade-out");
  }, 400);

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
