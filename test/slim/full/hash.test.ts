import hash from '~/slim/full/hash';

test(`produces same value for unordered objects`, () => {
  expect(hash({ a: 1, b: 2 })).toEqual(hash({ b: 2, a: 1 }));
});
