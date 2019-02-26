var Redis = require('ioredis');
var debug = require('debug')('ioredis-koa')

var RedisStore = function (options) {
  if (!(this instanceof RedisStore)) {
    return new RedisStore(options);
  }

  options = options || {};

  var client;
  options.auth_pass = options.auth_pass || options.pass || null;
  options.path = options.path || options.socket || null;
  if (!options.client) {
    debug('Init redis new client');
    client = options.rediscluster
            ? new Redis.Cluster(options.rediscluster)
            : new Redis(options);
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
    debug('selecting db %s', options.db)
    client.select(options.db);
    client.on('connect', function() {
      client.send_anyways = true;
      client.select(options.db);
      client.send_anyways = false;
    });
  }


  this.get = function*(sid){
    let _data = yield client.get(sid)
    let data;
    try{
      data = JSON.parse(_data)
    } catch(e) {
      data = _data
    }
    return data;
  }

  this.set = function*(sid, sess, ttl){
    if(typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000);
    }
    sess = JSON.stringify(sess);
    if (ttl) {
      yield client.setex(sid, ttl, sess)
    } else {
      yield client.set(sid, sess)
    }
  }

  this.destory = client.del;

  client.on('error', err => logger.error(err));
  
  Object.setPrototypeOf(this, client);
  
  debug('redis client created %s', options.redis.prefix)
}

module.exports = RedisStore;