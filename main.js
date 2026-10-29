// ==========================================================================
// ОСНОВНОЙ СКРИПТ ПРОЕКТА (main.js)
// ==========================================================================

const PHYSICS_FORMULAS = [
  "F = m · a",
  "F = G · (m₁m₂ / r²)",
  "p = m · v",
  "E = m · c²",
  "W = F · d",
  "v = v₀ + a·t",
  "F₁ = -F₂",
  "a = Δv / Δt",
];

document.addEventListener("DOMContentLoaded", () => {
  createFloatingFormulas();
  setupButtonEffects();
  initAudioSettings();
  updateLevelsProgress();
});

// Настройка фоновой музыки
const BACKGROUND_MUSIC_FILE = "music.mp3"; 

let bgMusic = window.parent.bgMusic || null;
if (!bgMusic) {
  bgMusic = new Audio(BACKGROUND_MUSIC_FILE);
  bgMusic.loop = true;
  bgMusic.volume = localStorage.getItem('musicVolume') !== null ? parseFloat(localStorage.getItem('musicVolume')) : 0.5;
  window.parent.bgMusic = bgMusic;

  document.addEventListener('click', () => {
    if (bgMusic.paused && localStorage.getItem('musicEnabled') !== 'false') {
      bgMusic.play().catch(e => console.log('Autoplay blocked by browser'));
    }
  }, { once: true });
}

// Звуковой эффект кликов
const clickSfx = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
clickSfx.volume = localStorage.getItem('sfxVolume') !== null ? parseFloat(localStorage.getItem('sfxVolume')) : 0.7;

function playClickSound() {
  if (localStorage.getItem('sfxEnabled') !== 'false') {
    clickSfx.currentTime = 0;
    clickSfx.play().catch(e => {});
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.menu-btn') || e.target.closest('.level-card')) {
    playClickSound();
  }
});

function createFloatingFormulas() {
  const container = document.getElementById("formulasContainer");
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const formulaEl = document.createElement("div");
    formulaEl.classList.add("formula-item");
    formulaEl.innerText = PHYSICS_FORMULAS[Math.floor(Math.random() * PHYSICS_FORMULAS.length)];
    formulaEl.style.left = `${Math.random() * 90 + 5}%`;
    formulaEl.style.animationDelay = `${Math.random() * 10}s`;
    formulaEl.style.animationDuration = `${10 + Math.random() * 8}s`;
    formulaEl.style.fontSize = `${1 + Math.random() * 0.8}rem`;
    container.appendChild(formulaEl);
  }
}

function setupButtonEffects() {
  const buttons = document.querySelectorAll(".menu-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      btn.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });
}

function initAudioSettings() {
  const musicSlider = document.getElementById('musicVolume');
  const sfxSlider = document.getElementById('sfxVolume');

  if (musicSlider) {
    musicSlider.value = bgMusic.volume;
    musicSlider.addEventListener('input', (e) => {
      bgMusic.volume = e.target.value;
      localStorage.setItem('musicVolume', e.target.value);
    });
  }

  if (sfxSlider) {
    sfxSlider.value = clickSfx.volume;
    sfxSlider.addEventListener('input', (e) => {
      clickSfx.volume = e.target.value;
      localStorage.setItem('sfxVolume', e.target.value);
    });
  }
  updateToggleUI();
}

function toggleMusic() {
  playClickSound();
  let musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
  if (musicEnabled) {
    bgMusic.pause();
    localStorage.setItem('musicEnabled', 'false');
  } else {
    bgMusic.play().catch(e => {});
    localStorage.setItem('musicEnabled', 'true');
  }
  updateToggleUI();
}

function toggleSfx() {
  let sfxEnabled = localStorage.getItem('sfxEnabled') !== 'false';
  localStorage.setItem('sfxEnabled', !sfxEnabled);
  playClickSound();
  updateToggleUI();
}

function updateToggleUI() {
  const musicToggle = document.getElementById('musicToggleBtn');
  const sfxToggle = document.getElementById('sfxToggleBtn');

  if (musicToggle) {
    const musicOn = localStorage.getItem('musicEnabled') !== 'false';
    musicToggle.textContent = musicOn ? 'Activ' : 'Dezactivat';
    musicToggle.className = `toggle-btn ${musicOn ? 'active' : ''}`;
  }

  if (sfxToggle) {
    const sfxOn = localStorage.getItem('sfxEnabled') !== 'false';
    sfxToggle.textContent = sfxOn ? 'Activ' : 'Dezactivat';
    sfxToggle.className = `toggle-btn ${sfxOn ? 'active' : ''}`;
  }
}

function navigateTo(targetFile) {
  playClickSound();
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.25s ease";
  setTimeout(() => {
    window.location.href = targetFile;
  }, 200);
}

// Логика карты уровней (levels.html)
function updateLevelsProgress() {
  const maxUnlockedLevel = parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);

  for (let i = 2; i <= 7; i++) {
    const card = document.getElementById(`lvl-${i}`);
    if (!card) continue;

    if (i <= maxUnlockedLevel) {
      card.classList.remove('locked');
      card.classList.add('unlocked');
      const numIcon = card.querySelector('.level-number');
      if (numIcon) numIcon.innerHTML = i === 7 ? '<i class="fa-solid fa-graduation-cap"></i>' : i;
    } else {
      card.classList.add('locked');
      card.classList.remove('unlocked');
      const numIcon = card.querySelector('.level-number');
      if (numIcon) numIcon.innerHTML = '<i class="fa-solid fa-lock"></i>';
    }
  }
}

function startLevel(levelNum) {
  const maxUnlockedLevel = parseInt(localStorage.getItem('maxUnlockedLevel') || '1', 10);
  if (levelNum > maxUnlockedLevel) {
    playClickSound();
    return;
  }
  playClickSound();
  navigateTo(`level.html?num=${levelNum}`);
}

// Управление кастомным окном сброса прогресса
function resetGameProgress() {
  playClickSound();
  const modal = document.getElementById('resetModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeResetModal() {
  playClickSound();
  const modal = document.getElementById('resetModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function executeResetProgress() {
  playClickSound();
  const musicVol = localStorage.getItem('musicVolume');
  const sfxVol = localStorage.getItem('sfxVolume');
  const musicEn = localStorage.getItem('musicEnabled');
  const sfxEn = localStorage.getItem('sfxEnabled');

  localStorage.clear();

  if (musicVol !== null) localStorage.setItem('musicVolume', musicVol);
  if (sfxVol !== null) localStorage.setItem('sfxVolume', sfxVol);
  if (musicEn !== null) localStorage.setItem('musicEnabled', musicEn);
  if (sfxEn !== null) localStorage.setItem('sfxEnabled', sfxEn);

  location.reload();
}