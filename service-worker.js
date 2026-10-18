const CACHE_NAME = "uang-kardus-v2-5";
const APP_FILES = ["./", "./index.html", "./assets/style.css", "./assets/app.js", "./assets/icon.svg", "./manifest.webmanifest"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("uang-kardus-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
 if (event.request.method !== "GET") return;
 const url = new URL(event.request.url);
 if (url.origin !== self.location.origin) return;
 const isAppFile = url.pathname.endsWith("/assets/app.js") || url.pathname.endsWith("/assets/style.css") || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/service-worker.js");
 if (isAppFile) {
  event.respondWith(fetch(event.request, {cache:"no-store"}).then(response => { if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); } return response; }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html"))));
  return;
 }
 event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); } return response; }).catch(() => caches.match("./index.html"))));
});
