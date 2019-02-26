
const Redis = require('../lib')
const redis = new Redis();

test('two arguments set and get through callback', done => {
  redis.set('foo', 'bar');
  redis.get('foo', function (err, result) {
    expect(result).toBe('bar');
    done()
  });
})

test('promise get', ()=>{
  redis.set('foo', 'bar1');
  return redis.get('foo').then(result => {
    expect(result).toBe('bar1')
  });
})
 
test('three arguments set and get', async() => {
  expect(await redis.set('a', '1', 1000)).toBe('OK');
  expect(await redis.get('a')).toBe('1')
  expect(await redis.pttl('a')).toBeLessThan(1000)
})

test('duplicate set', async()=>{
  expect(await redis.setnx('foo', 'bar')).toBe(0);
})

test('All arguments are passed directly to the redis server', async()=>{
  expect(await redis.set('key', 100, 'EX', 200)).toBe('OK')
  expect(await redis.get('key')).toBe(100)
  expect(await redis.ttl('key')).toBe(200)
})

test('other redis orders', ()=>{
  redis.sadd('set', 1, 3, 5, 7);
  redis.sadd('set', [2, 4, 5, 7]);
  return redis.scard('set').then(value => {
    expect(value).toBe(6)
  })
})