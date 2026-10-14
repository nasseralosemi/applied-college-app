// Self-unregistering Service Worker
// Automatically clears caches and unregisters to ensure live Vite modules load directly without caching issues
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Do not intercept or cache fetch requests
self.addEventListener('fetch', () => {
  // Pass through to network
});
