const CACHE = 'jm-studio-v1';
const ARCHIVOS = ['/', '/index.html', '/styles.css', '/script.js', '/icon.jpeg'];

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ARCHIVOS))
));

self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
));
