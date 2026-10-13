// ============================================================
// ANALYTICS & ADS LOADER
// Подключает: Cloudflare, VK/Mail.Ru, Yandex Metrika, Google Analytics,
// Microsoft Clarity, Yandex Ads, Google AdSense
// Использование: <script src="analytics.js"></script>
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // КОНФИГ — меняй токены здесь
    // ============================================================
    const CONFIG = {
        cloudflare: {
            enabled: true,
            token: '3ebec1141d45447b877532dd1a142113'
        },
        mailru: {
            enabled: true,
            id: '3787033'
        },
        yandexMetrika: {
            enabled: true,
            id: '110413717'
        },
        googleAnalytics: {
            enabled: true,
            id: 'G-GYRZDGVW3V'
        },
        clarity: {
            enabled: true,
            id: 'xn0ggpvg0m'
        },
        yandexAds: {
            enabled: true,
            pageId: '19726090'
        },
        googleAdsense: {
            enabled: true,
            client: 'ca-pub-4228536607258228'
        }
    };

    // ============================================================
    // 1. CLOUDFLARE INSIGHTS
    // ============================================================
    if (CONFIG.cloudflare.enabled) {
        const s = document.createElement('script');
        s.type = 'module';
        s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        s.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cloudflare.token }));
        document.head.appendChild(s);
    }

    // ============================================================
    // 2. VK / TOP.MAIL.RU (MyTarget)
    // ============================================================
    if (CONFIG.mailru.enabled) {
        const _tmr = window._tmr || (window._tmr = []);
        _tmr.push({ id: CONFIG.mailru.id, type: 'pageView', start: (new Date()).getTime() });
        (function(d, w, id) {
            if (d.getElementById(id)) return;
            const ts = d.createElement('script');
            ts.type = 'text/javascript';
            ts.async = true;
            ts.id = id;
            ts.src = 'https://top-fwz1.mail.ru/js/code.js';
            const f = function() {
                const s = d.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ts, s);
            };
            if (w.opera == '[object Opera]') {
                d.addEventListener('DOMContentLoaded', f, false);
            } else { f(); }
        })(document, window, 'tmr-code');
    }

    // ============================================================
    // 3. YANDEX METRIKA
    // ============================================================
    if (CONFIG.yandexMetrika.enabled) {
        (function(m, e, t, r, i, k, a) {
            m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
            m[i].l = 1 * new Date();
            for (let j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) return;
            }
            k = e.createElement(t); a = e.getElementsByTagName(t)[0];
            k.async = 1; k.src = r;
            a.parentNode.insertBefore(k, a);
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

        window.ym(CONFIG.yandexMetrika.id, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        });
    }

    // ============================================================
    // 4. GOOGLE ANALYTICS (GA4)
    // ============================================================
    if (CONFIG.googleAnalytics.enabled) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.googleAnalytics.id;
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', CONFIG.googleAnalytics.id);
    }

    // ============================================================
    // 5. MICROSOFT CLARITY
    // ============================================================
    if (CONFIG.clarity.enabled) {
        (function(c, l, a, r, i, t, y) {
            c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r);
            t.async = 1;
            t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CONFIG.clarity.id);
    }

    // ============================================================
    // 6. YANDEX ADS
    // ============================================================
    if (CONFIG.yandexAds.enabled) {
        const ctx = document.createElement('script');
        ctx.src = 'https://yandex.ru/ads/system/context.js';
        ctx.async = true;
        document.head.appendChild(ctx);

        const loader = document.createElement('script');
        loader.src = 'https://yandex.ru/ads/system/ap-loader.js';
        loader.async = true;
        loader.setAttribute('data-page-id', CONFIG.yandexAds.pageId);
        document.head.appendChild(loader);
    }

    // ============================================================
    // 7. GOOGLE ADSENSE
    // ============================================================
    if (CONFIG.googleAdsense.enabled) {
        const meta = document.createElement('meta');
        meta.name = 'google-adsense-account';
        meta.content = CONFIG.googleAdsense.client;
        document.head.appendChild(meta);

        const ads = document.createElement('script');
        ads.async = true;
        ads.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CONFIG.googleAdsense.client;
        ads.crossOrigin = 'anonymous';
        document.head.appendChild(ads);
    }

    // ============================================================
    // Утилита: ручное событие (для трекинга)
    // ============================================================
    window.trackEvent = function(category, action, label, value) {
        // Yandex Metrika
        if (window.ym && CONFIG.yandexMetrika.enabled) {
            window.ym(CONFIG.yandexMetrika.id, 'reachGoal', action, { category: category, label: label, value: value });
        }
        // Google Analytics
        if (window.gtag && CONFIG.googleAnalytics.enabled) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        // VK
        if (window._tmr && CONFIG.mailru.enabled) {
            window._tmr.push({ type: 'reachGoal', id: CONFIG.mailru.id, goal: action });
        }
    };

    // Автотрекинг игр (если есть глобальная функция showToast — хукаем)
    document.addEventListener('DOMContentLoaded', function() {
        // Трекаем запуск игр
        const originalSetActiveGame = window.setActiveGame;
        if (typeof originalSetActiveGame === 'function') {
            window.setActiveGame = function(name) {
                window.trackEvent('game', 'start', name);
                return originalSetActiveGame.apply(this, arguments);
            };
        }
    });

    console.log('✅ Analytics loaded');
})();
