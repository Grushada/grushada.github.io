// ============================================================
// ФАЗА 4 — АРКАДЫ
// Змейка, Тетрис, Пинг-понг, Memory, Тир, Эмодзи-фильм
// ============================================================

(function() {
'use strict';

function addTab(id, label, emoji) {
    const tabs = document.querySelector('.tabs');
    if (!tabs || document.getElementById('tab-' + id)) return;
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.tab = id;
    btn.innerHTML = emoji + ' ' + label;
    btn.onclick = () => switchTab(id);
    tabs.appendChild(btn);

    const content = document.createElement('div');
    content.className = 'tab-content';
    content.id = 'tab-' + id;
    document.querySelector('.container').insertBefore(content, document.querySelector('.history-section'));
}

addTab('arcade', 'Аркады', '🕹️');
const arcadeTab = document.getElementById('tab-arcade');

const style = document.createElement('style');
style.textContent = `
.arcade-canvas{display:block;margin:0 auto;background:rgba(12,12,28,0.9);border-radius:14px;border:2px solid rgba(139,92,246,0.3);max-width:100%;height:auto;touch-action:none}
.arcade-controls{display:grid;gap:6px;justify-content:center;margin-top:12px}
.arcade-btn{padding:14px 20px;border-radius:14px;border:2px solid rgba(139,92,246,0.3);background:rgba(255,255,255,0.03);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:1rem;cursor:pointer;transition:all 0.15s;user-select:none;touch-action:manipulation;min-width:50px}
.arcade-btn:hover{background:rgba(139,92,246,0.2);border-color:var(--gold-light)}
.arcade-btn:active{transform:scale(0.95);background:rgba(240,208,120,0.25)}
.arcade-info{display:flex;justify-content:space-around;margin:10px 0;font-family:'Unbounded',sans-serif;font-size:0.85rem;color:var(--text-dim);flex-wrap:wrap;gap:10px;text-align:center}
.arcade-info strong{color:var(--gold-light);font-size:1.05rem}
.mem-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:360px;margin:14px auto}
.mem-card{aspect-ratio:1;border-radius:12px;background:linear-gradient(135deg,#8b5cf6,#5b21b6);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.8rem;user-select:none;transition:all 0.3s;border:2px solid rgba(255,255,255,0.1)}
.mem-card.flipped,.mem-card.matched{background:rgba(255,255,255,0.08);border-color:rgba(139,92,246,0.5)}
.mem-card.matched{border-color:var(--green);background:rgba(34,197,94,0.15);box-shadow:0 0 15px rgba(34,197,94,0.5)}
.tir-field{position:relative;width:100%;max-width:420px;height:320px;margin:14px auto;background:radial-gradient(circle at center,rgba(139,92,246,0.15),rgba(6,6,16,0.95));border-radius:14px;border:2px solid rgba(139,92,246,0.3);overflow:hidden;cursor:crosshair}
.tir-target{position:absolute;font-size:2.4rem;cursor:pointer;animation:tirSpawn 0.25s ease;user-select:none;line-height:1;transition:transform 0.1s}
.tir-target:hover{transform:scale(1.15)}
.tir-target:active{transform:scale(0.85)}
@keyframes tirSpawn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.emoji-movie{text-align:center;padding:14px}
.movie-emojis{font-size:3rem;letter-spacing:8px;margin:20px 0;line-height:1.3;word-break:break-all}
.movie-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:420px;margin:0 auto}
.movie-opt{padding:12px 14px;border-radius:12px;border:2px solid rgba(139,92,246,0.3);background:rgba(255,255,255,0.02);color:#fff;font-family:inherit;font-weight:600;font-size:0.85rem;cursor:pointer;transition:all 0.2s;text-align:center}
.movie-opt:hover{border-color:var(--gold-light);background:rgba(139,92,246,0.15)}
.movie-opt.correct{border-color:var(--green);background:rgba(34,197,94,0.2);color:#4ade80}
.movie-opt.wrong{border-color:var(--red);background:rgba(239,68,68,0.15);color:#f87171}
@media (max-width:420px){
  .arcade-controls{gap:5px}
  .arcade-btn{padding:11px 12px;font-size:0.85rem;min-width:44px}
  .mem-grid{gap:6px}
  .mem-card{font-size:1.5rem}
  .movie-emojis{font-size:2.2rem;letter-spacing:5px}
  .movie-opt{font-size:0.75rem;padding:10px}
}
`;
document.head.appendChild(style);

arcadeTab.innerHTML = `
<div class="game-card">
    <div class="game-title">🐍 Змейка</div>
    <div class="game-desc">Собирай яблоки, расти. За каждое яблоко +3 💎 при проигрыше</div>
    <div class="arcade-info">
        <span>Длина: <strong id="snakeLen">3</strong></span>
        <span>Съедено: <strong id="snakeScore">0</strong></span>
    </div>
    <canvas id="snakeCanvas" class="arcade-canvas" width="400" height="400" style="max-width:400px"></canvas>
    <div class="arcade-controls" style="grid-template-columns:repeat(3,60px);grid-template-rows:repeat(2,50px)">
        <div></div>
        <button class="arcade-btn" data-snake="up">⬆️</button>
        <div></div>
        <button class="arcade-btn" data-snake="left">⬅️</button>
        <button class="arcade-btn" data-snake="down">⬇️</button>
        <button class="arcade-btn" data-snake="right">➡️</button>
    </div>
    <div class="ms-actions" style="margin-top:12px;max-width:400px;margin-left:auto;margin-right:auto">
        <button class="btn-action gold" id="snakeStartBtn">▶️ Старт</button>
    </div>
    <div class="result" id="snakeResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🟦 Тетрис</div>
    <div class="game-desc">Собирай линии. За каждую линию +5 💎</div>
    <div class="arcade-info">
        <span>Линий: <strong id="tetrisLines">0</strong></span>
        <span>Очки: <strong id="tetrisScore">0</strong></span>
    </div>
    <canvas id="tetrisCanvas" class="arcade-canvas" width="200" height="400" style="max-width:200px"></canvas>
    <div class="arcade-controls" style="grid-template-columns:repeat(4,56px);grid-template-rows:50px">
        <button class="arcade-btn" data-tetris="left">⬅️</button>
        <button class="arcade-btn" data-tetris="rotate">🔄</button>
        <button class="arcade-btn" data-tetris="right">➡️</button>
        <button class="arcade-btn" data-tetris="drop">⬇️</button>
    </div>
    <div class="ms-actions" style="margin-top:12px;max-width:240px;margin-left:auto;margin-right:auto">
        <button class="btn-action gold" id="tetrisStartBtn">▶️ Старт</button>
    </div>
    <div class="result" id="tetrisResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🏓 Пинг-понг</div>
    <div class="game-desc">Первый до 5 очков. Победа = +100 💎</div>
    <div class="arcade-info">
        <span>Ты: <strong id="pongYou">0</strong></span>
        <span>Бот: <strong id="pongBot">0</strong></span>
    </div>
    <canvas id="pongCanvas" class="arcade-canvas" width="400" height="320" style="max-width:400px"></canvas>
    <div class="arcade-controls" style="grid-template-columns:repeat(3,80px);grid-template-rows:50px">
        <button class="arcade-btn" data-pong="left">⬅️</button>
        <button class="arcade-btn" data-pong="pause">⏸️</button>
        <button class="arcade-btn" data-pong="right">➡️</button>
    </div>
    <div class="ms-actions" style="margin-top:12px;max-width:400px;margin-left:auto;margin-right:auto">
        <button class="btn-action gold" id="pongStartBtn">▶️ Старт</button>
    </div>
    <div class="result" id="pongResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🃏 Memory (пары)</div>
    <div class="game-desc">Найди все пары за минимум ходов. +20 ÷ +200 💎</div>
    <div class="arcade-info">
        <span>Ходов: <strong id="memMoves">0</strong></span>
        <span>Найдено: <strong id="memFound">0</strong>/8</span>
    </div>
    <div id="memGrid" class="mem-grid"></div>
    <div class="ms-actions" style="max-width:360px;margin:12px auto 0">
        <button class="btn-action gold" id="memNewBtn">🔄 Новая</button>
    </div>
    <div class="result" id="memResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🎯 Тир</div>
    <div class="game-desc">Кликай по мишеням за 30 секунд. +2 💎 за попадание</div>
    <div class="arcade-info">
        <span>Время: <strong id="tirTime">30</strong> сек</span>
        <span>Попаданий: <strong id="tirScore">0</strong></span>
    </div>
    <div class="tir-field" id="tirField"></div>
    <div class="ms-actions" style="max-width:420px;margin:12px auto 0">
        <button class="btn-action gold" id="tirStartBtn">▶️ Старт</button>
    </div>
    <div class="result" id="tirResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🎬 Угадай фильм по эмодзи</div>
    <div class="game-desc">+30 💎 за правильный ответ</div>
    <div id="emojiMovieContainer"></div>
    <div class="ms-actions" style="max-width:420px;margin:12px auto 0">
        <button class="btn-action gold" id="movieNextBtn">🎲 Следующий</button>
    </div>
    <div class="result" id="movieResult"></div>
</div>
`;

// ============================================================
// ЗМЕЙКА
// ============================================================
let snakeInterval = null;
let snakeDir = {x:1, y:0};
let snakeNextDir = {x:1, y:0};
let snakeAlive = false;

function snakeStart() {
    if (snakeAlive) return;
    if (!checkActiveGame()) return;
    setActiveGame('snake');
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const cell = 20;
    const gridSize = 20;
    let snake = [{x:10, y:10}, {x:9, y:10}, {x:8, y:10}];
    snakeDir = {x:1, y:0};
    snakeNextDir = {x:1, y:0};
    let apple = {x:15, y:10};
    let score = 0;
    snakeAlive = true;

    document.getElementById('snakeStartBtn').disabled = true;
    document.getElementById('snakeResult').classList.remove('show');
    document.getElementById('snakeScore').textContent = '0';
    document.getElementById('snakeLen').textContent = '3';

    function placeApple() {
        let tries = 0;
        do {
            apple = {x: Math.floor(Math.random()*gridSize), y: Math.floor(Math.random()*gridSize)};
            tries++;
        } while (snake.some(s => s.x === apple.x && s.y === apple.y) && tries < 200);
    }

    function draw() {
        ctx.fillStyle = '#0a0a20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(139,92,246,0.08)';
        for (let i = 0; i <= gridSize; i++) {
            ctx.beginPath(); ctx.moveTo(i*cell, 0); ctx.lineTo(i*cell, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i*cell); ctx.lineTo(canvas.width, i*cell); ctx.stroke();
        }
        // Apple
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(apple.x*cell + cell/2, apple.y*cell + cell/2, cell/2 - 2, 0, Math.PI*2);
        ctx.fill();
        // Snake
        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? '#f0d078' : '#8b5cf6';
            ctx.fillRect(s.x*cell + 1, s.y*cell + 1, cell - 2, cell - 2);
        });
    }

    function tick() {
        if (!snakeAlive) return;
        snakeDir = snakeNextDir;
        const head = {x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y};
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) { gameOver(); return; }
        if (snake.some(s => s.x === head.x && s.y === head.y)) { gameOver(); return; }
        snake.unshift(head);
        if (head.x === apple.x && head.y === apple.y) {
            score++;
            document.getElementById('snakeScore').textContent = score;
            document.getElementById('snakeLen').textContent = snake.length;
            sTick();
            placeApple();
        } else { snake.pop(); }
        draw();
    }

    function gameOver() {
        snakeAlive = false;
        clearInterval(snakeInterval);
        snakeInterval = null;
        const reward = score * 3;
        if (reward > 0) { state.balance += reward; sWin(); } else { sLose(); }
        saveState(); updateUI(); checkAchievements();
        const el = document.getElementById('snakeResult');
        el.textContent = `💀 Игра окончена! Съедено яблок: ${score}${reward > 0 ? ` (+${reward} 💎)` : ''}`;
        el.className = 'result show ' + (reward > 0 ? 'win' : 'lose');
        document.getElementById('snakeStartBtn').disabled = false;
        document.getElementById('snakeStartBtn').textContent = '▶️ Ещё раз';
        clearActiveGame();
    }

    placeApple();
    draw();
    snakeInterval = setInterval(tick, 150);
}

