// Service Worker PWA para Caching Offline da Pizzaria Anne & Tom
const CACHE_NAME = "annetom-pwa-cache-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/cardapio",
  "/logopizzaria.png",
  "/manifest.json",
  "/favicon.ico",
];

// Instalação do SW e Caching dos assets essenciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA SW] Pré-carregando assets estáticos em cache");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA SW] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia Network-First com fallback para Cache (apenas para same-origin)
self.addEventListener("fetch", (event) => {
  // Ignora requisições de API, métodos não-GET ou domínios de terceiros (ex: Meta Pixel, Cloudflare)
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/api/") ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          const acceptHeader = event.request.headers.get("accept") || "";
          if (acceptHeader.includes("text/html")) {
            return caches.match("/");
          }
          // Garante sempre o retorno de um objeto Response válido
          return new Response("", { status: 503, statusText: "Service Unavailable" });
        });
      })
  );
});
