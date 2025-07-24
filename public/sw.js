const CACHE_NAME = 'narkins-builders-v1';
const urlsToCache = [
  '/',
  '/hill-crest-residency',
  '/narkins-boutique-residency',
  '/about',
  '/blog',
  '/completed-projects',
  '/manifest.json',
  '/offline.html',
  '/images/narkins-builders-logo.webp',
  '/favicon.ico',
  '/images/narkins-builders-logo.webp'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If offline and no cache, show offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      }
    )
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync logic here
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/images/narkins-builders-logo.webp',
    badge: '/images/narkins-builders-logo.webp',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Projects',
        icon: '/images/narkins-builders-logo.webp'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/narkins-builders-logo.webp'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Narkin\'s Builders', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});