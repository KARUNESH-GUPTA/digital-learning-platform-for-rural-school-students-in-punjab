// Service Worker for Education Platform
// Provides offline functionality and performance optimization

const CACHE_NAME = 'education-platform-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/images/logo.png',
    '/images/hero-education.jpg',
    '/manifest.json'
];

// Install event - Cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - Serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (!request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }
                
                // Fetch from network and cache dynamic content
                return fetch(request)
                    .then((networkResponse) => {
                        // Don't cache if response is not valid
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone response for caching
                        const responseToCache = networkResponse.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                console.log('Service Worker: Caching dynamic content', request.url);
                                cache.put(request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed', error);
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');
    
    if (event.tag === 'background-sync-form') {
        event.waitUntil(
            // Handle offline form submissions
            handleOfflineFormSubmissions()
        );
    }
});

// Handle offline form submissions
async function handleOfflineFormSubmissions() {
    const offlineSubmissions = await getOfflineSubmissions();
    
    for (const submission of offlineSubmissions) {
        try {
            await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submission.data)
            });
            
            // Remove successful submission from offline storage
            await removeOfflineSubmission(submission.id);
            console.log('Service Worker: Offline submission sent successfully');
            
        } catch (error) {
            console.error('Service Worker: Failed to send offline submission', error);
        }
    }
}

// Get offline form submissions from IndexedDB
async function getOfflineSubmissions() {
    // Implementation would depend on your offline storage strategy
    // This is a placeholder
    return [];
}

// Remove offline submission from storage
async function removeOfflineSubmission(id) {
    // Implementation would depend on your offline storage strategy
    // This is a placeholder
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'नया notification आया है!',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'खोलें',
                icon: '/images/logo.png'
            },
            {
                action: 'close',
                title: 'बंद करें'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Education Platform', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// Update notification
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        // Notify user about update
        self.registration.showNotification('Update Available', {
            body: 'एक नया version उपलब्ध है। Page को refresh करें।',
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            tag: 'update-available',
            actions: [
                {
                    action: 'refresh',
                    title: 'Refresh'
                }
            ]
        });
    }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
    // Monitor performance metrics
    const startTime = Date.now();
    
    event.waitUntil(
        event.response.then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            // Log slow responses
            if (responseTime > 1000) {
                console.warn(`Slow response: ${event.request.url} took ${responseTime}ms`);
            }
            
            return response;
        })
    );
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});