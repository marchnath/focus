// const CACHE_NAME = "nottifly-v1";
// const urlsToCache = [
//   "/",
//   "/manifest.json",
//   "/icons100.png",
//   "/_next/static/css/app/layout.css",
//   "/favicon.ico",
// ];

// // Install event
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
//   self.skipWaiting();
// });

// // Activate event
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
//   self.clients.claim();
// });

// // Fetch event
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return cached version or fetch from network
//       return (
//         response ||
//         fetch(event.request).then((fetchResponse) => {
//           // Check if we received a valid response
//           if (
//             !fetchResponse ||
//             fetchResponse.status !== 200 ||
//             fetchResponse.type !== "basic"
//           ) {
//             return fetchResponse;
//           }

//           // Clone the response
//           const responseToCache = fetchResponse.clone();

//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseToCache);
//           });

//           return fetchResponse;
//         })
//       );
//     })
//   );
// });
