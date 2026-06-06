// Mi Turno Concilia — Service Worker
const CACHE_NAME = 'miturno-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
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
