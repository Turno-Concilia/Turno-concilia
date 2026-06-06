// Mi Turno Concilia — Service Worker
const CACHE_NAME = 'miturno-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Limpiar cachés antiguas
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// No cachear — siempre red para el index.html
self.addEventListener('fetch', e => {
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/')) {
    e.respondWith(fetch(e.request));
    return;
  }
});

// Recibir notificación push
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'Mi Turno Concilia', {
      body: data.body || '',
      icon: '/Turno-concilia/icon-192.png',
      badge: '/Turno-concilia/icon-192.png',
      tag: data.tag || 'miturno',
      data: { url: '/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/Turno-concilia/'));
});
