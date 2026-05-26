// ── PONG ──────────────────────────────────────────────────────
let pongAF = null;

function startPong() {
  if (pongAF) { cancelAnimationFrame(pongAF); pongAF = null; }
  const cv  = document.getElementById('cvPong');
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height, PW = 10, PH = 64;
  let py = H/2 - PH/2, cy = H/2 - PH/2;
  let bx = W/2, by = H/2, spd = 5;
  let vx = spd, vy = spd * (Math.random() < .5 ? 1 : -1);
  let ps = 0, cs = 0;
  document.getElementById('pPlayer').textContent = 0;
  document.getElementById('pCPU').textContent    = 0;

  cv.addEventListener('mousemove', e => {
    const r = cv.getBoundingClientRect(), sc = cv.width / r.width;
    py = (e.clientY - r.top) * sc - PH / 2;
  });
  cv.addEventListener('touchmove', e => {
    const r = cv.getBoundingClientRect(), sc = cv.width / r.width;
    py = (e.touches[0].clientY - r.top) * sc - PH / 2;
    e.preventDefault();
  }, { passive: false });

  function draw() {
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);
    ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,255,255,.1)';
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
    ctx.setLineDash([]);
    // player paddle
    ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath(); ctx.roundRect(12, py, PW, PH, 4); ctx.fill();
    // cpu paddle
    ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444';
    ctx.beginPath(); ctx.roundRect(W - 22, cy, PW, PH, 4); ctx.fill();
    ctx.shadowBlur = 0;
    // ball
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    // scores
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.font = 'bold 48px IBM Plex Mono'; ctx.textAlign = 'center';
    ctx.fillText(ps, W/4, 54); ctx.fillText(cs, 3*W/4, 54);
  }

  function loop() {
    py = Math.max(0, Math.min(H - PH, py));
    cy += (by - cy - PH/2) * 0.09;
    cy = Math.max(0, Math.min(H - PH, cy));
    bx += vx; by += vy;
    if (by < 6)    { by = 6;    vy =  Math.abs(vy); }
    if (by > H - 6){ by = H-6;  vy = -Math.abs(vy); }
    // player hit
    if (bx < 22 + PW && bx > 12 && by > py && by < py + PH) {
      vx = Math.abs(vx) + 0.2; vy += (by - (py + PH/2)) * 0.08; bx = 22 + PW;
    }
    // cpu hit
    if (bx > W - 22 - PW && bx < W - 12 && by > cy && by < cy + PH) {
      vx = -(Math.abs(vx) + 0.2); vy += (by - (cy + PH/2)) * 0.08; bx = W - 22 - PW;
    }
    // score
    if (bx < 0) { cs++; document.getElementById('pCPU').textContent = cs;    bx=W/2; by=H/2; vx= spd; vy=spd*(Math.random()<.5?1:-1); }
    if (bx > W) { ps++; document.getElementById('pPlayer').textContent = ps;  bx=W/2; by=H/2; vx=-spd; vy=spd*(Math.random()<.5?1:-1); }
    draw();
    pongAF = requestAnimationFrame(loop);
  }
  draw(); pongAF = requestAnimationFrame(loop);
}
