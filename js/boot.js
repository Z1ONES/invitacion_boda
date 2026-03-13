const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const progressText = document.getElementById('progress-text');
const progressLog = document.getElementById('progress-log');
const continueTrigger = document.getElementById('continue-trigger');
const introScreen = document.getElementById('intro-screen');
const bootScreen = document.getElementById('boot-screen');
const bootContent = document.getElementById('boot-content');
const bootPrompt = document.getElementById('boot-prompt');
const typingAudio = document.getElementById('typing-audio');

const progressSteps = [
  { pct: 12, label: 'Cargando módulos...', log: 'Montando entorno retro...' },
  { pct: 28, label: 'Verificando subsistemas...', log: 'Sincronizando ceremonia y fiesta...' },
  { pct: 49, label: 'Compilando recuerdos...', log: 'Ajustando limones, flores y píxeles...' },
  { pct: 71, label: 'Enlazando jugadores...', log: 'Preparando invitación interactiva...' },
  { pct: 89, label: 'Finalizando arranque...', log: 'Validando acceso al evento...' },
  { pct: 100, label: 'Sistema listo', log: 'Esperando interacción del usuario...' }
];

const bootLines = [
  'INICIANDO SISTEMA...',
  'Montando módulo: Flor.sys',
  'Montando módulo: Keke.dev',
  'Sincronizando recuerdos compartidos',
  'Validando acceso a ceremonia.exe',
  'Preparando fiesta.dll',
  'Cargando estética amalfitana.pixel',
  'Compilando matrimonio_2026.pkg',
  'Estado final: 100% PERFECTA',
  'Iniciando boda.exe'
];

const typeSpeed = 44;
const linePause = 220;
const finalDelay = 1000;
let continueEnabled = false;
let audioUnlocked = false;
let bootStarted = false;

function runProgress() {
  progressSteps.forEach((step, index) => {
    setTimeout(() => {
      progressBar.style.width = `${step.pct}%`;
      progressPercent.textContent = `${step.pct}%`;
      progressText.textContent = step.label;
      progressLog.textContent = step.log;

      if (index === progressSteps.length - 1) {
        continueEnabled = true;
        continueTrigger.disabled = false;
        continueTrigger.style.opacity = '1';
      }
    }, 520 * (index + 1));
  });
}

async function unlockAudio() {
  if (!typingAudio || audioUnlocked) return;
  try {
    typingAudio.currentTime = 0;
    await typingAudio.play();
    typingAudio.pause();
    typingAudio.currentTime = 0;
    audioUnlocked = true;
  } catch (error) {
    audioUnlocked = false;
  }
}

async function startBoot() {
  if (!continueEnabled || bootStarted) return;
  bootStarted = true;
  await unlockAudio();

  introScreen.classList.add('fade-out');
  setTimeout(() => {
    introScreen.classList.remove('screen-active');
    bootScreen.classList.add('screen-active');
    requestAnimationFrame(() => typeBootSequence());
  }, 680);
}

async function playTypingAudioOnce() {
  if (!typingAudio) return;
  try {
    typingAudio.pause();
    typingAudio.currentTime = 0;
    typingAudio.loop = false;
    await typingAudio.play();
  } catch (error) {
    // Silencio si el navegador no deja reproducir. El boot sigue igual.
  }
}

function appendCursor() {
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  return cursor;
}

async function typeLine(text) {
  const line = document.createElement('div');
  const textNode = document.createTextNode('');
  const cursor = appendCursor();
  line.appendChild(textNode);
  line.appendChild(cursor);
  bootContent.appendChild(line);

  for (const char of text) {
    textNode.textContent += char;
    await wait(typeSpeed);
  }

  cursor.remove();
  bootContent.scrollTop = bootContent.scrollHeight;
  await wait(linePause);
}

async function typeBootSequence() {
  playTypingAudioOnce();
  for (const line of bootLines) {
    await typeLine(line);
  }
  bootPrompt.classList.remove('hidden');
  await wait(finalDelay);
  window.location.href = './invitacion.html';
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

continueTrigger.addEventListener('click', startBoot);

document.addEventListener('keydown', (event) => {
  if (!continueEnabled) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    startBoot();
  }
});

runProgress();