function snakeSetDir(d) {
    const dirs = {up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0}};
    const nd = dirs[d];
    if (!nd) return;
    if (nd.x === -snakeDir.x && nd.y === -snakeDir.y) return;
    snakeNextDir = nd;
}

document.getElementById('snakeStartBtn').addEventListener('click', snakeStart);
document.querySelectorAll('[data-snake]').forEach(b => {
    b.addEventListener('click', () => snakeSetDir(b.dataset.snake));
});
document.addEventListener('keydown', e => {
    if (!document.getElementById('tab-arcade').classList.contains('active') || !snakeAlive) return;
    const map = {ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right',
                 'ц':'up','ы':'down','ф':'left','в':'right',
                 'w':'up','s':'down','a':'left','d':'right'};
    const k = map[e.key] || map[e.key.toLowerCase()];
    if (k) { e.preventDefault(); snakeSetDir(k); }
});

// ============================================================
// ТЕТРИС
// ============================================================
let tetrisInterval = null;
let tetrisBoard = [];
let tetrisPiece = null;
let tetrisRunning = false;
let tetrisScore = 0;
let tetrisLines = 0;
const TETRIS_W = 10, TETRIS_H = 20;
const TETRIS_CELL = 20;

const TETRIS_SHAPES = [
    {shape:[[1,1,1,1]], color:'#00d4ff'},
    {shape:[[1,1],[1,1]], color:'#f0d078'},
    {shape:[[0,1,0],[1,1,1]], color:'#a855f7'},
    {shape:[[0,1,1],[1,1,0]], color:'#22c55e'},
    {shape:[[1,1,0],[0,1,1]], color:'#ef4444'},
    {shape:[[1,0,0],[1,1,1]], color:'#3b82f6'},
    {shape:[[0,0,1],[1,1,1]], color:'#f59e0b'}
];

