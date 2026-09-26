const SENTENCES = [
  "The quiet library smelled of old paper and fresh coffee.",
  "A sudden storm rolled over the hills just before sunset.",
  "She fixed the bicycle chain with nothing but a butter knife.",
  "Most good habits start small and grow quietly over time.",
  "The market was loud with vendors calling out fresh fruit prices.",
  "He forgot his umbrella again, right as the clouds turned grey.",
  "Learning to type well takes patience, rhythm, and a bit of stubbornness.",
  "The old clock in the hallway ticked a beat behind the others.",
  "Bright kites drifted over the beach as the wind picked up.",
  "A well placed comma can completely change what a sentence means.",
  "The engineers argued cheerfully about the best route across the bridge.",
  "Rain tapped against the window while the kettle began to whistle.",
  "Every keyboard has its own particular click and its own delay.",
  "The garden grew wild after two seasons of gentle neglect.",
  "Somewhere between the second and third coffee, the idea finally clicked.",
  "The train pulled in exactly as the announcement said it would.",
  "Their plan was simple: pack light, walk slow, and get lost occasionally.",
  "A stray cat had claimed the porch and refused to negotiate.",
  "The recipe called for patience more than any rare ingredient.",
  "Good typing speed is less about haste and more about steady rhythm."
];

let mode = "quick";
let targetText = "";
let spans = [];
let startTime = null;
let timerId = null;
let finished = false;
const SPRINT_SECONDS = 60;

const sentenceEl = document.getElementById('sentence');
const input = document.getElementById('real-input');
const card = document.getElementById('card');
const wpmEl = document.getElementById('stat-wpm');
const accEl = document.getElementById('stat-acc');
const timeEl = document.getElementById('stat-time');
const timeLabel = document.getElementById('time-label');
const resultEl = document.getElementById('result');
const hintEl = document.getElementById('hint');
const restartBtn = document.getElementById('restart-btn');
const modeQuickBtn = document.getElementById('mode-quick');
const modeSprintBtn = document.getElementById('mode-sprint');

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildTarget() {
  if (mode === 'quick') return pick(SENTENCES);
  let text = "";
  while (text.length < 320) {
    text += (text ? " " : "") + pick(SENTENCES);
  }
  return text;
}

function renderTarget() {
  sentenceEl.innerHTML = "";
  spans = [];
  for (const ch of targetText) {
    const span = document.createElement('span');
    span.textContent = ch;
    sentenceEl.appendChild(span);
    spans.push(span);
  }
  if (spans.length) spans[0].classList.add('current');
}

function resetTest() {
  clearInterval(timerId);
  timerId = null;
  startTime = null;
  finished = false;
  targetText = buildTarget();
  renderTarget();
  input.value = "";
  input.maxLength = targetText.length;
  input.disabled = false;
  resultEl.textContent = "";
  hintEl.textContent = "Click the box above and start typing — the timer starts on your first keystroke.";
  wpmEl.textContent = "0";
  accEl.textContent = "100%";
  timeLabel.textContent = mode === 'sprint' ? 'Remaining' : 'Elapsed';
  timeEl.textContent = mode === 'sprint' ? formatTime(SPRINT_SECONDS) : "0:00";
}

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ":" + String(r).padStart(2, '0');
}

function tick() {
  const elapsed = (Date.now() - startTime) / 1000;
  updateStats(elapsed);
  if (mode === 'sprint' && elapsed >= SPRINT_SECONDS) {
    finish(elapsed);
  }
}

function updateStats(elapsed) {
  const typed = input.value;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === targetText[i]) correct++;
  }
  const minutes = Math.max(elapsed / 60, 1 / 600);
  const wpm = Math.round((typed.length / 5) / minutes);
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  wpmEl.textContent = wpm;
  accEl.textContent = acc + "%";
  if (mode === 'sprint') {
    timeEl.textContent = formatTime(SPRINT_SECONDS - elapsed);
  } else {
    timeEl.textContent = formatTime(elapsed);
  }
}

function finish(elapsed) {
  finished = true;
  clearInterval(timerId);
  input.disabled = true;
  updateStats(elapsed);
  hintEl.textContent = "Done. Press \"New line\" to go again.";
  resultEl.textContent = "Finished at " + wpmEl.textContent + " WPM, " + accEl.textContent + " accuracy.";
}

function handleInput() {
  if (finished) return;
  const typed = input.value;

  if (!startTime) {
    startTime = Date.now();
    timerId = setInterval(tick, 200);
    hintEl.textContent = mode === 'sprint' ? "Go — keep typing until time runs out." : "Go — finish the line to see your result.";
  }

  for (let i = 0; i < spans.length; i++) {
    spans[i].classList.remove('correct', 'incorrect', 'current');
    if (i < typed.length) {
      spans[i].classList.add(typed[i] === targetText[i] ? 'correct' : 'incorrect');
    }
  }
  if (typed.length < spans.length) {
    spans[typed.length].classList.add('current');
  }

  updateStats((Date.now() - startTime) / 1000);

  if (mode === 'quick' && typed.length === targetText.length) {
    finish((Date.now() - startTime) / 1000);
  }
}

card.addEventListener('click', () => input.focus());
input.addEventListener('focus', () => card.classList.add('focused'));
input.addEventListener('blur', () => card.classList.remove('focused'));
input.addEventListener('input', handleInput);
restartBtn.addEventListener('click', resetTest);

modeQuickBtn.addEventListener('click', () => {
  mode = 'quick';
  modeQuickBtn.classList.add('active');
  modeSprintBtn.classList.remove('active');
  resetTest();
});
modeSprintBtn.addEventListener('click', () => {
  mode = 'sprint';
  modeSprintBtn.classList.add('active');
  modeQuickBtn.classList.remove('active');
  resetTest();
});

resetTest();