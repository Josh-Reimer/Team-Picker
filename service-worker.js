'use strict';
// Cache store name to save static resources - add version number
const CACHE_STATIC = 'static-cache-v3';
// Add cache version list to help with cleanup
const CACHE_VERSIONS = ['static-cache-v1', 'static-cache-v2', 'static-cache-v3'];
// Minimal set of files to cache to be a PWA

/*
When you need to update cached resources:
Increment the version in CACHE_STATIC (e.g., to static-cache-v3)
Add the new version to CACHE_VERSIONS
3. The service worker will automatically clean up old caches on activation
This ensures that when you deploy updates, users will get the new resources rather than serving outdated versions from cache.
*/

const FILES_TO_CACHE = [
    './',
    './images/icon-192x192.png',
    './images/icon-512x512.png',
    './images/icon-72x72.png', 
    './images/icon-128x128.png',
    './images/icon-144x144.png',
    './index.html',
    './manifest.json',
    './app.js'
];

// FUNCS

/**
 * When a service worker is initially registered, pages won't use it until they next load. The claim() method causes
 * those pages to be controlled immediately.
 *
 * @param {ExtendableEvent} evt
 */
function onActivate(evt) {
    console.log(`SW: send 'claim' message to the clients.`);
    evt.waitUntil(
        Promise.all([
            // Delete old cache versions
            caches.keys().then(keys => {
                return Promise.all(
                    keys.map(key => {
                        if (!CACHE_VERSIONS.includes(key)) {
                            console.log(`SW: deleting old cache ${key}`);
                            return caches.delete(key);
                        }
                    })
                );
            }),
            // Claim clients
            self.clients.claim()
        ])
    );
}

/**
 * Return static resource from cache (if exists) or fetch from network.
 * @param {FetchEvent} evt
 */
function onFetch(evt) {
    // FUNCS
    async function cacheOrFetch(req) {
        const cache = await self.caches.open(CACHE_STATIC);
        const cachedResponse = await cache.match(req);
        return cachedResponse ?? await fetch(req);
    }

    // MAIN
    console.log(`SW: fetch '${evt.request}'.`);
    evt.respondWith(cacheOrFetch(evt.request));
}

/**
 * Load and store required static resources on installation.
 * @param {ExtendableEvent} evt
 */
function onInstall(evt) {
    // FUNCS
    async function cacheStaticFiles() {
        const cacheStat = await caches.open(CACHE_STATIC);
        // load all resources at the same time (parallel)
        await Promise.all(
            FILES_TO_CACHE.map(function (url) {
                return cacheStat.add(url).catch(function (reason) {
                    console.log(`'${url}' failed: ${String(reason)}`);
                });
            })
        );
    }

    // MAIN
    console.log(`SW: cache app shell on install.`);
    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}

// MAIN
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
self.addEventListener('install', onInstall);
