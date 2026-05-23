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
  
  let data;
  try {
    data = e.data.json();
  } catch {
    data = { title: 'Mi Turno Concilia', body: e.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: '/Turno-concilia/icon-192.png',
    badge: '/Turno-concilia/icon-192.png',
    tag: data.tag || 'miturno',
    data: { url: data.url || '/Turno-concilia/' },
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  e.waitUntil(
    self.registration.showNotification(data.title || 'Mi Turno Concilia', options)
  );
});

// Clic en la notificación — abrir la app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/Turno-concilia/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('Turno-concilia') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
