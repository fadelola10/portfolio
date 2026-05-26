// ── NAVIGATION ────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'competences') setTimeout(animateBars, 200);
  if (id === 'accueil') setTimeout(animateStats, 300);
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});

// ── SCROLL BAR ────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const el = document.getElementById('scrollBar');
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  el.style.width = Math.min(pct, 100) + '%';
});

// ── THEME TOGGLE ──────────────────────────────────────────────
let dark = true;
function toggleTheme() {
  dark = !dark;
  if (!dark) {
    document.body.setAttribute('data-theme', 'light');
    document.getElementById('themeBtn').textContent = '🌙';
  } else {
    document.body.removeAttribute('data-theme');
    document.getElementById('themeBtn').textContent = '☀️';
  }
}

// ── TERMINAL TYPING ───────────────────────────────────────────
const lines = ['Sysadmin / DevOps Junior', 'Cloud · Réseau · Sécurité', 'Disponible en alternance 🚀'];
const comments = ['Administration Systèmes', 'Bachelor 3 – École PMN', 'Colombes (92)'];
let li = 0, ci = 0, typing = true;

function typeTerm() {
  const el  = document.getElementById('typed-text');
  const com = document.getElementById('term-comment');
  if (!el) return;
  if (typing) {
    if (ci < lines[li].length) {
      el.textContent = lines[li].substring(0, ++ci);
      setTimeout(typeTerm, 55);
    } else {
      typing = false;
      com.textContent = '# ' + comments[li];
      setTimeout(typeTerm, 1800);
    }
  } else {
    if (ci > 0) {
      el.textContent = lines[li].substring(0, --ci);
      setTimeout(typeTerm, 30);
    } else {
      typing = true;
      li = (li + 1) % lines.length;
      setTimeout(typeTerm, 400);
    }
  }
}
setTimeout(typeTerm, 800);

// ── STATS COUNTER ─────────────────────────────────────────────
function countUp(id, target, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  let v = 0;
  const step = Math.ceil(target / 30);
  const t = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = v + (suffix || '');
    if (v >= target) clearInterval(t);
  }, 40);
}
function animateStats() {
  countUp('s1', 6);
  countUp('s2', 30, '+');
  countUp('s3', 2,  '+');
  countUp('s4', 4);
}
setTimeout(animateStats, 300);

// ── PROGRESS BARS ─────────────────────────────────────────────
function animateBars() {
  document.querySelectorAll('.prog-fill').forEach(b => {
    b.style.width = b.dataset.w + '%';
  });
}

// ── CV DOWNLOAD (placeholder) ─────────────────────────────────
function downloadCV() {
  alert('Ajoutez votre CV en PDF dans le dossier assets/ sous le nom "cv.pdf" pour activer ce bouton !');
}
