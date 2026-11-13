/* MINI 4WD LAB: increment APP_VERSION in every subsequent release. */
const APP_VERSION = '0.8.10';
const CACHE_PREFIX = 'mini4wd-lab-';
const APP_CACHE = CACHE_PREFIX + APP_VERSION;
const SHELL = ['./', './index.html', './app.js?v=0810', './touge-cars.js?v=0810', './body-custom.html', './body-custom.js?v=0810', './course-builder.html', './course-builder.js?v=0810', './vendor/three/three.module.js', './vendor/three/addons/controls/OrbitControls.js', './manifest.webmanifest', './arena_background.jpg', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(SHELL.map(path => new Request(path, {cache: 'reload'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== APP_CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({type:'window'});
    for (const client of clients) client.postMessage({type:'VERSION_READY',version:APP_VERSION});
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req, {cache:'no-store'});
        if (res.ok) (await caches.open(APP_CACHE)).put('./index.html',res.clone());
        return res;
      } catch (_) {
        const fallback=url.pathname.endsWith('/body-custom.html')?'./body-custom.html':'./index.html';
        return (await caches.match(fallback)) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(APP_CACHE);
    // Query strings are release identifiers. Never answer v0810 with an older
    // cached module merely because its pathname is the same.
    const hit = await cache.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) await cache.put(req,res.clone());
      return res;
    } catch (_) { return Response.error(); }
  })());
});
