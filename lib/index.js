var Redis = require('ioredis');

var debug = require('debug')('ioredis-koa');

var RedisStore = function (options) {
  if (!(this instanceof RedisStore)) {
    return new RedisStore(options);
  }

  var client;
  options = options || {};
  options.auth_pass = options.auth_pass || options.pass || null; // For backwards compatibility

  options.path = options.path || options.socket || null; // For backwards compatibility

  if (!options.client) {
    debug('Init redis new client');
    client = options.rediscluster ? new Redis.Cluster(options.rediscluster) : new Redis(options.redis || options);
  } else {
    if (options.duplicate) {
      debug('Duplicating provided client with new options (if provided)');
      var dupClient = options.client;
      delete options.client;
      delete options.duplicate;
      client = dupClient.duplicate(options);
    } else {
      debug('Using provided client');
      client = options.client;
    }
  }

  if (options.db) {
    debug('selecting db %s', options.db);
    client.select(options.db);
    client.on('connect', function () {
      client.send_anyways = true;
      client.select(options.db);
      client.send_anyways = false;
    });
  }

  this.get = function (sid, cb) {
    return new Promise(function (res) {
      client.get(sid, function (err, result) {
        if (err) res(err);

        try {
          result = JSON.parse(result);
        } catch (e) {}

        if (typeof cb === 'function') {
          cb(err, result);
        }

        res(result);
      });
    });
  };

  this.set = function (...args) {
    return new Promise(function (res) {
      try {
        args[1] = JSON.stringify(args[1]);
      } catch (e) {}

      if (typeof args[2] === 'number') {
        res(client.setex(args[0], Math.ceil(args[2] / 1000), args[1]).catch(e => debug('set error %s', e)));
      } else {
        res(client.set(...args).catch(e => debug('set error %s', e)));
      }
    });
  };

  this.destory = client.del;
  client.on('error', err => debug('client on error', err));
  Object.setPrototypeOf(this, client);
  debug('redis client created %s', options.redis && options.redis.prefix);
};

module.exports = RedisStore;
