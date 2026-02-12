// ============================================
// SERVICE WORKER - ESTRATEGIA DE CACHÉ
// ============================================

const CACHE_NAME = 'fullbody-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

// ============================================
// EVENTO: INSTALL
// ============================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                self.skipWaiting();
            })
    );
});

// ============================================
// EVENTO: ACTIVATE
// ============================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                self.clients.claim();
            })
    );
});

// ============================================
// EVENTO: FETCH
// ============================================
self.addEventListener('fetch', (event) => {
    // Solo cachear solicitudes GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en caché, devolverlo
                if (response) {
                    return response;
                }

                // Si no está en caché, intentar obtenerlo de la red
                return fetch(event.request)
                    .then((response) => {
                        // No cachear respuestas no-2xx
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonar la respuesta
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Si falla la red y no está en caché, devolver página offline simple
                        console.log('Service Worker: Offline - usando caché');
                        return caches.match('/index.html');
                    });
            })
    );
});

// ============================================
// MANEJO DE MENSAJES
// ============================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
