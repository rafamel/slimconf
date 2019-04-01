import get from '~/slim/get';

test(`throws wo/ a path`, () => {
  expect(() => get({}, '')).toThrowError();
});
test(`succeeds for first level properties`, () => {
  const obj = { foo: 'bar', bar: { baz: 'barbaz' } };
  expect(get(obj, 'foo')).toBe('bar');
  expect(get(obj, 'bar')).toEqual({ baz: 'barbaz' });
});
test(`throws for non existent first level properties`, () => {
  const obj = { foo: { bar: { baz: 'barbaz' }, baz: 'foobar' } };
  expect(() => get(obj, 'bar')).toThrowError();
});
test(`succeeds for inner properties`, () => {
  const obj = { foo: { bar: { baz: 'barbaz' }, baz: 'foobar' } };
  expect(get(obj, 'foo')).toEqual({ bar: { baz: 'barbaz' }, baz: 'foobar' });
  expect(get(obj, 'foo.bar')).toEqual({ baz: 'barbaz' });
  expect(get(obj, 'foo.bar.baz')).toBe('barbaz');
  expect(get(obj, 'foo.baz')).toBe('foobar');
});
test(`throws for non existent inner properties`, () => {
  const obj = { foo: { bar: { baz: 'barbaz' }, baz: 'foobar' } };
  expect(() => get(obj, 'foo.foobar')).toThrowError();
  expect(() => get(obj, 'foo.bar.foobar')).toThrowError();
});
