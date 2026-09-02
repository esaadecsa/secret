const CACHE = "hbd-v9";
const CORE = ["./", "./index.html", "./style.css", "./script.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Always try fresh app code first; cache is the offline fallback.
  const isAppCode = /\.(html?|css|js)$/i.test(url.pathname) || url.pathname.endsWith("/");
  event.respondWith(
    isAppCode
      ? fetch(req).then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
      : caches.match(req).then((cached) => cached || fetch(req).then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        }))
  );
});