function tetrisStart() {
    if (tetrisRunning) return;
    if (!checkActiveGame()) return;
    setActiveGame('tetris');
    tetrisBoard = Array.from({length:TETRIS_H}, () => Array(TETRIS_W).fill(0));
    tetrisScore = 0; tetrisLines = 0;
    tetrisRunning = true;
    document.getElementById('tetrisLines').textContent = '0';
    document.getElementById('tetrisScore').textContent = '0';
    document.getElementById('tetrisStartBtn').disabled = true;
    document.getElementById('tetrisResult').classList.remove('show');
    tetrisSpawn();
    tetrisDraw();
    if (tetrisInterval) clearInterval(tetrisInterval);
    tetrisInterval = setInterval(tetrisTick, 600);
}

function tetrisSpawn() {
    const t = TETRIS_SHAPES[Math.floor(Math.random()*TETRIS_SHAPES.length)];
    tetrisPiece = {
        shape: t.shape.map(r => [...r]),
        color: t.color,
        x: Math.floor((TETRIS_W - t.shape[0].length) / 2),
        y: 0
    };
    if (tetrisCollide(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y)) {
        tetrisEnd();
    }
}

function tetrisCollide(shape, ox, oy) {
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;
            const x = ox + c, y = oy + r;
            if (x < 0 || x >= TETRIS_W || y >= TETRIS_H) return true;
            if (y >= 0 && tetrisBoard[y][x]) return true;
        }
    return false;
}

