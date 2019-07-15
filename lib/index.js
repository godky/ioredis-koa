"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Redis = require('ioredis');

var debug = require('debug')('ioredis-koa');

var RedisStore = function RedisStore() {
  for (var _len = arguments.length, opts = new Array(_len), _key = 0; _key < _len; _key++) {
    opts[_key] = arguments[_key];
  }

  if (!(this instanceof RedisStore)) {
    return _construct(RedisStore, opts);
  }

  var client;
  var isCluser = opts[0] instanceof Array;
  var options = (isCluser ? opts[1] : opts[0]) || {};

  if (!options.client) {
    debug('Init redis new client');
    options.client = client = isCluser ? _construct(Redis.Cluster, opts) : new Redis(options);
  } else {
    debug('Using provided client');
    client = options.client;
  }

  this.get = function (sid, cb) {
    return new Promise(function (res) {
      client.get(sid, function (err, result) {
        if (err) res(err);

        try {
          result = Object.prototype.toString.call(JSON.parse(result)) != '[object Object]' ? result : JSON.parse(result);
        } catch (e) {}

        if (typeof cb === 'function') {
          cb(err, result);
        }

        res(result);
      });
    });
  };

  this.set = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new Promise(function (res) {
      try {
        typeof args[1] != 'string' && (args[1] = JSON.stringify(args[1]));
      } catch (e) {}

      if (typeof args[2] === 'number') {
        res(client.setex(args[0], Math.ceil(args[2] / 1000), args[1])["catch"](function (e) {
          return debug('set error %s', e);
        }));
      } else {
        var _client;

        res((_client = client).set.apply(_client, args)["catch"](function (e) {
          return debug('set error %s', e);
        }));
      }
    });
  };

  this.destory = client.del;
  client.on('error', function (err) {
    return console.log('client on error', err);
  });
  Object.setPrototypeOf(this, client);
  debug('redis client created %s', opts[0]);
};

RedisStore.middleware = function () {
  for (var _len3 = arguments.length, opts = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    opts[_key3] = arguments[_key3];
  }

  var store = _construct(RedisStore, opts);

  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ctx.redis = store;
                _context.next = 3;
                return next();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

module.exports = RedisStore;
