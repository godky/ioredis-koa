
const Redis = require('../lib')
const redis = new Redis();

test('two arguments set and get through callback', function(done){
  redis.set('foo', 'bar');
  redis.get('foo', function (err, result) {
    expect(result).toBe('bar');
    done()
  });
})

test('promise get', function() {
  redis.set('foo', 'bar1');
  return redis.get('foo').then(function(result) {
    expect(result).toBe('bar1')
  });
})
 
test('three arguments set and get', function() {
  return Promise.all([redis.set('a', '1', 1000),redis.get('a'),redis.incrby('a',2)]).then(args=>{
    expect(args[0]).toBe('OK');
    expect(args[1]).toBe('1')
    expect(args[2]).toBeLessThanOrEqual(1000)
  })
})

test('duplicate set', function() {
  return redis.setnx('foo', 'bar').then(function(value){ expect(value).toBe(0)});
})

test('All arguments are passed directly to the redis server', function() {
  return Promise.all([redis.set('key', 100, 'EX', 200),redis.get('key'),redis.ttl('key')]).then(args=>{
    expect(args[0]).toBe('OK');
    expect(args[1]).toBe('100');
    expect(args[2]).toBe(200);
  })
})

test('other redis orders', function() {
  redis.sadd('set', 1, 3, 5, 7);
  redis.sadd('set', [2, 4, 5, 7]);
  return redis.scard('set').then(value => {
    expect(value).toBe(6)
  })
})