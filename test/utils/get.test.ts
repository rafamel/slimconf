import get from '~/utils/get';

test(`throws wo/ a path`, () => {
  expect(() => get({}, '')).toThrowError();
});
test(`throws for non objects`, () => {
  expect(() => get(4, 'foo')).toThrowError();
});
test(`succeeds for first level properties`, () => {
  const obj = {
    foo: 'bar',
    bar: { baz: 'barbaz' },
    baz: undefined,
    foobar: null
  };
  expect(get(obj, 'foo')).toBe('bar');
  expect(get(obj, 'bar')).toEqual({ baz: 'barbaz' });

  expect(get(obj, 'foobar')).toBeNull();
  expect(() => get(obj, 'baz')).toThrowError();
  expect(get(obj, 'foobar', true)).toBeNull();
  expect(get(obj, 'baz', true)).toBeUndefined();
});
test(`throws for first level properties`, () => {
  const obj = { foo: { bar: 'baz', baz: undefined } };
  expect(() => get(obj, 'bar')).toThrowError();

  expect(() => get(obj, 'foo.baz')).toThrowError();
  expect(() => get(obj, 'foo.baz', true)).not.toThrowError();
});
test(`succeeds for inner properties`, () => {
  const obj = {
    foo: { bar: { baz: 'barbaz' }, baz: 'foobar' },
    bar: { baz: undefined, foobar: null }
  };
  expect(get(obj, 'foo')).toEqual({ bar: { baz: 'barbaz' }, baz: 'foobar' });
  expect(get(obj, 'foo.bar')).toEqual({ baz: 'barbaz' });
  expect(get(obj, 'foo.bar.baz')).toBe('barbaz');
  expect(get(obj, 'foo.baz')).toBe('foobar');

  expect(get(obj, 'bar.foobar')).toBeNull();
  expect(() => get(obj, 'bar.baz')).toThrowError();
  expect(get(obj, 'bar.foobar', true)).toBeNull();
  expect(get(obj, 'bar.baz', true)).toBeUndefined();
});
test(`throws for inner properties`, () => {
  const obj = { foo: { bar: { baz: undefined }, baz: 'foobar' } };
  expect(() => get(obj, 'foo.foobar')).toThrowError();
  expect(() => get(obj, 'foo.bar.foobar')).toThrowError();

  expect(() => get(obj, 'foo.bar.baz')).toThrowError();
  expect(() => get(obj, 'foo.bar.baz', true)).not.toThrowError();
});
