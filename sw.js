/* İş Takip servis çalışanı: uygulama olarak yüklenebilirlik + bildirim tıklaması.
   Önce ağdan alır (güncellemeler hemen gelsin), ağ yoksa son kopyayı gösterir. */
var CACHE = 'is-takip-shell-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(req, copy); });
      return res;
    }).catch(function(){ return caches.match(req).then(function(r){ return r || caches.match('./'); }); })
  );
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(list){
    for(var i = 0; i < list.length; i++){ if('focus' in list[i]) return list[i].focus(); }
    return self.clients.openWindow('./');
  }));
});
