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
    // Only cache GET requests (HTML, CSS, JS), bypass API calls so data is always fresh
    if (event.request.method !== 'GET' || event.request.url.includes('/api/')) return;
    
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
