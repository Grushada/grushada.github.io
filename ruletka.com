<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Рулетка удачи — PieSenia</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Unbounded:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg: #060610;
            --card: rgba(12,12,28,0.6);
            --border: rgba(255,255,255,0.06);
            --glass: blur(30px);
            --accent: #8b5cf6;
            --accent-light: #a78bfa;
            --gold: #d4a853;
            --gold-light: #f0d078;
            --text: #e8e4f0;
            --text-dim: #8a84a0;
            --radius: 24px;
            --transition: 0.3s ease;
            --green: #22c55e;
            --red: #ef4444;
            --cyan: #00d4ff;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-image: radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 60%),
                              radial-gradient(ellipse at 80% 50%, rgba(255,45,149,0.08) 0%, transparent 60%);
        }
        .container { max-width: 1000px; width: 100%; }

        header { text-align: center; padding: 30px 0 10px; }
        .logo { font-size: 60px; display: inline-block; filter: drop-shadow(0 0 30px rgba(139,92,246,0.4)); }
        h1 {
            font-family: 'Unbounded', sans-serif;
            font-size: clamp(2rem, 5vw, 3.2rem);
            font-weight: 800;
            background: linear-gradient(135deg, #00d4ff, #a78bfa, #ff2d95);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 10px 0 5px;
        }
        .subtitle { color: var(--text-dim); font-size: 1rem; margin-bottom: 10px; }
        .disclaimer {
            display: inline-block;
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid rgba(251, 191, 36, 0.3);
            color: #fbbf24;
            font-size: 0.78rem;
            padding: 8px 16px;
            border-radius: 20px;
            margin-bottom: 30px;
            font-weight: 600;
        }

        /* Баланс */
        .balance-card {
            background: var(--card);
            backdrop-filter: var(--glass);
            -webkit-backdrop-filter: var(--glass);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 24px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .balance-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .balance-label {
            font-size: 0.75rem;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
        }
        .balance-value {
            font-family: 'Unbounded', sans-serif;
            font-size: 1.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--cyan), var(--accent-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .balance-value.diamonds {
            background: linear-gradient(135deg, #00d4ff, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .btn-reset {
            padding: 10px 20px;
            background: rgba(139,92,246,0.15);
            border: 1px solid rgba(139,92,246,0.3);
            color: var(--accent-light);
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.8rem;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.3s;
        }
        .btn-reset:hover {
            background: rgba(139,92,246,0.3);
            color: #fff;
        }

        /* Колесо */
        .wheel-section {
            background: var(--card);
            backdrop-filter: var(--glass);
            -webkit-backdrop-filter: var(--glass);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 40px 24px;
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
        }
        .wheel-wrapper {
            position: relative;
            width: 320px;
            height: 320px;
        }
        .wheel-pointer {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-top: 24px solid var(--gold-light);
            z-index: 10;
            filter: drop-shadow(0 0 10px rgba(240,208,120,0.8));
        }
        .wheel {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 0 8px rgba(139,92,246,0.3), 0 0 50px rgba(139,92,246,0.4), inset 0 0 60px rgba(0,0,0,0.6);
            transition: transform 5s cubic-bezier(0.17, 0.67, 0.16, 1);
        }
        .wheel.spinning {
            transition: transform 5s cubic-bezier(0.17, 0.67, 0.16, 1);
        }
        .wheel-segment {
            position: absolute;
            top: 0;
            left: 50%;
            width: 50%;
            height: 50%;
            transform-origin: 0% 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.85rem;
            color: #fff;
            font-family: 'Unbounded', sans-serif;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }
        .wheel-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #1a1a35, #0a0a20);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            box-shadow: 0 0 0 4px rgba(240,208,120,0.5), 0 0 30px rgba(240,208,120,0.6);
            z-index: 5;
        }

        /* Ставки */
        .bet-section {
            width: 100%;
            max-width: 500px;
        }
        .bet-label {
            font-size: 0.8rem;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
        }
        .bet-options {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 16px;
        }
        .bet-btn {
            padding: 12px 24px;
            border: 2px solid rgba(255,255,255,0.08);
            border-radius: 40px;
            background: rgba(255,255,255,0.02);
            color: var(--text-dim);
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
        }
        .bet-btn.active {
            border-color: var(--accent);
            background: rgba(139,92,246,0.15);
            color: #fff;
            box-shadow: 0 0 20px rgba(139,92,246,0.3);
        }
        .bet-btn:hover {
            border-color: var(--accent-light);
            color: #fff;
        }

        .color-choice {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 20px;
        }
        .color-btn {
            flex: 1;
            max-width: 140px;
            padding: 16px;
            border-radius: 16px;
            border: 3px solid transparent;
            font-weight: 800;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .color-btn.red { background: linear-gradient(135deg, #dc2626, #991b1b); }
        .color-btn.black { background: linear-gradient(135deg, #1f2937, #0a0a14); border: 3px solid rgba(255,255,255,0.15); }
        .color-btn.green { background: linear-gradient(135deg, #16a34a, #14532d); }
        .color-btn.active {
            border-color: var(--gold-light);
            box-shadow: 0 0 25px rgba(240,208,120,0.6);
            transform: scale(1.05);
        }

        .btn-spin {
            width: 100%;
            padding: 18px;
            border: none;
            border-radius: 40px;
            background: linear-gradient(135deg, var(--gold-light), var(--gold));
            color: #1a1a1a;
            font-weight: 800;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Unbounded', sans-serif;
            letter-spacing: 1px;
            text-transform: uppercase;
            box-shadow: 0 8px 30px rgba(212,168,83,0.4);
        }
        .btn-spin:hover:not(:disabled) {
            transform: scale(1.02);
            box-shadow: 0 12px 40px rgba(212,168,83,0.6);
        }
        .btn-spin:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Результат */
        .result {
            margin-top: 20px;
            padding: 20px;
            border-radius: 20px;
            text-align: center;
            font-weight: 700;
            font-size: 1.1rem;
            display: none;
            animation: resultIn 0.5s ease;
        }
        .result.show { display: block; }
        .result.win {
            background: rgba(34,197,94,0.15);
            border: 1px solid rgba(34,197,94,0.4);
            color: #4ade80;
        }
        .result.lose {
            background: rgba(239,68,68,0.15);
            border: 1px solid rgba(239,68,68,0.4);
            color: #f87171;
        }
        @keyframes resultIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }

        /* История */
        .history-section {
            background: var(--card);
            backdrop-filter: var(--glass);
            -webkit-backdrop-filter: var(--glass);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 24px;
            margin-bottom: 24px;
        }
        .history-title {
            font-family: 'Unbounded', sans-serif;
            font-size: 1rem;
            margin-bottom: 16px;
            color: var(--gold-light);
        }
        .history-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 250px;
            overflow-y: auto;
        }
        .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            border-radius: 12px;
            background: rgba(255,255,255,0.02);
            font-size: 0.85rem;
            border-left: 3px solid var(--text-dim);
        }
        .history-item.win { border-left-color: var(--green); }
        .history-item.lose { border-left-color: var(--red); }
        .history-item .time { color: var(--text-dim); font-size: 0.75rem; }
        .history-empty { color: var(--text-dim); font-size: 0.85rem; text-align: center; padding: 20px; }

        footer {
            text-align: center;
            padding: 30px 20px 10px;
            color: var(--text-dim);
            font-size: 0.8rem;
            border-top: 1px solid rgba(255,255,255,0.05);
            margin-top: 40px;
            width: 100%;
        }
        footer a { color: var(--accent-light); text-decoration: none; }
        footer a:hover { color: #00d4ff; }

        @media (max-width: 600px) {
            .wheel-wrapper { width: 260px; height: 260px; }
            .wheel-center { width: 65px; height: 65px; font-size: 1.6rem; }
            .wheel-segment { font-size: 0.7rem; }
            .balance-value { font-size: 1.4rem; }
            .color-btn { font-size: 0.85rem; padding: 12px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">🎰</div>
            <h1>Рулетка удачи</h1>
            <p class="subtitle">Играй на алмазики ради фана — без реальных ставок</p>
            <span class="disclaimer">⚠️ Игра создана исключительно для развлечения. Не является азартной игрой. Реальные деньги не используются.</span>
        </header>

        <!-- Баланс -->
        <div class="balance-card">
            <div class="balance-item">
                <span class="balance-label">Твой баланс</span>
                <span class="balance-value diamonds" id="balance">💎 1000</span>
            </div>
            <div class="balance-item">
                <span class="balance-label">Игр сыграно</span>
                <span class="balance-value" id="gamesPlayed">0</span>
            </div>
            <div class="balance-item">
                <span class="balance-label">Побед</span>
                <span class="balance-value" id="winsCount" style="background: linear-gradient(135deg, #4ade80, #16a34a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">0</span>
            </div>
            <button class="btn-reset" onclick="resetGame()">🔄 Сбросить</button>
        </div>

        <!-- Колесо -->
        <div class="wheel-section">
            <div class="wheel-wrapper">
                <div class="wheel-pointer"></div>
                <div class="wheel" id="wheel"></div>
                <div class="wheel-center">💎</div>
            </div>

            <div class="bet-section">
                <div class="bet-label">Выбери размер ставки</div>
                <div class="bet-options" id="betOptions">
                    <button class="bet-btn" data-bet="10">10 💎</button>
                    <button class="bet-btn active" data-bet="50">50 💎</button>
                    <button class="bet-btn" data-bet="100">100 💎</button>
                    <button class="bet-btn" data-bet="250">250 💎</button>
                    <button class="bet-btn" data-bet="500">500 💎</button>
                </div>

                <div class="bet-label">Выбери цвет</div>
                <div class="color-choice" id="colorChoice">
                    <button class="color-btn red" data-color="red">🔴 Красное</button>
                    <button class="color-btn green" data-color="green">🟢 Зелёное</button>
                    <button class="color-btn black" data-color="black">⚫ Чёрное</button>
                </div>

                <button class="btn-spin" id="spinBtn" onclick="spin()">🎰 Крутить колесо</button>

                <div class="result" id="result"></div>
            </div>
        </div>

        <!-- История -->
        <div class="history-section">
            <div class="history-title">📜 История игр</div>
            <div class="history-list" id="historyList">
                <div class="history-empty">Пока нет сыгранных партий. Сделай первую ставку!</div>
            </div>
        </div>

        <footer>
            <p>Контакты: <a href="mailto:love_cute_cats@mail.ru">love_cute_cats@mail.ru</a> | <a href="https://t.me/Rettero">@Rettero</a></p>
            <p>
                <a href="/">Главная</a> |
                <a href="/privacy">Политика конфиденциальности</a> |
                <a href="/terms">Пользовательское соглашение</a> |
                <a href="/cookies">Использование cookie</a> |
                <a href="/copyright">Авторские права</a> |
                <a href="/links">Полезные ссылки</a>
            </p>
        </footer>
    </div>

    <script>
        // ===== Конфигурация колеса =====
        // 18 секторов: 8 красных, 8 чёрных, 2 зелёных
        const SEGMENTS = [
            { color: 'red',   num: 1 },
            { color: 'black', num: 2 },
            { color: 'red',   num: 3 },
            { color: 'black', num: 4 },
            { color: 'red',   num: 5 },
            { color: 'black', num: 6 },
            { color: 'red',   num: 7 },
            { color: 'black', num: 8 },
            { color: 'green', num: 0 },
            { color: 'red',   num: 9 },
            { color: 'black', num: 10 },
            { color: 'red',   num: 11 },
            { color: 'black', num: 12 },
            { color: 'red',   num: 13 },
            { color: 'black', num: 14 },
            { color: 'red',   num: 15 },
            { color: 'black', num: 16 },
            { color: 'green', num: 0 }
        ];

        const SEGMENT_COUNT = SEGMENTS.length;
        const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

        const COLORS = {
            red:   'linear-gradient(135deg, #dc2626, #7f1d1d)',
            black: 'linear-gradient(135deg, #1f2937, #0a0a14)',
            green: 'linear-gradient(135deg, #16a34a, #14532d)'
        };

        // ===== Состояние =====
        let state = {
            balance: 1000,
            gamesPlayed: 0,
            wins: 0,
            currentBet: 50,
            currentColor: null,
            spinning: false,
            history: []
        };

        // Загружаем сохранённое состояние
        function loadState() {
            try {
                const saved = localStorage.getItem('ruletka_state');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    state.balance = parsed.balance ?? 1000;
                    state.gamesPlayed = parsed.gamesPlayed ?? 0;
                    state.wins = parsed.wins ?? 0;
                    state.currentBet = parsed.currentBet ?? 50;
                    state.history = parsed.history ?? [];
                }
            } catch(e) { console.warn('Ошибка загрузки:', e); }
        }

        function saveState() {
            try {
                localStorage.setItem('ruletka_state', JSON.stringify({
                    balance: state.balance,
                    gamesPlayed: state.gamesPlayed,
                    wins: state.wins,
                    currentBet: state.currentBet,
                    history: state.history.slice(0, 20)
                }));
            } catch(e) { console.warn('Ошибка сохранения:', e); }
        }

        // ===== Рендер колеса =====
        function buildWheel() {
            const wheel = document.getElementById('wheel');
            wheel.innerHTML = '';
            SEGMENTS.forEach((seg, i) => {
                const div = document.createElement('div');
                div.className = 'wheel-segment';
                // Каждый сектор — повёрнут на свой угол
                div.style.transform = `rotate(${i * SEGMENT_ANGLE}deg)`;
                div.style.background = COLORS[seg.color];
                div.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%)';
                // Текст внутри сектора
                const label = document.createElement('span');
                label.style.transform = `rotate(${SEGMENT_ANGLE / 2}deg)`;
                label.style.marginLeft = '60px';
                label.textContent = seg.num === 0 ? '0' : seg.num;
                div.appendChild(label);
                wheel.appendChild(div);
            });
        }

        // ===== UI =====
        function updateUI() {
            document.getElementById('balance').textContent = '💎 ' + state.balance;
            document.getElementById('gamesPlayed').textContent = state.gamesPlayed;
            document.getElementById('winsCount').textContent = state.wins;
            renderHistory();

            // Проверка на банкротство
            const spinBtn = document.getElementById('spinBtn');
            if (state.balance < 10 && !state.spinning) {
                spinBtn.disabled = true;
                spinBtn.textContent = '💔 Недостаточно алмазов';
            } else if (!state.spinning) {
                spinBtn.disabled = false;
                spinBtn.textContent = '🎰 Крутить колесо';
            }
        }

        function renderHistory() {
            const list = document.getElementById('historyList');
            if (!state.history.length) {
                list.innerHTML = '<div class="history-empty">Пока нет сыгранных партий. Сделай первую ставку!</div>';
                return;
            }
            list.innerHTML = state.history.map(h => `
                <div class="history-item ${h.win ? 'win' : 'lose'}">
                    <span>${h.win ? '🏆' : '💀'} Ставка ${h.bet} 💎 на ${colorLabel(h.color)} → выпало ${h.result}</span>
                    <span class="time">${h.time}</span>
                </div>
            `).join('');
        }

        function colorLabel(c) {
            return c === 'red' ? '🔴' : c === 'green' ? '🟢' : '⚫';
        }

        // ===== Выбор ставки/цвета =====
        document.querySelectorAll('#betOptions .bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (state.spinning) return;
                document.querySelectorAll('#betOptions .bet-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentBet = parseInt(btn.dataset.bet);
            });
        });

        document.querySelectorAll('#colorChoice .color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (state.spinning) return;
                document.querySelectorAll('#colorChoice .color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentColor = btn.dataset.color;
            });
        });

        // ===== Кручение =====
        function spin() {
            if (state.spinning) return;
            if (!state.currentColor) {
                showResult('Сначала выбери цвет!', 'lose');
                return;
            }
            if (state.balance < state.currentBet) {
                showResult('Недостаточно алмазов для этой ставки!', 'lose');
                return;
            }

            state.spinning = true;
            const spinBtn = document.getElementById('spinBtn');
            spinBtn.disabled = true;
            spinBtn.textContent = '🎲 Крутится...';
            document.getElementById('result').classList.remove('show');

            // Списываем ставку
            state.balance -= state.currentBet;
            updateUI();

            // Выбираем случайный сектор
            const winningIndex = Math.floor(Math.random() * SEGMENT_COUNT);
            const winningSegment = SEGMENTS[winningIndex];

            // Угол: сектор 0 находится сверху (указатель). Чтобы выигрышный сектор оказался под указателем,
            // нужно повернуть колесо на (360 - index*SEGMENT_ANGLE) + несколько полных оборотов
            const spins = 5 + Math.floor(Math.random() * 3); // 5-7 полных оборотов
            const targetAngle = 360 * spins + (360 - winningIndex * SEGMENT_ANGLE) - SEGMENT_ANGLE / 2;

            const wheel = document.getElementById('wheel');
            wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.16, 1)';
            wheel.style.transform = `rotate(${targetAngle}deg)`;

            // Через 5 секунд — результат
            setTimeout(() => {
                // Проверяем совпадение
                const isWin = winningSegment.color === state.currentColor;

                let winAmount = 0;
                if (isWin) {
                    // Красное/Чёрное — x2, Зелёное — x14
                    const multiplier = state.currentColor === 'green' ? 14 : 2;
                    winAmount = state.currentBet * multiplier;
                    state.balance += winAmount;
                    state.wins++;
                }
                state.gamesPlayed++;

                // Запись в историю
                state.history.unshift({
                    win: isWin,
                    bet: state.currentBet,
                    color: state.currentColor,
                    result: `${colorLabel(winningSegment.color)} ${winningSegment.num}`,
                    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                });
                if (state.history.length > 20) state.history.pop();

                // Показываем результат
                if (isWin) {
                    const mult = state.currentColor === 'green' ? 'x14' : 'x2';
                    showResult(`🎉 Победа! Выпало ${colorLabel(winningSegment.color)} ${winningSegment.num}. Ты выиграл ${winAmount} 💎 (${mult})`, 'win');
                } else {
                    showResult(`💀 Увы! Выпало ${colorLabel(winningSegment.color)} ${winningSegment.num}. Ты потерял ${state.currentBet} 💎`, 'lose');
                }

                state.spinning = false;
                spinBtn.textContent = '🎰 Крутить колесо';
                updateUI();
                saveState();

                // Сброс transform, чтобы следующее вращение работало от 0
                setTimeout(() => {
                    wheel.style.transition = 'none';
                    wheel.style.transform = `rotate(${targetAngle % 360}deg)`;
                    // Форсируем reflow, чтобы transition сбросился
                    void wheel.offsetWidth;
                    wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.16, 1)';
                }, 100);
            }, 5100);
        }

        function showResult(text, type) {
            const el = document.getElementById('result');
            el.textContent = text;
            el.className = 'result show ' + type;
        }

        function resetGame() {
            if (!confirm('Сбросить весь прогресс и начать заново с 1000 💎?')) return;
            state = {
                balance: 1000,
                gamesPlayed: 0,
                wins: 0,
                currentBet: 50,
                currentColor: null,
                spinning: false,
                history: []
            };
            // Сброс UI выбора
            document.querySelectorAll('#betOptions .bet-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('#betOptions .bet-btn[data-bet="50"]').classList.add('active');
            document.querySelectorAll('#colorChoice .color-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('result').classList.remove('show');
            saveState();
            updateUI();
        }

        // ===== Инициализация =====
        loadState();
        buildWheel();
        updateUI();

        // Восстановить активные кнопки
        document.querySelectorAll('#betOptions .bet-btn').forEach(b => {
            if (parseInt(b.dataset.bet) === state.currentBet) b.classList.add('active');
            else b.classList.remove('active');
        });
    </script>
</body>
</html>
