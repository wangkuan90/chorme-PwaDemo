
let cacheName = 'pwa-demo-assets';
// let imgCacheName = 'pwa-img';
let filesToCache;

filesToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/img/48.png',
    '/img/96.png',
    '/img/192.png',
    '/manifest.json'
];

self.addEventListener('install', function (e) {
    console.log('sw install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('sw install');
            return cache.addAll(filesToCache);
        }, function (err) {
            console.log(err);
        })
    );
});

// 更新缓存
self.addEventListener('activate', function (e) {
    caches.delete(cacheName);
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});

// 监听推送事件 然后显示通知
self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: 'img/48.png',
        badge: 'img/48.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// 监听通知的点击事件
self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/') // eslint-disable-line
    );
});
