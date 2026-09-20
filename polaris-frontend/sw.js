const CACHE_NAME = 'polaris-pwa-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/cargo.html',
    '/inventory.html',
    '/personnel.html',
    '/emergency.html',
    '/css/main.css',
    '/js/api.js',
    '/js/auth.js',
    '/js/map.js',
    '/js/cargo.js',
    '/js/emergency.js',
    '/js/db.js',
    '/js/satellite.js',
    '/js/websocket.js',
    '/satellite.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // 0. Bypass WebSocket / SockJS endpoints entirely
    if (event.request.url.includes('/ws-emergency')) return;

    // 1. API GET requests: Network First, fallback to Cache
    if (event.request.method === 'GET' && event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request).then(fetchRes => {
                const clone = fetchRes.clone();
                caches.open('polaris-api-cache').then(cache => cache.put(event.request, clone));
                return fetchRes;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    // API POST/PUT bypass cache completely (handled by api.js IndexedDB queue)
    if (event.request.method !== 'GET') return;
    
    // 2. Map tiles caching strategy (Cache First, fallback to Network)
    if (event.request.url.includes('tile') || event.request.url.includes('MapServer') || event.request.url.includes('cartocdn')) {
        event.respondWith(
            caches.match(event.request).then(cachedRes => {
                if (cachedRes) return cachedRes;
                return fetch(event.request).then(fetchRes => {
                    return caches.open('polaris-maps-v1').then(cache => {
                        cache.put(event.request, fetchRes.clone());
                        return fetchRes;
                    });
                }).catch(() => { /* Offline and no tile */ });
            })
        );
        return;
    }

    // 3. Default Cache First for UI assets (HTML, CSS, JS)
    event.respondWith(
        caches.match(event.request).then(cachedRes => {
            return cachedRes || fetch(event.request).then(fetchRes => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => caches.match('/index.html'))
    );
});
