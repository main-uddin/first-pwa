console.log('WORKER: executing.')

const version = 'v4::'

self.addEventListener('install', function (event) {
  console.log('WORKER: install event in progress.')
  event.waitUntil(
    fetch('asset-manifest.json')
      .then(res => res.json())
      .then(files => Object.values(files))
      .then(files =>
        caches.open(version + 'first-pwa').then(function (cache) {
          return cache.addAll(files)
        })
      )
      .then(function () {
        console.log('WORKER: install completed')
      })
  )
})

self.addEventListener('fetch', function (event) {
  console.log('WORKER: fetch event in progress.')
  if (event.request.method !== 'GET') {
    console.log(
      'WORKER: fetch event ignored.',
      event.request.method,
      event.request.url
    )
    return
  }
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return fetch(event.request)
        .then(function fetchedFromNetwork (response) {
          var cacheCopy = response.clone()
          console.log('WORKER: fetch response from network.', event.request.url)

          caches
            .open(version + 'pages')
            .then(function add (cache) {
              return cache.put(event.request, cacheCopy)
            })
            .then(function () {
              console.log(
                'WORKER: fetch response stored in cache.',
                event.request.url
              )
            })

          return response
        })
        .catch(function unableToResolve () {
          if (cached) {
            console.log('WORKER: fetch event (cached)', event.request.url)
            return cached
          }
          console.log('WORKER: fetch request failed in both cache and network.')
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          })
        })
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('WORKER: activate event in progress.')

  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version)
            })
            .map(function (key) {
              return caches.delete(key)
            })
        )
      })
      .then(function () {
        console.log('WORKER: activate completed.')
      })
  )
})

const applicationServerPublicKey =
  'AAAAMAkl1BM:APA91bFuNgVCp99kUKYwhPXzzp9rD-cz7BzSlMkpL-Z1mKj_JrwFO1PWBXzn-' +
  '_7YUKG__r0fEFFLXefNHUrbpnhy7ImXELVCkYpH7YQywsqe' +
  'H8Ot7bkLUYbxDrHzkNN_OPXPyrElIqOR'

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

self.addEventListener('push', function (event) {
  let data = {}
  if (event.data) {
    data = event.data.json()
  }
  const title = data.title || 'Something Has Happened'
  const body = data.message || "Here's something you might want to check out."

  const options = {
    body,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log("[Service Worker]: 'pushsubscriptionchange' event fired.")
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })
      .then(function (newSubscription) {
        // TODO: Send to application server
        console.log('[Service Worker] New subscription: ', newSubscription)
      })
  )
})
