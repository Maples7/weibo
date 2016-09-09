const config = require('config');
module.exports = new (require('node-redis-cache'))({
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    db: config.get('redis.db')
});