function tetrisLock() {
    tetrisPiece.shape.forEach((row, r) => {
        row.forEach((v, c) => {
            if (v) {
                const y = tetrisPiece.y + r, x = tetrisPiece.x + c;
                if (y >= 0) tetrisBoard[y][x] = tetrisPiece.color;
            }
        });
    });
    // Проверка линий
    let cleared = 0;
    for (let r = TETRIS_H - 1; r >= 0; r--) {
        if (tetrisBoard[r].every(v => v)) {
            tetrisBoard.splice(r, 1);
            tetrisBoard.unshift(Array(TETRIS_W).fill(0));
            cleared++; r++;
        }
    }
    if (cleared > 0) {
        tetrisLines += cleared;
        tetrisScore += cleared * 5;
        document.getElementById('tetrisLines').textContent = tetrisLines;
        document.getElementById('tetrisScore').textContent = tetrisScore;
        sWin();
    } else { sClick(); }
    tetrisSpawn();
}

function tetrisTick() {
    if (!tetrisRunning || !tetrisPiece) return;
    if (tetrisCollide(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y + 1)) {
        tetrisLock();
    } else {
        tetrisPiece.y++;
    }
    tetrisDraw();
}

function tetrisDraw() {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a20';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Grid
    ctx.strokeStyle = 'rgba(139,92,246,0.1)';
    for (let i = 0; i <= TETRIS_W; i++) {
        ctx.beginPath(); ctx.moveTo(i*TETRIS_CELL, 0); ctx.lineTo(i*TETRIS_CELL, canvas.height); ctx.stroke();
    }
    for (let i = 0; i <= TETRIS_H; i++) {
        ctx.beginPath(); ctx.moveTo(0, i*TETRIS_CELL); ctx.lineTo(canvas.width, i*TETRIS_CELL); ctx.stroke();
    }
    // Board
    tetrisBoard.forEach((row, r) => {
        row.forEach((v, c) => {
            if (v) {
                ctx.fillStyle = v;
                ctx.fillRect(c*TETRIS_CELL + 1, r*TETRIS_CELL + 1, TETRIS_CELL - 2, TETRIS_CELL - 2);
            }
        });
    });
    // Piece
    if (tetrisPiece) {
        ctx.fillStyle = tetrisPiece.color;
        tetrisPiece.shape.forEach((row, r) => {
            row.forEach((v, c) => {
                if (v) {
                    const x = tetrisPiece.x + c, y = tetrisPiece.y + r;
                    ctx.fillRect(x*TETRIS_CELL + 1, y*TETRIS_CELL + 1, TETRIS_CELL - 2, TETRIS_CELL - 2);
                }
            });
        });
    }
}

