let cacheName = 'v39';
let cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './js/lazyload.min.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/dbhelper.js',
    './data/restaurants.json',
    './service-worker.js',
    './img/1.webp',
    './img/2.webp',
    './img/3.webp',
    './img/4.webp',
    './img/5.webp',
    './img/6.webp',
    './img/7.webp',
    './img/8.webp',
    './img/9.webp',
    './img/10.webp'
];


self.addEventListener('install', function(e){
    //console.log('[ServiceWorker] Installed');

    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            //console.log('Caching');
            return cache.addAll(cacheFiles);
        })
    )
})

self.addEventListener('activate', function(e){
    //console.log('[ServiceWorker] Activated');

    e.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(cacheNames.map(function(currentCacheName){
                if (currentCacheName !== cacheName) {
                    //console.log("[ServiceWorker] Removing Cached Files from", currentCacheName);
                    caches.delete(currentCacheName);
                }
            }))      
        })
    )
})

self.addEventListener('fetch', function(e){
    //console.log('[ServiceWorker] Fetching', e.request.url);
    if(e.request.method === "GET"){
        e.respondWith(
            
            caches.open(cacheName).then(cache => {
                return cache.match(e.request).then(response => {
                    // Return response from cache if one exists, otherwise go to network
                    return (
                        response || 
                        fetch(e.request).then(response => {
                            cache.put(e.request, response.clone());
                            return response;
                        })
                        .catch(function (err) {
                            console.log("[ServiceWorker]Error fetching and caching", err);
                        })
                    );
                });
            })
        );
    }
    
})