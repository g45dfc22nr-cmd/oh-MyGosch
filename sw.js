// Offline-Speicher für die App-Dateien. Deine Einträge liegen nicht hier, sondern im Speicher der App auf dem Gerät.
const CACHE = "ohmygosch-v2.1";
const FILES = ["./", "./index.html", "./stundenzettel.html", "./brandmelde.html", "./urlaub.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./pdf.js", "./pdf.worker.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("./index.html")))
  );
});
