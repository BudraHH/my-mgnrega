const NodeCache = require('node-cache')
const cache = new NodeCache({stdTTL: 3600});

function cacheMiddleware(req, res, next) {
    const key = `${req.path}:${JSON.stringify(req.query)}`;

    if(cache.has(key)) {
        console.log('Cache hit:', key);
        return res.json(cache.get(key));
    }

    res.join = (function(original) {
        return function(data) {
            cache.set(key, data);
            return original.call(this, data);
        };
    })(res.json);

    next();
}

module.exports = cacheMiddleware;