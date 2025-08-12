const CACHE_NAME = "athan-wake-v1"
const STATIC_CACHE = "athan-wake-static-v1"
const PRAYER_TIMES_CACHE = "athan-wake-prayer-times-v1"

// Files to cache immediately
const STATIC_FILES = [
  "/",
  "/manifest.json",
  // Add other static assets as needed
]

// Install event - cache static files
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_FILES)
      }),
      caches.open(PRAYER_TIMES_CACHE).then((cache) => {
        // Pre-cache today's prayer times
        const today = new Date().toISOString().split("T")[0]
        return cache.put(
          `/api/prayer-times/${today}`,
          new Response(
            JSON.stringify({
              date: today,
              times: {
                fajr: "05:30",
                sunrise: "07:00",
                dhuhr: "12:15",
                asr: "15:45",
                maghrib: "18:30",
                isha: "20:00",
              },
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          ),
        )
      }),
    ]),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== PRAYER_TIMES_CACHE) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle prayer times API requests
  if (url.pathname.startsWith("/api/prayer-times/")) {
    event.respondWith(
      caches.open(PRAYER_TIMES_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Serve from cache
            return response
          }
          // Fetch from network and cache
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(() => {
              // Return offline fallback for prayer times
              return new Response(
                JSON.stringify({
                  error: "Offline",
                  message: "Prayer times unavailable offline",
                }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                },
              )
            })
        })
      }),
    )
    return
  }

  // Handle Athan audio files with lazy loading
  if (url.pathname.includes("/audio/athan/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          // Only fetch audio when actually requested
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
        })
      }),
    )
    return
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).catch(() => {
          // Return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/")
          }
        })
      )
    }),
  )
})

// Background sync for prayer time updates
self.addEventListener("sync", (event) => {
  if (event.tag === "prayer-times-sync") {
    event.waitUntil(updatePrayerTimes())
  }
})

async function updatePrayerTimes() {
  try {
    const today = new Date().toISOString().split("T")[0]
    const response = await fetch(`/api/prayer-times/${today}`)
    if (response.ok) {
      const cache = await caches.open(PRAYER_TIMES_CACHE)
      await cache.put(`/api/prayer-times/${today}`, response.clone())
    }
  } catch (error) {
    console.log("Failed to update prayer times:", error)
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: "/placeholder-qto3w.png",
    badge: "/placeholder-qto3w.png",
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/eye-icon.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/abstract-x-icon.png",
      },
    ],
    requireInteraction: true,
    silent: false,
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"))
  }
})
