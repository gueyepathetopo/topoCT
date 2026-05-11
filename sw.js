const CACHE = 'topoCT-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap'
];

// INSTALL — mise en cache de tous les assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// ACTIVATE — suppression des anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH — stratégie Cache First avec fallback réseau
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => {
        if (e.request.destination === 'document') return caches.match('./index.html');
      });
    })
  );
});

// SYNC EN ARRIÈRE-PLAN — synchronisation quand connexion rétablie
self.addEventListener('sync', e => {
  if (e.tag === 'sync-receptions') {
    e.waitUntil(syncPendingData());
  }
});

// Envoi de messages aux clients
function notifyClients(msg) {
  self.clients.matchAll().then(clients =>
    clients.forEach(c => c.postMessage(msg))
  );
}

async function syncPendingData() {
  try {
    const db = await openDB();
    const pending = await getAllPending(db);
    if (!pending.length) return;
    for (const item of pending) {
      try {
        const res = await fetch('./api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (res.ok) await deletePending(db, item.id);
      } catch {}
    }
    notifyClients({ type: 'SYNC_DONE', count: pending.length });
  } catch {}
}

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('topoCT', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pending'))
        db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = reject;
  });
}
function getAllPending(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending', 'readonly');
    const req = tx.objectStore('pending').getAll();
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = reject;
  });
}
function deletePending(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending', 'readwrite');
    tx.objectStore('pending').delete(id);
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
}
