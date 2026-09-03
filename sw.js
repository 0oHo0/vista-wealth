/* ============================================================
   Service Worker — 全量离线缓存（cache-first）
   改了任何静态文件后，把 CACHE 版本号 +1，客户端会自动换新。
   ============================================================ */
const CACHE = "vista-wealth-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./product.html",
  "./manifest.webmanifest",
  "./assets/styles.css",
  "./assets/i18n.js",
  "./assets/app.js",
  "./assets/product.js",
  "./assets/pwa.js",
  "./assets/vendor/echarts.min.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-48.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] pre-cache partial:", err))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 跨源不拦截

  // cache-first：命中缓存直接返回，同时后台刷新（stale-while-revalidate）
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
