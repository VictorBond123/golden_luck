"use strict";
var precacheConfig = [
    ["/index.html", "af0accdaa7e8c51d1dd21636bc8e5f59"],
    ["/static/css/main.2c9a1367.css", "79c0f489580f45f29f3a7352739fbfbb"],
    ["/static/js/main.4f786886.js", "ca46ec8b21462e0b52bc112996ebafe6"],
    [
      "/static/media/PTSans-Bold.e9c53d8c.woff",
      "e9c53d8c945838538b31faf0edd70745",
    ],
    [
      "/static/media/PTSans-Regular.3f40ccfd.woff",
      "3f40ccfd35207c3629cba01c8db1082a",
    ],
    ["/static/media/click.b2da77ac.mp3", "b2da77acaaf315446c7ee96b7026736b"],
    ["/static/media/done.78dccfdb.mp3", "78dccfdb37e2486661a3126b424a40c5"],
    ["/static/media/error.16d31e4f.mp3", "16d31e4f55b83d2beae1abe1aa70cbab"],
    ["/static/media/win.604373c9.mp3", "604373c9fe8af4fa0ca994d7dd00e159"],
  ],
  cacheName =
    "sw-precache-v3-sw-precache-webpack-plugin-" +
    (self.registration ? self.registration.scope : ""),
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function (e, t) {
    var n = new URL(e);
    return "/" === n.pathname.slice(-1) && (n.pathname += t), n.toString();
  },
  cleanResponse = function (t) {
    return t.redirected
      ? ("body" in t ? Promise.resolve(t.body) : t.blob()).then(function (e) {
          return new Response(e, {
            headers: t.headers,
            status: t.status,
            statusText: t.statusText,
          });
        })
      : Promise.resolve(t);
  },
  createCacheKey = function (e, t, n, r) {
    var a = new URL(e);
    return (
      (r && a.pathname.match(r)) ||
        (a.search +=
          (a.search ? "&" : "") +
          encodeURIComponent(t) +
          "=" +
          encodeURIComponent(n)),
      a.toString()
    );
  },
  isPathWhitelisted = function (e, t) {
    if (0 === e.length) return !0;
    var n = new URL(t).pathname;
    return e.some(function (e) {
      return n.match(e);
    });
  },
  stripIgnoredUrlParameters = function (e, n) {
    var t = new URL(e);
    return (
      (t.hash = ""),
      (t.search = t.search
        .slice(1)
        .split("&")
        .map(function (e) {
          return e.split("=");
        })
        .filter(function (t) {
          return n.every(function (e) {
            return !e.test(t[0]);
          });
        })
        .map(function (e) {
          return e.join("=");
        })
        .join("&")),
      t.toString()
    );
  },
  hashParamName = "_sw-precache",
  urlsToCacheKeys = new Map(
    precacheConfig.map(function (e) {
      var t = e[0],
        n = e[1],
        r = new URL(t, self.location),
        a = createCacheKey(r, hashParamName, n, /\.\w{8}\./);
      return [r.toString(), a];
    })
  );
function setOfCachedUrls(e) {
  return e
    .keys()
    .then(function (e) {
      return e.map(function (e) {
        return e.url;
      });
    })
    .then(function (e) {
      return new Set(e);
    });
}
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function (r) {
        return setOfCachedUrls(r).then(function (n) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function (t) {
              if (!n.has(t)) {
                var e = new Request(t, { credentials: "same-origin" });
                return fetch(e).then(function (e) {
                  if (!e.ok)
                    throw new Error(
                      "Request for " +
                        t +
                        " returned a response with status " +
                        e.status
                    );
                  return cleanResponse(e).then(function (e) {
                    return r.put(t, e);
                  });
                });
              }
            })
          );
        });
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
}),
  self.addEventListener("activate", function (e) {
    var n = new Set(urlsToCacheKeys.values());
    e.waitUntil(
      caches
        .open(cacheName)
        .then(function (t) {
          return t.keys().then(function (e) {
            return Promise.all(
              e.map(function (e) {
                if (!n.has(e.url)) return t.delete(e);
              })
            );
          });
        })
        .then(function () {
          return self.clients.claim();
        })
    );
  }),
  self.addEventListener("fetch", function (t) {
    if ("GET" === t.request.method) {
      var e,
        n = stripIgnoredUrlParameters(
          t.request.url,
          ignoreUrlParametersMatching
        ),
        r = "index.html";
      (e = urlsToCacheKeys.has(n)) ||
        ((n = addDirectoryIndex(n, r)), (e = urlsToCacheKeys.has(n)));
      var a = "/index.html";
      !e &&
        "navigate" === t.request.mode &&
        isPathWhitelisted(["^(?!\\/__).*"], t.request.url) &&
        ((n = new URL(a, self.location).toString()),
        (e = urlsToCacheKeys.has(n))),
        e &&
          t.respondWith(
            caches
              .open(cacheName)
              .then(function (e) {
                return e.match(urlsToCacheKeys.get(n)).then(function (e) {
                  if (e) return e;
                  throw Error(
                    "The cached response that was expected is missing."
                  );
                });
              })
              .catch(function (e) {
                return (
                  console.warn(
                    'Couldn\'t serve response for "%s" from cache: %O',
                    t.request.url,
                    e
                  ),
                  fetch(t.request)
                );
              })
          );
    }
  });