function tetrisMove(dx, dy) {
    if (!tetrisRunning || !tetrisPiece) return;
    if (!tetrisCollide(tetrisPiece.shape, tetrisPiece.x + dx, tetrisPiece.y + dy)) {
        tetrisPiece.x += dx;
        tetrisPiece.y += dy;
        tetrisDraw();
        sClick();
    }
}

function tetrisRotate() {
    if (!tetrisRunning || !tetrisPiece) return;
    const old = tetrisPiece.shape;
    const rotated = old[0].map((_, i) => old.map(row => row[i]).reverse());
    if (!tetrisCollide(rotated, tetrisPiece.x, tetrisPiece.y)) {
        tetrisPiece.shape = rotated;
        tetrisDraw();
        sClick();
    }
}

function tetrisEnd() {
    tetrisRunning = false;
    clearInterval(tetrisInterval);
    tetrisInterval = null;
    const reward = tetrisScore * 3;
    if (reward > 0) { state.balance += reward; sWin(); } else { sLose(); }
    saveState(); updateUI(); checkAchievements();
    const el = document.getElementById('tetrisResult');
    el.textContent = `💀 Игра окончена! Линий: ${tetrisLines}, очков: ${tetrisScore}${reward > 0 ? ` (+${reward} 💎)` : ''}`;
    el.className = 'result show ' + (reward > 0 ? 'win' : 'lose');
    document.getElementById('tetrisStartBtn').disabled = false;
    document.getElementById('tetrisStartBtn').textContent = '▶️ Ещё раз';
    clearActiveGame();
}

document.getElementById('tetrisStartBtn').addEventListener('click', tetrisStart);
document.querySelectorAll('[data-tetris]').forEach(b => {
    b.addEventListener('click', () => {
        const a = b.dataset.tetris;
        if (a === 'left') tetrisMove(-1, 0);
        else if (a === 'right') tetrisMove(1, 0);
        else if (a === 'drop') { while (!tetrisCollide(tetrisPiece.shape, tetrisPiece.x, tetrisPiece.y + 1)) tetrisPiece.y++; tetrisDraw(); }
        else if (a === 'rotate') tetrisRotate();
    });
});
document.addEventListener('keydown', e => {
    if (!document.getElementById('tab-arcade').classList.contains('active') || !tetrisRunning) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); tetrisMove(-1, 0); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); tetrisMove(1, 0); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); tetrisMove(0, 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); tetrisRotate(); }
});

// ============================================================
// ПИНГ-ПОНГ
// ============================================================
let pongRunning = false;
let pongRAF = null;
let pongState = null;

function pongStart() {
    if (pongRunning) return;
    if (!checkActiveGame()) return;
    setActiveGame('pong');
    const canvas = document.getElementById('pongCanvas');
    pongState = {
        playerX: 170, playerW: 60, playerY: 300, playerH: 10,
        ball: {x: 200, y: 160, vx: 3, vy: 3, r: 6},
        botX: 170, botW: 60, botY: 10, botH: 10,
        you: 0, bot: 0
    };
    pongRunning = true;
    document.getElementById('pongStartBtn').disabled = true;
    document.getElementById('pongResult').classList.remove('show');
    document.getElementById('pongYou').textContent = '0';
    document.getElementById('pongBot').textContent = '0';
    pongLoop();
}

