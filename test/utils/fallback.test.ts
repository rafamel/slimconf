import fallback from '~/utils/fallback';

describe(`shallow`, () => {
  test(`succeeds wo/ values`, () => {
    expect(fallback('foo')()).toBe('foo');
    expect(fallback('foo')('bar')).toBe('bar');
  });
  test(`succeeds w/ values`, () => {
    expect(fallback('foo', ['bar', 'baz'])()).toBe('foo');
    expect(fallback('foo', ['bar', undefined])()).toBe(undefined);
    expect(fallback('foo', ['bar', 'baz'])('foobar')).toBe('foo');
    expect(fallback('foo', ['bar', 'baz'])('bar')).toBe('bar');
    expect(fallback({ a: 1 }, [{ b: 1 }])({ b: 1 })).toEqual({ a: 1 });
  });
});
describe(`deep`, () => {
  test(`suceeds`, () => {
    expect(fallback('foo', ['bar', 'baz'], true)()).toBe('foo');
    expect(fallback('foo', ['bar', undefined], true)()).toBe(undefined);
    expect(fallback('foo', ['bar', 'baz'], true)('foobar')).toBe('foo');
    expect(fallback('foo', ['bar', 'baz'], true)('bar')).toBe('bar');
    expect(fallback({ a: 1 }, [{ b: 1 }], true)({ b: 1 })).toEqual({ b: 1 });
  });
});
