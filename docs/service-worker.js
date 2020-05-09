self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static').then(function(cache) {
     return cache.addAll([
        '/','/index.html',
        'resources/scripts/app.js',
        'resources/manifest.json',
        'resources/scripts/database.js',
        'service-worker.js',
        'resources/scripts/main.js',
        'resources/css/style.css',
        'resources/scripts/engine.js',
        'resources/boot/calm_cat.gif'
        ]);
    }).then(function(res){ console.log(res);})
  );
});





self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
});


self.addEventListener('fetch', function(event) {
  console.log(
    'fetch' + event.request
  );
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
