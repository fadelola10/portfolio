// ── PENDU ─────────────────────────────────────────────────────
const MOTS = [
  { w: 'docker',     h: 'Outil de conteneurisation' },
  { w: 'kubernetes', h: 'Orchestrateur de conteneurs' },
  { w: 'python',     h: 'Langage de programmation' },
  { w: 'firewall',   h: 'Pare-feu réseau' },
  { w: 'devops',     h: 'Méthodologie de développement' },
  { w: 'github',     h: 'Plateforme de versioning' },
  { w: 'linux',      h: 'Système d\'exploitation open source' },
  { w: 'serveur',    h: 'Machine qui héberge des services' },
  { w: 'reseau',     h: 'Infrastructure de communication' },
  { w: 'securite',   h: 'Protection des systèmes' },
  { w: 'mysql',      h: 'Base de données relationnelle' },
  { w: 'proxmox',    h: 'Hyperviseur open source' },
  { w: 'debian',     h: 'Distribution Linux stable' },
  { w: 'pipeline',   h: 'Chaîne CI/CD automatisée' },
  { w: 'cloud',      h: 'Infrastructure distante' },
  { w: 'script',     h: 'Programme Bash ou Python' },
  { w: 'terminal',   h: 'Interface en ligne de commande' },
  { w: 'ansible',    h: 'Outil d\'automatisation IT' },
];

let penduState = {}, penduScore = 0;

function newPendu() {
  const m = MOTS[Math.floor(Math.random() * MOTS.length)];
  penduState = { word: m.w, hint: m.h, guessed: [], wrong: 0, over: false };
  document.getElementById('penduMsg').textContent = '';
  document.getElementById('penduMsg').style.color = '';
  renderPendu();
}

function renderPendu() {
  const { word, guessed, wrong } = penduState;
  const cv  = document.getElementById('cvPendu');
  const ctx = cv.getContext('2d');

  ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  // gallows
  ctx.beginPath(); ctx.moveTo(20, 170); ctx.lineTo(160, 170); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(55, 170); ctx.lineTo(55, 20);   ctx.stroke();
  ctx.beginPath(); ctx.moveTo(55, 20);  ctx.lineTo(110, 20);  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(110, 20); ctx.lineTo(110, 38);  ctx.stroke();
  // body
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  if (wrong > 0) { ctx.beginPath(); ctx.arc(110, 52, 14, 0, Math.PI*2); ctx.stroke(); }
  if (wrong > 1) { ctx.beginPath(); ctx.moveTo(110, 66);  ctx.lineTo(110, 108); ctx.stroke(); }
  if (wrong > 2) { ctx.beginPath(); ctx.moveTo(110, 76);  ctx.lineTo(92,  96);  ctx.stroke(); }
  if (wrong > 3) { ctx.beginPath(); ctx.moveTo(110, 76);  ctx.lineTo(128, 96);  ctx.stroke(); }
  if (wrong > 4) { ctx.beginPath(); ctx.moveTo(110, 108); ctx.lineTo(92,  132); ctx.stroke(); }
  if (wrong > 5) { ctx.beginPath(); ctx.moveTo(110, 108); ctx.lineTo(128, 132); ctx.stroke(); }

  document.getElementById('penduWord').textContent = word.split('').map(c => guessed.includes(c) ? c : '_').join(' ');
  document.getElementById('pTries').textContent    = 6 - wrong;
  document.getElementById('penduHint').textContent = '💡 ' + penduState.hint;

  const lDiv = document.getElementById('penduLetters');
  lDiv.innerHTML = '';
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(l => {
    const b = document.createElement('button');
    const used = guessed.includes(l);
    b.className = 'letter-btn' + (used ? (word.includes(l) ? ' correct' : ' wrong') : '');
    b.textContent = l;
    if (!used && !penduState.over) b.onclick = () => guessPendu(l);
    lDiv.appendChild(b);
  });

  // win / lose
  if (!penduState.over && word.split('').every(c => guessed.includes(c))) {
    penduState.over = true;
    penduScore += 10;
    document.getElementById('pScore').textContent  = penduScore;
    document.getElementById('penduMsg').style.color = '#22c55e';
    document.getElementById('penduMsg').textContent = '🎉 Bravo ! +10 pts — Nouveau mot dans 2s…';
    setTimeout(newPendu, 2000);
  } else if (!penduState.over && wrong >= 6) {
    penduState.over = true;
    document.getElementById('penduMsg').style.color = '#ef4444';
    document.getElementById('penduMsg').textContent = '💀 Perdu ! Le mot était : ' + word.toUpperCase();
  }
}

function guessPendu(l) {
  if (penduState.over || penduState.guessed.includes(l)) return;
  penduState.guessed.push(l);
  if (!penduState.word.includes(l)) penduState.wrong++;
  renderPendu();
}
