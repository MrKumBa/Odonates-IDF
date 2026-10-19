// Change ce numéro si tu remplaces des photos ou le code, pour forcer la mise à jour.
const CACHE = "odonates-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "index.html", "manifest.json", "icon.svg"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const save = r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; };
  if (e.request.destination === "image") {
    // photos : récupérées une seule fois, puis gardées sur le téléphone
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(save)));
  } else {
    // code : toujours la dernière version si connecté
    e.respondWith(fetch(e.request).then(save).catch(() => caches.match(e.request)));
  }
});
