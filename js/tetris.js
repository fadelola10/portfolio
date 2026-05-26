// ── TETRIS ────────────────────────────────────────────────────
let tetrisTimer = null;

const PIECES = [
  { s: [[1,1,1,1]],           c: '#00d4ff' },
  { s: [[1,1],[1,1]],         c: '#fbbf24' },
  { s: [[1,1,1],[0,1,0]],     c: '#a78bfa' },
  { s: [[1,1,1],[1,0,0]],     c: '#f97316' },
  { s: [[1,1,1],[0,0,1]],     c: '#38bdf8' },
  { s: [[1,1,0],[0,1,1]],     c: '#22c55e' },
  { s: [[0,1,1],[1,1,0]],     c: '#ef4444' },
];

function startTetris() {
  if (tetrisTimer) { clearInterval(tetrisTimer); tetrisTimer = null; }
  const cv  = document.getElementById('cvTetris'),  ctx  = cv.getContext('2d');
  const nc  = document.getElementById('cvNext'),    nctx = nc.getContext('2d');
  const COLS = 10, ROWS = 20, S = 20;
  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  let score = 0, lines = 0;

  function rp() {
    const p = PIECES[Math.floor(Math.random() * PIECES.length)];
    return { s: p.s.map(r => [...r]), c: p.c, x: 3, y: 0 };
  }
  let cur = rp(), nxt = rp();

  function valid(p, dx = 0, dy = 0, sh = null) {
    return (sh || p.s).every((row, r) =>
      row.every((v, c) =>
        !v || (
          (p.x + c + dx) >= 0 &&
          (p.x + c + dx) < COLS &&
          (p.y + r + dy) < ROWS &&
          !(board[p.y + r + dy] || [])[p.x + c + dx]
        )
      )
    );
  }

  function rot(s) { return s[0].map((_, i) => s.map(r => r[i]).reverse()); }

  function place() {
    cur.s.forEach((row, r) => row.forEach((v, c) => { if (v) board[cur.y+r][cur.x+c] = cur.c; }));
    const cl = board.filter(r => r.every(c => c)).length;
    lines += cl; score += cl * 100;
    document.getElementById('tScore').textContent = score;
    document.getElementById('tLines').textContent = lines;
    board = board.filter(r => !r.every(c => c));
    while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
    cur = nxt; nxt = rp();
    if (!valid(cur)) {
      clearInterval(tetrisTimer); tetrisTimer = null;
      ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 16px IBM Plex Mono'; ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', cv.width/2, cv.height/2 - 10);
      ctx.fillStyle = '#94a3b8'; ctx.font = '12px IBM Plex Mono';
      ctx.fillText('Score: ' + score, cv.width/2, cv.height/2 + 12);
    }
  }

  function drawAll() {
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgba(255,255,255,.04)';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ctx.strokeRect(c*S, r*S, S, S);
    board.forEach((row, r) => row.forEach((v, c) => { if (v) { ctx.fillStyle = v; ctx.fillRect(c*S+1, r*S+1, S-2, S-2); } }));
    // ghost
    let gy = cur.y; while (valid(cur, 0, gy - cur.y + 1)) gy++;
    cur.s.forEach((row, r) => row.forEach((v, c) => { if (v) { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect((cur.x+c)*S+1, (gy+r)*S+1, S-2, S-2); } }));
    // current
    cur.s.forEach((row, r) => row.forEach((v, c) => { if (v) { ctx.fillStyle = cur.c; ctx.fillRect((cur.x+c)*S+1, (cur.y+r)*S+1, S-2, S-2); } }));
    // next preview
    nctx.fillStyle = '#060f1e'; nctx.fillRect(0, 0, 80, 80);
    const ns = 14;
    const ox = Math.floor((4 - nxt.s[0].length) / 2) * ns + 4;
    const oy = Math.floor((4 - nxt.s.length)    / 2) * ns + 4;
    nxt.s.forEach((row, r) => row.forEach((v, c) => { if (v) { nctx.fillStyle = nxt.c; nctx.fillRect(ox+c*ns+1, oy+r*ns+1, ns-2, ns-2); } }));
  }

  function step() { if (valid(cur, 0, 1)) cur.y++; else place(); drawAll(); }
  drawAll();
  tetrisTimer = setInterval(step, 480);

  document.onkeydown = e => {
    if (!tetrisTimer) return;
    if (e.key === 'ArrowLeft'  && valid(cur, -1, 0)) cur.x--;
    if (e.key === 'ArrowRight' && valid(cur,  1, 0)) cur.x++;
    if (e.key === 'ArrowDown'  && valid(cur,  0, 1)) cur.y++;
    if (e.key === 'ArrowUp')  { const r = rot(cur.s); if (valid(cur, 0, 0, r)) cur.s = r; }
    if (e.key === ' ')        { while (valid(cur, 0, 1)) cur.y++; place(); }
    drawAll();
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  };
}
