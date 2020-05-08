var Build=9600;

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static').then(function(cache) {
      cache.addAll([
        '/', '/index.html',
        'resources/scripts/app.js',
        'resources/manifest.json',
        'resources/scripts/database.js',
        'resources/scripts/service-worker.js',
        'resources/scripts/main.js',
        'resources/css/style.css',
        'resources/database/est_bix.js',
        'resources/scripts/engine.js',
        'resources/boot/calm_cat.gif',
        'resources/splash/apple-launch-750x1334.png',
        'resources/splash/apple-launch-828x1792.png',
        'resources/splash/apple-launch-1125x1792.png',
        'resources/splash/apple-launch-1242x2688.png',
        'resources/splash/apple-launch-1536x2048.png',
        'resources/splash/apple-launch-1668x2224.png',
        'resources/splash/apple-launch-1668x2338.png',
        'resources/splash/apple-launch-2048x2732.png'

        ];);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function(res) {
          return caches.open('dynamic').then(function(cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
