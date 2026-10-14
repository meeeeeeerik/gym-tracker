// Офлайн-режим: страница берётся из сети, а если сети нет — из кэша.
const CACHE = "gym-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // данные Supabase никогда не кэшируем
  if (url.hostname.endsWith("supabase.co")) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname === "cdn.jsdelivr.net")) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});
