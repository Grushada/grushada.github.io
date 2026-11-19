// ============================================================
// VERCEL WEB ANALYTICS
// Official tracking script for Vercel Analytics
// Documentation: https://vercel.com/docs/analytics/quickstart
// ============================================================

(function() {
    'use strict';

    // Initialize Vercel Analytics
    window.va = window.va || function() {
        (window.vaq = window.vaq || []).push(arguments);
    };

    // Load the Vercel Analytics script
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    
    // Insert the script into the page
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.head.appendChild(script);
    }

    console.log('✅ Vercel Analytics loaded');
})();
