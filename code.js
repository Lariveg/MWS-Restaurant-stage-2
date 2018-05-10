key = AIzaSyBdSMIDmiIAtSMx6DurLOH7tPqpHTIdK_E
AIzaSyCkztJBGXVEEZPAtlOkFhUT1CrKSi1WJg4

// self.addEventListener('fetch', event => {
//     event.respondWith(
//       caches.open(currentCacheVersion).then(cache => {
//         return cache.match(event.request).then(response => {
//           // Return response from cache if one exists, otherwise go to network
//           return (
//             response ||
//             fetch(event.request, { mode: 'no-cors' }).then(response => {
//               cache.put(event.request, response.clone());
//               return response;
//             })
//           );
//         });
//       })
//     );
// });

// window.onload = function () { const iframe = document.querySelector('iframe'); iframe.title = "Google Maps"; }