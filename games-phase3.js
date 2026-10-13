// ============================================================
// ФАЗА 3 — ГОЛОВОЛОМКИ
// Судоку, 2048, Пятнашки, Ханойская башня, Wordle
// ============================================================

(function() {
'use strict';

// ---------- ДОБАВЛЯЕМ ВКЛАДКУ ----------
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

addTab('puzzles', 'Головоломки', '🧩');

const puzzlesTab = document.getElementById('tab-puzzles');

// ---------- СТИЛИ ----------
const style = document.createElement('style');
style.textContent = `
.sudoku-grid{display:grid;gap:4px;max-width:340px;margin:0 auto 14px;background:rgba(139,92,246,0.15);padding:8px;border-radius:14px}
.sudoku-cell{aspect-ratio:1;background:rgba(12,12,28,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:'Unbounded',sans-serif;font-weight:700;font-size:1.1rem;color:var(--text);user-select:none;transition:all 0.15s;position:relative}
.sudoku-cell.fixed{background:rgba(139,92,246,0.12);color:var(--gold-light);cursor:default}
.sudoku-cell.selected{background:rgba(240,208,120,0.25);border-color:var(--gold-light);box-shadow:0 0 12px rgba(240,208,120,0.4)}
.sudoku-cell.error{color:#f87171}
.sudoku-cell.success{background:rgba(34,197,94,0.15);border-color:var(--green)}
.sudoku-numpad{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;max-width:340px;margin:0 auto 14px}
.sudoku-num{padding:12px 0;border-radius:10px;border:2px solid rgba(139,92,246,0.3);background:rgba(255,255,255,0.02);color:#fff;font-family:'Unbounded',sans-serif;font-weight:800;font-size:1.1rem;cursor:pointer;transition:all 0.2s}
.sudoku-num:hover{background:rgba(139,92,246,0.2);border-color:var(--gold-light)}
.sudoku-num.clear{grid-column:span 1;background:rgba(239,68,68,0.15);border-color:var(--red);color:#f87171}

.g2048-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:340px;margin:0 auto 14px;background:rgba(139,92,246,0.15);padding:10px;border-radius:16px}
.g2048-cell{aspect-ratio:1;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Unbounded',sans-serif;font-weight:800;font-size:1.2rem;color:#fff;transition:all 0.15s;animation:tilePop 0.2s ease}
@keyframes tilePop{0%{transform:scale(0.8)}100%{transform:scale(1)}}
.g2048-cell[data-v="0"]{background:rgba(255,255,255,0.03)}
.g2048-cell[data-v="2"]{background:linear-gradient(135deg,#3b82f6,#1e40af);color:#fff}
.g2048-cell[data-v="4"]{background:linear-gradient(135deg,#8b5cf6,#5b21b6);color:#fff}
.g2048-cell[data-v="8"]{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff}
.g2048-cell[data-v="16"]{background:linear-gradient(135deg,#f59e0b,#b45309);color:#fff}
.g2048-cell[data-v="32"]{background:linear-gradient(135deg,#ef4444,#991b1b);color:#fff}
.g2048-cell[data-v="64"]{background:linear-gradient(135deg,#f0d078,#d4a853);color:#1a1a1a}
.g2048-cell[data-v="128"]{background:linear-gradient(135deg,#22c55e,#15803d);color:#fff;font-size:1rem}
.g2048-cell[data-v="256"]{background:linear-gradient(135deg,#10b981,#047857);color:#fff;font-size:1rem}
.g2048-cell[data-v="512"]{background:linear-gradient(135deg,#06b6d4,#0e7490);color:#fff;font-size:1rem}
.g2048-cell[data-v="1024"]{background:linear-gradient(135deg,#ec4899,#9d174d);color:#fff;font-size:0.9rem}
.g2048-cell[data-v="2048"]{background:linear-gradient(135deg,#facc15,#a16207);color:#fff;font-size:0.85rem;box-shadow:0 0 25px rgba(250,204,21,0.6)}
.g2048-arrows{display:grid;grid-template-columns:repeat(3,60px);grid-template-rows:repeat(3,50px);gap:6px;justify-content:center;margin:0 auto}
.g2048-arrow{border:2px solid rgba(139,92,246,0.3);background:rgba(255,255,255,0.02);border-radius:12px;color:#fff;font-size:1.4rem;cursor:pointer;transition:all 0.2s;font-family:inherit}
.g2048-arrow:hover{background:rgba(139,92,246,0.2);border-color:var(--gold-light)}
.g2048-arrow.up{grid-column:2;grid-row:1}
.g2048-arrow.left{grid-column:1;grid-row:2}
.g2048-arrow.right{grid-column:3;grid-row:2}
.g2048-arrow.down{grid-column:2;grid-row:3}

.slide-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:340px;margin:0 auto 14px;background:rgba(139,92,246,0.15);padding:8px;border-radius:14px}
.slide-tile{aspect-ratio:1;background:linear-gradient(135deg,#8b5cf6,#5b21b6);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Unbounded',sans-serif;font-weight:800;font-size:1.4rem;color:#fff;cursor:pointer;transition:all 0.2s;user-select:none}
.slide-tile:hover{transform:scale(1.05);box-shadow:0 0 15px rgba(139,92,246,0.5)}
.slide-tile.empty{background:transparent;cursor:default}
.slide-tile.empty:hover{transform:none;box-shadow:none}
.slide-tile.correct{background:linear-gradient(135deg,#22c55e,#15803d)}

.hanoi-area{display:flex;justify-content:space-around;gap:10px;margin:16px 0;align-items:flex-end;min-height:180px}
.hanoi-peg{flex:1;display:flex;flex-direction:column-reverse;align-items:center;position:relative;padding-bottom:8px;cursor:pointer;min-height:160px;justify-content:flex-start;border-radius:12px;transition:all 0.2s}
.hanoi-peg:hover{background:rgba(139,92,246,0.08)}
.hanoi-peg.selected{background:rgba(240,208,120,0.15);box-shadow:inset 0 0 20px rgba(240,208,120,0.3)}
.hanoi-peg::before{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:6px;height:100%;background:linear-gradient(180deg,var(--gold),transparent);border-radius:3px;z-index:0}
.hanoi-disk{height:20px;border-radius:10px;margin:2px 0;z-index:1;transition:all 0.3s;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.2);width:var(--w,60%)}
.hanoi-base{height:8px;background:linear-gradient(90deg,transparent,var(--gold),transparent);border-radius:4px;margin-top:4px}

.wordle-grid{display:flex;flex-direction:column;gap:6px;align-items:center;margin:14px 0}
.wordle-row{display:flex;gap:6px}
.wordle-tile{width:44px;height:44px;border-radius:8px;border:2px solid rgba(139,92,246,0.3);background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center;font-family:'Unbounded',sans-serif;font-weight:800;font-size:1.1rem;color:#fff;text-transform:uppercase;transition:all 0.3s}
.wordle-tile.correct{background:linear-gradient(135deg,#22c55e,#15803d);border-color:var(--green);color:#fff}
.wordle-tile.present{background:linear-gradient(135deg,#f59e0b,#b45309);border-color:var(--gold-light);color:#fff}
.wordle-tile.absent{background:rgba(60,60,80,0.5);border-color:rgba(255,255,255,0.1);color:#8a84a0}
.wordle-keyboard{display:flex;flex-direction:column;gap:5px;align-items:center;margin-top:10px}
.wordle-krow{display:flex;gap:4px}
.wordle-key{min-width:30px;height:42px;padding:0 8px;border-radius:8px;border:none;background:rgba(255,255,255,0.08);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.wordle-key:hover{background:rgba(139,92,246,0.3)}
.wordle-key.correct{background:linear-gradient(135deg,#22c55e,#15803d)}
.wordle-key.present{background:linear-gradient(135deg,#f59e0b,#b45309)}
.wordle-key.absent{background:rgba(40,40,60,0.7);color:#6a6480}
.wordle-key.wide{min-width:60px}
`;
document.head.appendChild(style);

// ---------- HTML для вкладки ----------
puzzlesTab.innerHTML = `
<div class="game-card">
    <div class="game-title">🔢 Судоку<button class="refresh-btn" onclick="sudokuNew()">🔄 Новое</button></div>
    <div class="game-desc">Выбери сложность и заполни поле. +100 ÷ +500 💎 за победу!</div>
    <div class="quiz-categories" id="sudokuLevels">
        <button class="quiz-cat-btn active" data-size="4" onclick="sudokuSetSize(4)">🌱 4×4 (+100💎)</button>
        <button class="quiz-cat-btn" data-size="6" onclick="sudokuSetSize(6)">🌿 6×6 (+250💎)</button>
        <button class="quiz-cat-btn" data-size="9" onclick="sudokuSetSize(9)">🌳 9×9 (+500💎)</button>
    </div>
    <div id="sudokuContainer"></div>
    <div id="sudokuNumpad" class="sudoku-numpad"></div>
    <div class="result" id="sudokuResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🎯 2048<button class="refresh-btn" onclick="g2048New()">🔄 Новая</button></div>
    <div class="game-desc">Собери плитку 2048! Чем выше — тем больше награда.</div>
    <div id="g2048Container"></div>
    <div class="result" id="g2048Result"></div>
</div>

<div class="game-card">
    <div class="game-title">🔀 Пятнашки<button class="refresh-btn" onclick="slideNew()">🔄 Новые</button></div>
    <div class="game-desc">Расставь числа по порядку от 1 до 15</div>
    <div id="slideContainer"></div>
    <div class="result" id="slideResult"></div>
</div>

<div class="game-card">
    <div class="game-title">🏰 Ханойская башня<button class="refresh-btn" onclick="hanoiNew()">🔄 Новая</button></div>
    <div class="game-desc">Переложи все диски на третий стержень. Нельзя класть больший на меньший. +200 💎</div>
    <div class="quiz-categories" id="hanoiLevels">
        <button class="quiz-cat-btn active" data-n="3" onclick="hanoiSetN(3)">3 диска</button>
        <button class="quiz-cat-btn" data-n="4" onclick="hanoiSetN(4)">4 диска</button>
        <button class="quiz-cat-btn" data-n="5" onclick="hanoiSetN(5)">5 дисков</button>
    </div>
    <div id="hanoiContainer"></div>
    <div style="text-align:center;font-size:0.85rem;color:var(--text-dim);margin-top:8px">
        Ходов: <strong id="hanoiMoves" style="color:var(--cyan)">0</strong> | Минимум: <strong id="hanoiMin" style="color:var(--gold-light)">7</strong>
    </div>
    <div class="result" id="hanoiResult"></div>
</div>

<div class="game-card">
    <div class="game-title">📝 Wordle<button class="refresh-btn" onclick="wordleNew()">🔄 Новое</button></div>
    <div class="game-desc">Угадай слово из 5 букв за 6 попыток. +200 💎</div>
    <div id="wordleContainer"></div>
    <div class="result" id="wordleResult"></div>
</div>
`;

// ============================================================
// СУДОКУ
// ============================================================
let sudokuSize = 4;
let sudokuPuzzle = [];
let sudokuSolution = [];
let sudokuSelected = null;

function sudokuGenerate(size) {
    // Создаём пустое поле
    const grid = Array.from({length: size}, () => Array(size).fill(0));
    // Базовый паттерн
    const base = size === 4 ? 2 : size === 6 ? 3 : 3;
    const boxW = base;
    const boxH = base;

    function isValid(g, r, c, v) {
        for (let i = 0; i < size; i++) {
            if (g[r][i] === v || g[i][c] === v) return false;
        }
        const br = Math.floor(r / boxH) * boxH;
        const bc = Math.floor(c / boxW) * boxW;
        for (let i = 0; i < boxH; i++)
            for (let j = 0; j < boxW; j++)
                if (g[br + i][bc + j] === v) return false;
        return true;
    }

    function fill(g, pos) {
        if (pos === size * size) return true;
        const r = Math.floor(pos / size);
        const c = pos % size;
        const nums = [...Array(size)].map((_, i) => i + 1).sort(() => Math.random() - 0.5);
        for (const v of nums) {
            if (isValid(g, r, c, v)) {
                g[r][c] = v;
                if (fill(g, pos + 1)) return true;
                g[r][c] = 0;
            }
        }
        return false;
    }

    fill(grid, 0);
    return grid;
}

function sudokuBuild(puzzleSize) {
    sudokuSize = puzzleSize;
    sudokuSolution = sudokuGenerate(puzzleSize);
    sudokuPuzzle = sudokuSolution.map(row => [...row]);
    // Убираем часть клеток
    const removePct = puzzleSize === 4 ? 0.5 : puzzleSize === 6 ? 0.6 : 0.55;
    const total = puzzleSize * puzzleSize;
    const toRemove = Math.floor(total * removePct);
    const positions = [...Array(total)].map((_, i) => i).sort(() => Math.random() - 0.5);
    for (let i = 0; i < toRemove; i++) {
        const r = Math.floor(positions[i] / puzzleSize);
        const c = positions[i] % puzzleSize;
        sudokuPuzzle[r][c] = 0;
    }
    sudokuSelected = null;
    sudokuRender();
}

function sudokuRender() {
    const size = sudokuSize;
    const boxW = size === 4 ? 2 : 3;
    const boxH = size === 4 ? 2 : (size === 6 ? 2 : 3);
    let html = `<div class="sudoku-grid" id="sudokuGrid" style="grid-template-columns:repeat(${size},1fr);max-width:${size === 9 ? 360 : 300}px">`;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const v = sudokuPuzzle[r][c];
            const fixed = sudokuSolution[r][c] === v && v !== 0;
            const cls = `sudoku-cell${fixed ? ' fixed' : ''}`;
            html += `<div class="${cls}" data-r="${r}" data-c="${c}" onclick="sudokuSelect(${r},${c})">${v || ''}</div>`;
        }
    }
    html += '</div>';
    document.getElementById('sudokuContainer').innerHTML = html;

    // Numpad
    let pad = '';
    for (let i = 1; i <= size; i++) {
        pad += `<button class="sudoku-num" onclick="sudokuInput(${i})">${i}</button>`;
    }
    pad += `<button class="sudoku-num clear" onclick="sudokuInput(0)">✕</button>`;
    document.getElementById('sudokuNumpad').innerHTML = pad;
    document.getElementById('sudokuNumpad').style.gridTemplateColumns = `repeat(${size <= 6 ? size : 5}, 1fr)`;
}

