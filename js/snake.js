// ── SNAKE ─────────────────────────────────────────────────────
let snakeTimer = null;

function startSnake() {
  if (snakeTimer) { clearInterval(snakeTimer); snakeTimer = null; }
  const cv  = document.getElementById('cvSnake');
  const ctx = cv.getContext('2d');
  const COLS = 20, ROWS = 20, S = cv.width / COLS;
  let snake = [{ x: 10, y: 10 }];
  let dir = { x: 1, y: 0 }, next = { x: 1, y: 0 };
  let food = rFood(), score = 0;
  let best = parseInt(localStorage.getItem('snkBest') || 0);
  document.getElementById('sScore').textContent = 0;
  document.getElementById('sBest').textContent  = best;

  function rFood() {
    let f;
    do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (snake.some(s => s.x === f.x && s.y === f.y));
    return f;
  }

  function draw() {
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgba(255,255,255,.04)';
    for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i*S, 0); ctx.lineTo(i*S, cv.height); ctx.stroke(); }
    for (let i = 0; i <= ROWS; i++) { ctx.beginPath(); ctx.moveTo(0, i*S); ctx.lineTo(cv.width, i*S); ctx.stroke(); }
    // food
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(food.x*S + S/2, food.y*S + S/2, S/2 - 3, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#00d4ff' : `hsl(${195 + i*2}, 80%, ${60 - i*0.5}%)`;
      ctx.beginPath(); ctx.roundRect(s.x*S+1, s.y*S+1, S-2, S-2, 3); ctx.fill();
    });
  }

  function step() {
    dir = { ...next };
    const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (h.x < 0 || h.x >= COLS || h.y < 0 || h.y >= ROWS || snake.some(s => s.x === h.x && s.y === h.y)) {
      clearInterval(snakeTimer); snakeTimer = null;
      if (score > best) { best = score; localStorage.setItem('snkBest', best); document.getElementById('sBest').textContent = best; }
      ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 22px IBM Plex Mono'; ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', cv.width/2, cv.height/2 - 12);
      ctx.fillStyle = '#94a3b8'; ctx.font = '14px IBM Plex Mono';
      ctx.fillText('Score: ' + score + ' · Appuyez Start', cv.width/2, cv.height/2 + 16);
      return;
    }
    snake.unshift(h);
    if (h.x === food.x && h.y === food.y) { score++; document.getElementById('sScore').textContent = score; food = rFood(); }
    else snake.pop();
    draw();
  }

  draw();
  snakeTimer = setInterval(step, 120);

  document.onkeydown = e => {
    if (!snakeTimer) return;
    if (e.key === 'ArrowUp'    && dir.y !==  1) next = { x: 0, y: -1 };
    if (e.key === 'ArrowDown'  && dir.y !== -1) next = { x: 0, y:  1 };
    if (e.key === 'ArrowLeft'  && dir.x !==  1) next = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && dir.x !== -1) next = { x:  1, y: 0 };
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
  };

  let tx = 0, ty = 0;
  cv.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  cv.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dir.x !== -1) next = { x: 1, y: 0 };
      else if (dir.x !== 1)       next = { x: -1, y: 0 };
    } else {
      if (dy > 0 && dir.y !== -1) next = { x: 0, y: 1 };
      else if (dir.y !== 1)       next = { x: 0, y: -1 };
    }
  }, { passive: true });
}