function pongLoop() {
    if (!pongRunning) return;
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const s = pongState;

    // Physics
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Wall bounce
    if (s.ball.x - s.ball.r < 0 || s.ball.x + s.ball.r > canvas.width) { s.ball.vx *= -1; sClick(); }
    if (s.ball.y - s.ball.r < 0) {
        if (s.ball.x >= s.botX && s.ball.x <= s.botX + s.botW) {
            s.ball.vy = Math.abs(s.ball.vy);
            s.ball.vx += (Math.random() - 0.5) * 2;
            sClick();
        } else { s.bot++; scoreUpdate(); }
    }
    if (s.ball.y + s.ball.r > canvas.height) {
        if (s.ball.x >= s.playerX && s.ball.x <= s.playerX + s.playerW) {
            s.ball.vy = -Math.abs(s.ball.vy);
            s.ball.vx += (Math.random() - 0.5) * 2;
            sClick();
        } else { s.you++; scoreUpdate(); }
    }

    // Bot AI
    const targetX = s.ball.x - s.botW / 2 + (Math.random() - 0.5) * 30;
    s.botX += Math.max(-3, Math.min(3, targetX - s.botX));
    s.botX = Math.max(0, Math.min(canvas.width - s.botW, s.botX));

    // Draw
    ctx.fillStyle = '#0a0a20';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(139,92,246,0.2)';
    ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(0, canvas.height/2); ctx.lineTo(canvas.width, canvas.height/2); ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle
    ctx.fillStyle = '#f0d078';
    ctx.fillRect(s.playerX, s.playerY, s.playerW, s.playerH);
    // Bot paddle
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(s.botX, s.botY, s.botW, s.botH);
    // Ball
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, s.ball.r, 0, Math.PI*2);
    ctx.fill();

    // Score
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Unbounded, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.you, canvas.width/2 - 40, canvas.height/2 - 10);
    ctx.fillText(s.bot, canvas.width/2 + 40, canvas.height/2 - 10);

    // Check win
    if (s.you >= 5 || s.bot >= 5) {
        pongEnd(s.you >= 5);
        return;
    }

    pongRAF = requestAnimationFrame(pongLoop);
}

function scoreUpdate() {
    document.getElementById('pongYou').textContent = pongState.you;
    document.getElementById('pongBot').textContent = pongState.bot;
    // Reset ball
    pongState.ball.x = 200;
    pongState.ball.y = 160;
    pongState.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
    pongState.ball.vy = (Math.random() > 0.5 ? 1 : -1) * 3;
    sLose();
}

function pongEnd(win) {
    pongRunning = false;
    if (pongRAF) cancelAnimationFrame(pongRAF);
    pongRAF = null;
    if (win) { state.balance += 100; sWin(); }
    else { sLose(); }
    saveState(); updateUI(); checkAchievements();
    const el = document.getElementById('pongResult');
    el.textContent = win ? `🎉 Победа ${pongState.you}:${pongState.bot}! +100 💎` : `💀 Проигрыш ${pongState.you}:${pongState.bot}`;
    el.className = 'result show ' + (win ? 'win' : 'lose');
    document.getElementById('pongStartBtn').disabled = false;
    document.getElementById('pongStartBtn').textContent = '▶️ Ещё раз';
    clearActiveGame();
}

document.getElementById('pongStartBtn').addEventListener('click', pongStart);
document.querySelectorAll('[data-pong]').forEach(b => {
    b.addEventListener('click', () => {
        if (!pongRunning || !pongState) return;
        const a = b.dataset.pong;
        if (a === 'left') pongState.playerX = Math.max(0, pongState.playerX - 30);
        else if (a === 'right') pongState.playerX = Math.min(400 - pongState.playerW, pongState.playerX + 30);
        else if (a === 'pause') {
            if (pongRunning) { pongRunning = false; if (pongRAF) cancelAnimationFrame(pongRAF); pongRAF = null; b.textContent = '▶️'; }
            else { pongRunning = true; b.textContent = '⏸️'; pongLoop(); }
        }
        sClick();
    });
});
document.addEventListener('keydown', e => {
    if (!document.getElementById('tab-arcade').classList.contains('active') || !pongRunning) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); pongState.playerX = Math.max(0, pongState.playerX - 20); }
    if (e.key === 'ArrowRight') { e.preventDefault(); pongState.playerX = Math.min(400 - pongState.playerW, pongState.playerX + 20); }
});

// ============================================================
// MEMORY
// ============================================================
const MEM_EMOJIS = ['🐶','🐱','🐼','🦁','🐸','🐷','🦊','🐰'];
let memState = {cards: [], flipped: [], matched: 0, moves: 0, lock: false, playing: false};

function memNew() {
    if (memState.lock) return;
    const emojis = [...MEM_EMOJIS, ...MEM_EMOJIS].sort(() => Math.random() - 0.5);
    memState = {cards: emojis, flipped: [], matched: 0, moves: 0, lock: false, playing: true};
    document.getElementById('memMoves').textContent = '0';
    document.getElementById('memFound').textContent = '0';
    document.getElementById('memResult').classList.remove('show');
    const grid = document.getElementById('memGrid');
    grid.innerHTML = emojis.map((e, i) =>
        `<div class="mem-card" data-idx="${i}" data-emoji="${e}"><span style="display:none">${e}</span></div>`
    ).join('');
    grid.querySelectorAll('.mem-card').forEach(c => c.addEventListener('click', () => memFlip(parseInt(c.dataset.idx))));
    sClick();
}

