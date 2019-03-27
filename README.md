ioredis-koa
=========

<!-- [![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![David devDeps][david-dev-image]][david-dev-url] -->
[![build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![license][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/godky/ioredis-koa.svg?style=flat-square
[travis-url]: https://travis-ci.org/godky/ioredis-koa
[npm-image]: https://img.shields.io/npm/v/ioredis-koa.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ioredis-koa
[node-image]: https://img.shields.io/node/v/ioredis-koa.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/ioredis-koa.svg?style=flat-square
[download-url]: https://npmjs.org/package/ioredis-koa
[license-image]: https://img.shields.io/npm/l/ioredis-koa.svg?style=flat-square
[license-url]: https://github.com/godky/ioredis-koa/blob/master/LICENSE
<!-- [coveralls-image]: https://img.shields.io/coveralls/godky/ioredis-koa.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/godky/ioredis-koa?branch=master
[david-image]: https://img.shields.io/david/godky/ioredis-koa.svg?style=flat-square&label=deps
[david-url]: https://david-dm.org/godky/ioredis-koa
[david-dev-image]: https://img.shields.io/david/dev/godky/ioredis-koa.svg?style=flat-square&label=devDeps
[david-dev-url]: https://david-dm.org/godky/ioredis-koa#info=devDependencies
[david-opt-image]: https://img.shields.io/david/optional/godky/ioredis-koa.svg?style=flat-square&label=optDeps
[david-opt-url]: https://david-dm.org/godky/ioredis-koa#info=devDependencies -->

Redis storage for koa application or session middleware/cache.

[![NPM](https://nodei.co/npm/ioredis-koa.svg?downloads=true)](https://nodei.co/npm/ioredis-koa/)

## Usage

  - redis client: `ioredis-koa` is same as [ioredis](https://github.com/luin/ioredis) (A robust, performance-focused and full-featured Redis client for Node.js)
  - session: `ioredis-koa` works with [koa-generic-session](https://github.com/koajs/generic-session) (a generic session middleware for koa).

## Quick Start

### Install

```
npm install ioredis-koa
```

### Example

#### as a redis client for application

```js
var Redis = require('ioredis-koa');
var redis = new Redis();
 
redis.set('foo', 'bar');
redis.get('foo', function (err, result) {
  console.log(result);
});
 
// Or using a promise if the last argument isn't a function
redis.get('foo').then(function (result) {
  console.log(result);
});
 
// Arguments to commands are flattened, so the following are the same:
redis.sadd('set', 1, 3, 5, 7);
redis.sadd('set', [1, 3, 5, 7]);
 
// All arguments are passed directly to the redis server:
redis.set('key', 100, 'EX', 10);

```
See [more examples](https://www.npmjs.com/package/ioredis) of `ioredis`.

#### as a session middleware, redis cluster enabled!

These are some the funcitons that koa-generic-session uses that you can use manually. You will need to inintialize differently than the example above:

```js

var session = require('koa-generic-session');
var redisStore = require('ioredis-koa')({
  // Options specified here
});
var app = require('koa')();

app.keys = ['keys', 'keykeys'];
app.use(session({
  store: redisStore
}));
```
For more examples, please see the [examples folder of `koa-generic-session`](https://github.com/koajs/generic-session/tree/master/example).

### Options

 - *all [`ioredis`](https://www.npmjs.com/package/ioredis)options*
* [API Documentation]([API.md](https://github.com/luin/ioredis/blob/HEAD/API.md))


## Testing
1. Start a Redis server on `localhost:6379`. You can use [`redis-windows`](https://github.com/ServiceStack/redis-windows) if you are on Windows or just want a quick VM-based server.
2. Clone the repository and run `npm i` in it (Windows should work fine).
3. If you want to see debug output, turn on the prompt's `DEBUG` flag.

## Authors
See the [Author](https://github.com/godky)

## Licences
(The MIT License)

Copyright (c) 2019 godky and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