function sudokuSelect(r, c) {
    if (sudokuSolution[r][c] === sudokuPuzzle[r][c] && sudokuPuzzle[r][c] !== 0) return;
    sudokuSelected = {r, c};
    document.querySelectorAll('.sudoku-cell').forEach(el => el.classList.remove('selected'));
    const cell = document.querySelector(`.sudoku-cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) cell.classList.add('selected');
    sClick();
}

function sudokuInput(v) {
    if (!sudokuSelected) return;
    const {r, c} = sudokuSelected;
    sudokuPuzzle[r][c] = v;
    sudokuRender();
    const cell = document.querySelector(`.sudoku-cell[data-r="${r}"][data-c="${c}"]`);
    if (cell && v !== 0) {
        if (v === sudokuSolution[r][c]) {
            cell.classList.add('success');
        } else {
            cell.classList.add('error');
        }
    }
    sudokuCheck();
}

function sudokuCheck() {
    const size = sudokuSize;
    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            if (sudokuPuzzle[r][c] !== sudokuSolution[r][c]) return;
    // Победа!
    const reward = size === 4 ? 100 : size === 6 ? 250 : 500;
    state.balance += reward;
    sWin();
    saveState();
    updateUI();
    checkAchievements();
    const el = document.getElementById('sudokuResult');
    el.textContent = `🎉 Судоку решено! +${reward} 💎`;
    el.className = 'result show win';
    showToast(`🎉 +${reward} 💎!`, 'gold');
}

function sudokuNew() {
    sudokuBuild(sudokuSize);
    document.getElementById('sudokuResult').classList.remove('show');
    sClick();
}

function sudokuSetSize(size) {
    sudokuSize = size;
    document.querySelectorAll('#sudokuLevels .quiz-cat-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.size) === size);
    });
    sudokuNew();
}

// ============================================================
// 2048
// ============================================================
let g2048Grid = [];
let g2048Score = 0;

function g2048New() {
    g2048Grid = Array.from({length: 4}, () => Array(4).fill(0));
    g2048Score = 0;
    g2048AddRandom();
    g2048AddRandom();
    g2048Render();
    document.getElementById('g2048Result').classList.remove('show');
    sClick();
}

function g2048AddRandom() {
    const empty = [];
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
            if (g2048Grid[r][c] === 0) empty.push({r, c});
    if (!empty.length) return;
    const {r, c} = empty[Math.floor(Math.random() * empty.length)];
    g2048Grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function g2048Render() {
    let html = '<div class="g2048-grid" id="g2048Grid">';
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
            const v = g2048Grid[r][c];
            html += `<div class="g2048-cell" data-v="${v}">${v || ''}</div>`;
        }
    html += '</div>';
    html += `
        <div class="g2048-arrows">
            <button class="g2048-arrow up" onclick="g2048Move('up')">⬆️</button>
            <button class="g2048-arrow left" onclick="g2048Move('left')">⬅️</button>
            <button class="g2048-arrow right" onclick="g2048Move('right')">➡️</button>
            <button class="g2048-arrow down" onclick="g2048Move('down')">⬇️</button>
        </div>
        <div style="text-align:center;margin-top:12px;color:var(--text-dim);font-size:0.85rem">Очки: <strong style="color:var(--cyan)">${g2048Score}</strong></div>
    `;
    document.getElementById('g2048Container').innerHTML = html;
}

function g2048Slide(row) {
    const filtered = row.filter(v => v !== 0);
    const merged = [];
    let i = 0;
    while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
            merged.push(filtered[i] * 2);
            g2048Score += filtered[i] * 2;
            i += 2;
        } else {
            merged.push(filtered[i]);
            i++;
        }
    }
    while (merged.length < 4) merged.push(0);
    return merged;
}

function g2048Move(dir) {
    const old = JSON.stringify(g2048Grid);
    if (dir === 'left') {
        for (let r = 0; r < 4; r++) g2048Grid[r] = g2048Slide(g2048Grid[r]);
    } else if (dir === 'right') {
        for (let r = 0; r < 4; r++) g2048Grid[r] = g2048Slide(g2048Grid[r].reverse()).reverse();
    } else if (dir === 'up') {
        for (let c = 0; c < 4; c++) {
            const col = [g2048Grid[0][c], g2048Grid[1][c], g2048Grid[2][c], g2048Grid[3][c]];
            const slid = g2048Slide(col);
            for (let r = 0; r < 4; r++) g2048Grid[r][c] = slid[r];
        }
    } else if (dir === 'down') {
        for (let c = 0; c < 4; c++) {
            const col = [g2048Grid[3][c], g2048Grid[2][c], g2048Grid[1][c], g2048Grid[0][c]];
            const slid = g2048Slide(col);
            for (let r = 0; r < 4; r++) g2048Grid[3 - r][c] = slid[r];
        }
    }

    if (JSON.stringify(g2048Grid) !== old) {
        g2048AddRandom();
        g2048Render();
        sTick();

        // Проверка на 2048
        for (let r = 0; r < 4; r++)
            for (let c = 0; c < 4; c++)
                if (g2048Grid[r][c] === 2048) {
                    state.balance += 1000;
                    sWin();
                    saveState();
                    updateUI();
                    const el = document.getElementById('g2048Result');
                    el.textContent = `🏆 2048! Ты выиграл +1000 💎!`;
                    el.className = 'result show win';
                    return;
                }

        // Проверка на проигрыш
        if (g2048IsGameOver()) {
            const el = document.getElementById('g2048Result');
            el.textContent = `💀 Ходов больше нет. Очки: ${g2048Score}`;
            el.className = 'result show lose';
            sLose();
        }
    }
}

function g2048IsGameOver() {
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
            if (g2048Grid[r][c] === 0) return false;
            if (c < 3 && g2048Grid[r][c] === g2048Grid[r][c + 1]) return false;
            if (r < 3 && g2048Grid[r][c] === g2048Grid[r + 1][c]) return false;
        }
    return true;
}

// ============================================================
// ПЯТНАШКИ
// ============================================================
let slideGrid = [];

function slideNew() {
    slideGrid = [...Array(16)].map((_, i) => (i + 1) % 16);
    // Перемешиваем — делаем N случайных валидных ходов
    let empty = 15;
    for (let i = 0; i < 200; i++) {
        const r = Math.floor(empty / 4);
        const c = empty % 4;
        const neighbors = [];
        if (r > 0) neighbors.push(empty - 4);
        if (r < 3) neighbors.push(empty + 4);
        if (c > 0) neighbors.push(empty - 1);
        if (c < 3) neighbors.push(empty + 1);
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        [slideGrid[empty], slideGrid[pick]] = [slideGrid[pick], slideGrid[empty]];
        empty = pick;
    }
    slideRender();
    document.getElementById('slideResult').classList.remove('show');
    sClick();
}

function slideRender() {
    let html = '<div class="slide-grid" id="slideGrid">';
    for (let i = 0; i < 16; i++) {
        const v = slideGrid[i];
        if (v === 0) html += `<div class="slide-tile empty"></div>`;
        else {
            const correct = v === i + 1 ? ' correct' : '';
            html += `<div class="slide-tile${correct}" onclick="slideMove(${i})">${v}</div>`;
        }
    }
    html += '</div>';
    document.getElementById('slideContainer').innerHTML = html;
}

function slideMove(idx) {
    const empty = slideGrid.indexOf(0);
    const er = Math.floor(empty / 4), ec = empty % 4;
    const r = Math.floor(idx / 4), c = idx % 4;
    if (Math.abs(er - r) + Math.abs(ec - c) !== 1) return;
    [slideGrid[empty], slideGrid[idx]] = [slideGrid[idx], slideGrid[empty]];
    slideRender();
    sClick();
    slideCheck();
}

function slideCheck() {
    for (let i = 0; i < 15; i++)
        if (slideGrid[i] !== i + 1) return;
    if (slideGrid[15] !== 0) return;
    state.balance += 300;
    sWin();
    saveState();
    updateUI();
    checkAchievements();
    const el = document.getElementById('slideResult');
    el.textContent = `🎉 Собрал пятнашки! +300 💎`;
    el.className = 'result show win';
    showToast('🎉 +300 💎!', 'gold');
}

// ============================================================
// ХАНОЙСКАЯ БАШНЯ
// ============================================================
let hanoiN = 3;
let hanoiPegs = [[], [], []];
let hanoiSelectedPeg = null;
let hanoiMoves = 0;

function hanoiNew() {
    hanoiPegs = [[], [], []];
    for (let i = hanoiN; i >= 1; i--) hanoiPegs[0].push(i);
    hanoiSelectedPeg = null;
    hanoiMoves = 0;
    document.getElementById('hanoiMoves').textContent = 0;
    document.getElementById('hanoiMin').textContent = Math.pow(2, hanoiN) - 1;
    hanoiRender();
    document.getElementById('hanoiResult').classList.remove('show');
    sClick();
}

function hanoiRender() {
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];
    let html = '<div class="hanoi-area">';
    for (let i = 0; i < 3; i++) {
        const sel = hanoiSelectedPeg === i ? ' selected' : '';
        html += `<div class="hanoi-peg${sel}" onclick="hanoiClick(${i})">`;
        hanoiPegs[i].forEach((disk, idx) => {
            const w = 30 + disk * 12;
            html += `<div class="hanoi-disk" style="--w:${w}%;background:${colors[(disk - 1) % colors.length]}"></div>`;
        });
        html += '<div class="hanoi-base"></div></div>';
    }
    html += '</div>';
    document.getElementById('hanoiContainer').innerHTML = html;
}

function hanoiClick(i) {
    if (hanoiSelectedPeg === null) {
        if (hanoiPegs[i].length === 0) { sLose(); return; }
        hanoiSelectedPeg = i;
        hanoiRender();
        sClick();
    } else if (hanoiSelectedPeg === i) {
        hanoiSelectedPeg = null;
        hanoiRender();
        sClick();
    } else {
        const from = hanoiPegs[hanoiSelectedPeg];
        const to = hanoiPegs[i];
        const disk = from[from.length - 1];
        const top = to[to.length - 1];
        if (top === undefined || top > disk) {
            from.pop();
            to.push(disk);
            hanoiMoves++;
            document.getElementById('hanoiMoves').textContent = hanoiMoves;
            hanoiSelectedPeg = null;
            hanoiRender();
            sClick();
            hanoiCheck();
        } else {
            sLose();
            showToast('Нельзя класть больший на меньший', '');
            hanoiSelectedPeg = null;
            hanoiRender();
        }
    }
}

function hanoiCheck() {
    if (hanoiPegs[2].length === hanoiN) {
        state.balance += 200;
        sWin();
        saveState();
        updateUI();
        checkAchievements();
        const el = document.getElementById('hanoiResult');
        el.textContent = `🎉 Башня собрана за ${hanoiMoves} ходов! +200 💎`;
        el.className = 'result show win';
        showToast('🎉 +200 💎!', 'gold');
    }
}

function hanoiSetN(n) {
    hanoiN = n;
    document.querySelectorAll('#hanoiLevels .quiz-cat-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.n) === n);
    });
    hanoiNew();
}

// ============================================================
// WORDLE
// ============================================================
const WORDLE_WORDS = [
    'СТОЛБ', 'КНИГА', 'ВОДА', 'ОГОНЬ', 'ЗЕМЛЯ', 'ВЕТЕР', 'СОЛНЦЕ', 'ЛУНА', 'ЗВЕЗДА', 'НЕБО',
    'ПЕСНЯ', 'ТАНЕЦ', 'СМЕХ', 'СЛЕЗА', 'РАДОСТЬ', 'ГРУСТЬ', 'ЛЮБОВЬ', 'ДРУЖБА', 'МИРА', 'ВЕСНА',
    'ЗИМА', 'ЛЕТО', 'ОСЕНЬ', 'ЦВЕТОК', 'ДЕРЕВО', 'ЛИСТОК', 'ТРАВА', 'КАМЕНЬ', 'ПЕСОК', 'МОРЕ',
    'РЕКА', 'ОЗЕРО', 'ГОРА', 'ХОЛМ', 'ПОЛЕ', 'ЛЕС', 'ЗВЕРЬ', 'ПТИЦА', 'РЫБА', 'КОШКА',
    'СОБАКА', 'ЛИСА', 'ВОЛК', 'МЕДВЕДЬ', 'ЗАЯЦ', 'МЫШЬ', 'КОНЬ', 'КОРОВА', 'СВИНЬЯ', 'ОВЦА'
];

let wordleAnswer = '';
let wordleGuesses = [];
let wordleCurrent = '';
let wordleOver = false;

function wordleNew() {
    wordleAnswer = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
    wordleGuesses = [];
    wordleCurrent = '';
    wordleOver = false;
    wordleRender();
    document.getElementById('wordleResult').classList.remove('show');
    sClick();
}

function wordleRender() {
    let html = '<div class="wordle-grid">';
    for (let i = 0; i < 6; i++) {
        html += '<div class="wordle-row">';
        const guess = wordleGuesses[i] || (i === wordleGuesses.length ? wordleCurrent : '');
        for (let j = 0; j < 5; j++) {
            const letter = guess[j] || '';
            let cls = '';
            if (wordleGuesses[i]) {
                if (wordleAnswer[j] === letter) cls = 'correct';
                else if (wordleAnswer.includes(letter)) cls = 'present';
                else cls = 'absent';
            }
            html += `<div class="wordle-tile ${cls}">${letter}</div>`;
        }
        html += '</div>';
    }
    html += '</div>';

    // Клавиатура
    const rows = [
        ['Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ'],
        ['Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э'],
        ['ENTER','Я','Ч','С','М','И','Т','Ь','Б','Ю','⌫']
    ];
    html += '<div class="wordle-keyboard">';
    rows.forEach(row => {
        html += '<div class="wordle-krow">';
        row.forEach(k => {
            let cls = '';
            if (k.length === 1) {
                for (let i = 0; i < wordleGuesses.length; i++) {
                    const g = wordleGuesses[i];
                    if (!g.includes(k)) continue;
                    for (let j = 0; j < 5; j++) {
                        if (g[j] === k) {
                            if (wordleAnswer[j] === k) { cls = 'correct'; break; }
                            else if (wordleAnswer.includes(k) && cls !== 'correct') cls = 'present';
                            else if (cls !== 'correct' && cls !== 'present') cls = 'absent';
                        }
                    }
                }
            }
            const wide = (k === 'ENTER' || k === '⌫') ? ' wide' : '';
            html += `<button class="wordle-key${wide} ${cls}" onclick="wordleKey('${k}')">${k}</button>`;
        });
        html += '</div>';
    });
    html += '</div>';
    document.getElementById('wordleContainer').innerHTML = html;
}

function wordleKey(key) {
    if (wordleOver) return;
    if (key === 'ENTER') {
        if (wordleCurrent.length !== 5) { showToast('Нужно 5 букв', ''); return; }
        wordleGuesses.push(wordleCurrent);
        if (wordleCurrent === wordleAnswer) {
            wordleOver = true;
            state.balance += 200;
            sWin();
            saveState();
            updateUI();
            checkAchievements();
            const el = document.getElementById('wordleResult');
            el.textContent = `🎉 Угадал! Слово: ${wordleAnswer}. +200 💎`;
            el.className = 'result show win';
            wordleCurrent = '';
            wordleRender();
            return;
        }
        if (wordleGuesses.length >= 6) {
            wordleOver = true;
            sLose();
            const el = document.getElementById('wordleResult');
            el.textContent = `💀 Не угадал. Слово было: ${wordleAnswer}`;
            el.className = 'result show lose';
        }
        wordleCurrent = '';
        wordleRender();
    } else if (key === '⌫') {
        wordleCurrent = wordleCurrent.slice(0, -1);
        wordleRender();
    } else if (wordleCurrent.length < 5) {
        wordleCurrent += key;
        wordleRender();
    }
    sClick();
}

// Поддержка физической клавиатуры
document.addEventListener('keydown', e => {
    if (!document.getElementById('tab-puzzles') || !document.getElementById('tab-puzzles').classList.contains('active')) return;
    if (wordleOver) return;
    const k = e.key.toUpperCase();
    if (k === 'ENTER') wordleKey('ENTER');
    else if (k === 'BACKSPACE') wordleKey('⌫');
    else if (/^[А-ЯЁ]$/.test(k)) wordleKey(k);
});

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
sudokuBuild(4);
g2048New();
slideNew();
hanoiNew();
wordleNew();

// Экспорт функций в глобал
window.sudokuNew = sudokuNew;
window.sudokuSetSize = sudokuSetSize;
window.sudokuSelect = sudokuSelect;
window.sudokuInput = sudokuInput;
window.g2048New = g2048New;
window.g2048Move = g2048Move;
window.slideNew = slideNew;
window.slideMove = slideMove;
window.hanoiNew = hanoiNew;
window.hanoiClick = hanoiClick;
window.hanoiSetN = hanoiSetN;
window.wordleNew = wordleNew;
window.wordleKey = wordleKey;

})();
