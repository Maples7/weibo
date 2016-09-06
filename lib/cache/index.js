const config = require('config');
const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis');
const Promise = require('bluebird');

const TIME = require('../../enums/time');

let redisCache = cacheManager.caching({
    store: redisStore, 
    db: config.get('redis.db'), 
    ttl: TIME.HOUR,
});
let memoryCache = cacheManager.caching({
    store: 'memory', 
    max: 1000, 
    ttl: TIME.HOUR,
});

module.exports = Promise.promisifyAll(cacheManager.multiCaching([memoryCache, redisCache]));