function memFlip(idx) {
    if (!memState.playing || memState.lock) return;
    const card = document.querySelector(`.mem-card[data-idx="${idx}"]`);
    if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    card.querySelector('span').style.display = 'inline';
    memState.flipped.push(idx);
    sClick();

    if (memState.flipped.length === 2) {
        memState.moves++;
        document.getElementById('memMoves').textContent = memState.moves;
        memState.lock = true;
        const [a, b] = memState.flipped;
        const ca = document.querySelector(`.mem-card[data-idx="${a}"]`);
        const cb = document.querySelector(`.mem-card[data-idx="${b}"]`);
        if (ca.dataset.emoji === cb.dataset.emoji) {
            setTimeout(() => {
                ca.classList.add('matched');
                cb.classList.add('matched');
                memState.matched++;
                document.getElementById('memFound').textContent = memState.matched;
                sWin();
                memState.flipped = [];
                memState.lock = false;
                if (memState.matched >= 8) memWin();
            }, 400);
        } else {
            setTimeout(() => {
                ca.classList.remove('flipped');
                cb.classList.remove('flipped');
                ca.querySelector('span').style.display = 'none';
                cb.querySelector('span').style.display = 'none';
                memState.flipped = [];
                memState.lock = false;
                sLose();
            }, 800);
        }
    }
}

function memWin() {
    memState.playing = false;
    let reward = 0;
    if (memState.moves <= 12) reward = 200;
    else if (memState.moves <= 18) reward = 100;
    else if (memState.moves <= 25) reward = 50;
    else reward = 20;
    state.balance += reward;
    sWin();
    saveState(); updateUI(); checkAchievements();
    const el = document.getElementById('memResult');
    el.textContent = `🎉 Победа за ${memState.moves} ходов! +${reward} 💎`;
    el.className = 'result show win';
    showToast(`🎉 +${reward} 💎!`, 'gold');
}

document.getElementById('memNewBtn').addEventListener('click', memNew);
memNew();

// ============================================================
// ТИР
// ============================================================
let tirTimer = null, tirSpawner = null, tirTime = 30, tirScore = 0, tirPlaying = false;

function tirStart() {
    if (tirPlaying) return;
    if (!checkActiveGame()) return;
    setActiveGame('tir');
    tirPlaying = true;
    tirTime = 30;
    tirScore = 0;
    document.getElementById('tirTime').textContent = '30';
    document.getElementById('tirScore').textContent = '0';
    document.getElementById('tirStartBtn').disabled = true;
    document.getElementById('tirResult').classList.remove('show');
    document.getElementById('tirField').innerHTML = '';

    tirTimer = setInterval(() => {
        tirTime--;
        document.getElementById('tirTime').textContent = tirTime;
        if (tirTime <= 0) tirEnd();
    }, 1000);

    tirSpawner = setInterval(tirSpawn, 700);
    tirSpawn();
}

function tirSpawn() {
    if (!tirPlaying) return;
    const field = document.getElementById('tirField');
    const target = document.createElement('div');
    target.className = 'tir-target';
    const size = field.offsetWidth;
    const height = field.offsetHeight;
    const x = Math.random() * (size - 50);
    const y = Math.random() * (height - 50);
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    const icons = ['🎯','🎪','⭐','🎈','💎','🔴','🟢'];
    target.textContent = icons[Math.floor(Math.random() * icons.length)];
    target.addEventListener('click', (e) => {
        e.stopPropagation();
        tirScore++;
        document.getElementById('tirScore').textContent = tirScore;
        sClick();
        target.remove();
    });
    field.appendChild(target);
    setTimeout(() => { if (target.parentNode) target.remove(); }, 1800);
}

function tirEnd() {
    tirPlaying = false;
    clearInterval(tirTimer);
    clearInterval(tirSpawner);
    tirTimer = null; tirSpawner = null;
    const reward = tirScore * 2;
    if (reward > 0) state.balance += reward;
    saveState(); updateUI(); checkAchievements();
    const el = document.getElementById('tirResult');
    el.textContent = `🎯 Время! Попаданий: ${tirScore}${reward > 0 ? ` (+${reward} 💎)` : ''}`;
    el.className = 'result show ' + (reward > 0 ? 'win' : 'lose');
    if (reward > 0) sWin(); else sLose();
    document.getElementById('tirStartBtn').disabled = false;
    document.getElementById('tirStartBtn').textContent = '▶️ Ещё раз';
    document.getElementById('tirField').innerHTML = '';
    clearActiveGame();
}

