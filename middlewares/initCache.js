const config = require('config');
const cache = require('express-redis-cache')({
    host: config.get('redis.host'),
    port: config.get('redis.port')
});

module.exports = (req, res, next) => {
    req.cache = cache;
    next();
};
