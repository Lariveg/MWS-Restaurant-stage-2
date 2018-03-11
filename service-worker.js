let cacheName = 'v2';
let cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './js/main.js',
    './js/restaurant_info.js',
    './js/dbhelper.js',
    './data/restaurants.json'
];


self.addEventListener('install', function(e){
    console.log('[ServiceWorker] Installed');

    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('Caching');
            cache.addAll(cacheFiles);
        })
    )
})

self.addEventListener('activate', function(e){
    console.log('[ServiceWorker] Activated');

    e.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(cacheNames.map(function(currentCacheName){
                if (currentCacheName !== cacheName) {
                    console.log("[ServiceWorker] Removing Cached Files from", currentCacheName);
                    caches.delete(currentCacheName);
                }
            }))      
        })
    )
})

self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetching', e.request.url);

    e.respondWith(

        // caches.match(e.request).then(function(response) {
        //     return response || fetch(e.request);
        // })

        caches.open(cacheName).then(cache => {
            return cache.match(e.request).then(response => {
                // Return response from cache if one exists, otherwise go to network
                return (
                    response ||
                    fetch(e.request, { mode: 'no-cors' }).then(response => {
                        cache.put(e.request, response.clone());
                        return response;
                    })
                );
            });
        })

        // caches.match(e.request).then(function(response) {

        //   if ( response ) {
        //       console.log("[ServiceWorker] Found in Cache", e.request.url);
        //       return response;
        //   }

        //   var requestClone = e.request.clone();

        //   fetch(requestClone).then(function(response) {
        //       if ( !response ){
        //           console.log("[ServiceWorker] No response from fetch");
        //           return;
        //       }

        //       let responseClone = response.clone();

        //       caches.open(cacheName).then(function(cache){
        //           cache.put(e.request, responseClone);
        //           return response;
        //       })
        //   })
        // })
      );
})