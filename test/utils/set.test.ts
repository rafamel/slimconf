import set from '~/utils/set';

test(`throws wo/ a path`, () => {
  expect(() => set({}, '', 'bar')).toThrowError();
});
test(`throws for non objects`, () => {
  expect(() => set(4, 'foo', 'bar')).toThrowError();
});
test(`succeeds for first level properties`, () => {
  const obj = { foo: 'bar', bar: { baz: 'barbaz' } };
  expect(set(obj, 'foo', 'else')).toBe('else');
  expect(obj.foo).toBe('else');
  expect(set(obj, 'bar', { else: 'foo' })).toEqual({ else: 'foo' });
  expect(obj.bar).toEqual({ else: 'foo' });
});
test(`throws for non existent first level properties`, () => {
  const obj = { foo: { bar: { baz: 'barbaz' }, baz: 'foobar' } };
  expect(() => set(obj, 'bar', 'else')).toThrowError();
});
test(`succeeds for inner properties`, () => {
  const obj: any = { foo: { bar: { baz: 'barbaz' }, baz: 'foobar' } };
  expect(set(obj, 'foo.bar', { else: 'foo' })).toEqual({ else: 'foo' });
  expect(obj.foo.bar).toEqual({ else: 'foo' });
  expect(set(obj, 'foo.bar.else', 'foobar')).toBe('foobar');
  expect(obj.foo.bar.else).toBe('foobar');
});
test(`throws for non existent inner properties`, () => {
  const obj = { foo: { bar: { baz: 'barbaz' }, baz: 'foobar' } };
  expect(() => set(obj, 'foo.foobar', 'else')).toThrowError();
  expect(() => set(obj, 'foo.bar.foobar', 'else')).toThrowError();
});
