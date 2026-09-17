// 학생 생활지도 관리 — 서비스 워커
// 항상 최신 파일을 먼저 받아오고, 인터넷이 끊겼을 때만 저장해 둔 화면을 보여줍니다.
// 서버(Apps Script) 요청은 건드리지 않습니다.
const CACHE = 'guidance-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  e.respondWith((async () => {
    try {
      // no-cache: GitHub Pages 캐시 때문에 옛 화면이 뜨는 문제를 막습니다.
      const res = await fetch(req.url, { cache: 'no-cache' });
      if (res.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  })());
});
