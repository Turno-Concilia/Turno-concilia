// Mi Turno Concilia — Service Worker v4
const CACHE_NAME = 'miturno-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
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
