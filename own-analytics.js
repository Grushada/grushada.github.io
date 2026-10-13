// ============================================================
// СОБСТВЕННАЯ АНАЛИТИКА (ЛОКАЛЬНАЯ)
// Хранит данные в localStorage. Показывает на /stats
// ============================================================

(function() {
    'use strict';

    const STORAGE_KEY = 'piesenia_analytics';
    const MAX_EVENTS = 1000; // максимум событий в памяти

    // ============================================================
    // ЗАГРУЗКА СОСТОЯНИЯ
    // ============================================================
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch(e) {}
        return {
            sessions: [],
            events: [],
            pages: {},
            games: {},
            firstVisit: Date.now(),
            totalVisits: 0
        };
    }

    function saveData(data) {
        try {
            // Обрезаем события до MAX_EVENTS
            if (data.events.length > MAX_EVENTS) {
                data.events = data.events.slice(-MAX_EVENTS);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch(e) {}
    }

    let data = loadData();

    // ============================================================
    // УТИЛИТЫ
    // ============================================================
    function getSessionId() {
        let sid = sessionStorage.getItem('piesenia_session');
        if (!sid) {
            sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            sessionStorage.setItem('piesenia_session', sid);
        }
        return sid;
    }

    function getDeviceInfo() {
        const ua = navigator.userAgent;
        let device = 'desktop';
        let os = 'unknown';
        let browser = 'unknown';

        if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) device = 'mobile';
        else if (/Tablet|iPad/i.test(ua)) device = 'tablet';

        if (/Windows/i.test(ua)) os = 'Windows';
        else if (/Mac/i.test(ua)) os = 'macOS';
        else if (/Android/i.test(ua)) os = 'Android';
        else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
        else if (/Linux/i.test(ua)) os = 'Linux';

        if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
        else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
        else if (/Firefox/i.test(ua)) browser = 'Firefox';
        else if (/Edg/i.test(ua)) browser = 'Edge';
        else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

        return { device, os, browser, screen: `${screen.width}x${screen.height}` };
    }

    function getReferrer() {
        const ref = document.referrer;
        if (!ref) return 'direct';
        try {
            const url = new URL(ref);
            if (url.hostname.includes('google')) return 'google';
            if (url.hostname.includes('yandex')) return 'yandex';
            if (url.hostname.includes('t.me') || url.hostname.includes('telegram')) return 'telegram';
            if (url.hostname.includes('vk.com')) return 'vk';
            if (url.hostname.includes('tiktok')) return 'tiktok';
            if (url.hostname.includes('youtube')) return 'youtube';
            return url.hostname;
        } catch(e) { return 'other'; }
    }

    // ============================================================
    // ЗАПИСЬ СОБЫТИЙ
    // ============================================================
    function track(eventType, payload = {}) {
        const event = {
            t: eventType,
            sid: getSessionId(),
            ts: Date.now(),
            url: location.pathname,
            ...payload
        };
        data.events.push(event);

        // Обновляем агрегаты
        const page = location.pathname || '/';
        data.pages[page] = (data.pages[page] || 0) + (eventType === 'pageview' ? 1 : 0);

        if (eventType === 'game_start' && payload.game) {
            data.games[payload.game] = data.games[payload.game] || { starts: 0, wins: 0, totalReward: 0 };
            data.games[payload.game].starts++;
        }
        if (eventType === 'game_win' && payload.game) {
            data.games[payload.game] = data.games[payload.game] || { starts: 0, wins: 0, totalReward: 0 };
            data.games[payload.game].wins++;
            data.games[payload.game].totalReward += (payload.reward || 0);
        }

        saveData(data);
    }

    // ============================================================
    // СТАРТ СЕССИИ
    // ============================================================
    function startSession() {
        const device = getDeviceInfo();
        const referrer = getReferrer();
        data.totalVisits = (data.totalVisits || 0) + 1;
        data.sessions.push({
            sid: getSessionId(),
            ts: Date.now(),
            referrer,
            ...device
        });
        // Храним последние 200 сессий
        if (data.sessions.length > 200) data.sessions = data.sessions.slice(-200);
        saveData(data);

        track('pageview', { referrer });
    }

    // ============================================================
    // ПУБЛИЧНОЕ API
    // ============================================================
    window.ownAnalytics = {
        track: track,

        // Трекинг игры
        gameStart: (name) => track('game_start', { game: name }),
        gameWin: (name, reward) => track('game_win', { game: name, reward }),
        gameLose: (name) => track('game_lose', { game: name }),

        // Трекинг покупки
        purchase: (item, price) => track('purchase', { item, price }),

        // Трекинг задания
        taskComplete: (taskId, reward) => track('task_complete', { task: taskId, reward }),

        // Получить все данные
        getData: () => data,

        // Очистить всё
        clear: () => {
            data = {
                sessions: [],
                events: [],
                pages: {},
                games: {},
                firstVisit: Date.now(),
                totalVisits: 0
            };
            saveData(data);
        }
    };

    // Стартуем сессию
    startSession();

    console.log('✅ Own analytics loaded');
})();