document.getElementById('tirStartBtn').addEventListener('click', tirStart);

// ============================================================
// ЭМОДЗИ-ФИЛЬМ
// ============================================================
const MOVIES = [
    {emojis:'🦁👑', answer:'Король Лев', options:['Король Лев','Мадагаскар','Зверополис','Кунг-фу Панда']},
    {emojis:'🚢❄️💑', answer:'Титаник', options:['Титаник','Ледокол','Океан','Пираты']},
    {emojis:'🕷️🦸‍♂️', answer:'Человек-паук', options:['Человек-паук','Бэтмен','Супермен','Халк']},
    {emojis:'🧙‍♂️💍🌋', answer:'Властелин колец', options:['Властелин колец','Хоббит','Гарри Поттер','Хроники Нарнии']},
    {emojis:'🦈🌊', answer:'Челюсти', options:['Челюсти','Глубокое синее море','Отмель','Мег']},
    {emojis:'👽🚀🌌', answer:'Звёздные войны', options:['Звёздные войны','Стартрек','Марсианин','Интерстеллар']},
    {emojis:'💊🕶️🟢', answer:'Матрица', options:['Матрица','Начало','Терминатор','Особое мнение']},
    {emojis:'🐉👸🏰', answer:'Шрек', options:['Шрек','Храбрая сердцем','Рапунцель','Холодное сердце']},
    {emojis:'❄️👸💙', answer:'Холодное сердце', options:['Холодное сердце','Моана','Рапунцель','Золушка']},
    {emojis:'🦖🏝️🚙', answer:'Парк Юрского периода', options:['Парк Юрского периода','Кинг Конг','Годзилла','Динотопия']},
    {emojis:'⚡👦🪄', answer:'Гарри Поттер', options:['Гарри Поттер','Перси Джексон','Мерлин','Хроники Нарнии']},
    {emojis:'🐟🐠🔍', answer:'В поисках Немо', options:['В поисках Немо','Подводная братва','Русалочка','Аквамен']},
    {emojis:'🤖💀🌆', answer:'Терминатор', options:['Терминатор','Я робот','Робокоп','Матрица']},
    {emojis:'👨‍🚀🌕🏠', answer:'Марсианин', options:['Марсианин','Гравитация','Интерстеллар','Аполлон 13']},
    {emojis:'🐼🥋', answer:'Кунг-фу Панда', options:['Кунг-фу Панда','Мулан','Крадущийся тигр','Убить Билла']}
];

let movieCurrent = null, movieAnswered = false;

function movieNext() {
    movieAnswered = false;
    movieCurrent = MOVIES[Math.floor(Math.random() * MOVIES.length)];
    const shuffled = [...movieCurrent.options].sort(() => Math.random() - 0.5);
    document.getElementById('emojiMovieContainer').innerHTML = `
        <div class="emoji-movie">
            <div class="movie-emojis">${movieCurrent.emojis}</div>
            <div class="movie-options">
                ${shuffled.map(o => `<button class="movie-opt" data-ans="${o}">${o}</button>`).join('')}
            </div>
        </div>
    `;
    document.querySelectorAll('.movie-opt').forEach(b => b.addEventListener('click', () => movieAnswer(b)));
    document.getElementById('movieResult').classList.remove('show');
}

function movieAnswer(btn) {
    if (movieAnswered) return;
    movieAnswered = true;
    const isCorrect = btn.dataset.ans === movieCurrent.answer;
    document.querySelectorAll('.movie-opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.ans === movieCurrent.answer) b.classList.add('correct');
        else if (b === btn && !isCorrect) b.classList.add('wrong');
    });
    if (isCorrect) {
        state.balance += 30;
        sWin();
        saveState(); updateUI(); checkAchievements();
        const el = document.getElementById('movieResult');
        el.textContent = `🎉 +30 💎!`;
        el.className = 'result show win';
        showToast('🎉 +30 💎!', 'green');
    } else {
        sLose();
        const el = document.getElementById('movieResult');
        el.textContent = `💀 Правильный ответ: ${movieCurrent.answer}`;
        el.className = 'result show lose';
    }
}

document.getElementById('movieNextBtn').addEventListener('click', movieNext);
movieNext();

})();
