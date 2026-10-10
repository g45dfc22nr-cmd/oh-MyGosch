// Offline-Speicher für die App-Dateien. Deine Einträge liegen nicht hier, sondern im Speicher der App auf dem Gerät.
const CACHE = "ohmygosch-v4.6";
const FILES = ["./", "./index.html", "./stundenzettel.html", "./brandmelde.html", "./urlaub.html", "./leitfaden.html", "./satfinder.html", "./netzwerk.html", "./elektro.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./pdf.js", "./pdf.worker.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "no-store"}))))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    // immer direkt bei GitHub nachfragen (kein 10-Minuten-Zwischenspeicher), offline aus dem Gerätespeicher
    fetch(e.request.url, {cache: "no-store", credentials: "same-origin"}).then(r => { if(r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("./index.html")))
  );
});
