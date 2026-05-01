// Minimal service worker for mobile notifications
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || 'Smart Queue';
  const options = {
    body: data.body || 'Your turn has arrived!',
    icon: '/vite.svg',
    badge: '/vite.svg'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
