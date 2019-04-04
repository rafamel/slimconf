import rules from '~/slim/rules';

test(`rules.rank returns value`, () => {
  expect(rules.rank(1, 2)).toBe(2);
  expect(rules.rank({ a: 1 }, 2)).toBe(2);
  expect(rules.rank(1, { b: 1 })).toEqual({ b: 1 });
  expect(rules.rank({ a: 1 }, { b: 1 })).toEqual({ b: 1 });
  expect(rules.rank({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(rules.rank([1, 2], { b: 1 })).toEqual({ b: 1 });
});

test(`rules.shallow returns shallow merge`, () => {
  expect(rules.shallow(1, 2)).toBe(2);
  expect(rules.shallow({ a: 1 }, 2)).toBe(2);
  expect(rules.shallow(1, { b: 1 })).toEqual({ b: 1 });
  expect(rules.shallow({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
  expect(rules.shallow([1, 2], [3, 4])).toEqual([3, 4]);
  expect(rules.shallow({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(rules.shallow([1, 2], { b: 1 })).toEqual({ b: 1 });
  expect(rules.shallow({ a: { b: 3 }, c: 1 }, { a: { d: 3 }, d: 4 })).toEqual({
    a: { d: 3 },
    c: 1,
    d: 4
  });
});

test(`rules.merge returns deep merge wo/ arrays`, () => {
  expect(rules.merge(1, 2)).toBe(2);
  expect(rules.merge({ a: 1 }, 2)).toBe(2);
  expect(rules.merge(1, { b: 1 })).toEqual({ b: 1 });
  expect(rules.merge({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
  expect(rules.merge([1, 2], [3, 4])).toEqual([3, 4]);
  expect(rules.merge({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(rules.merge([1, 2], { b: 1 })).toEqual({ b: 1 });
  expect(rules.merge({ a: { b: 3 }, c: 1 }, { a: { d: 3 }, d: 4 })).toEqual({
    a: { b: 3, d: 3 },
    c: 1,
    d: 4
  });
  expect(
    rules.merge(
      { a: { b: [1, 2], c: 3 }, d: [1, 2, 3] },
      { a: { b: 3, c: [3, 4] }, d: [4, 5, 6] }
    )
  ).toEqual({
    a: { b: 3, c: [3, 4] },
    d: [4, 5, 6]
  });
});

test(`rules.deep returns deep merge w/ arrays`, () => {
  expect(rules.deep(1, 2)).toBe(2);
  expect(rules.deep({ a: 1 }, 2)).toBe(2);
  expect(rules.deep(1, { b: 1 })).toEqual({ b: 1 });
  expect(rules.deep({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
  expect(rules.deep([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  expect(rules.deep({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(rules.deep([1, 2], { b: 1 })).toEqual({ b: 1 });
  expect(rules.deep({ a: { b: 3 }, c: 1 }, { a: { d: 3 }, d: 4 })).toEqual({
    a: { b: 3, d: 3 },
    c: 1,
    d: 4
  });
  expect(
    rules.deep(
      { a: { b: [1, 2], c: 3 }, d: [1, 2, 3] },
      { a: { b: 3, c: [3, 4] }, d: [4, 5, 6] }
    )
  ).toEqual({
    a: { b: 3, c: [3, 4] },
    d: [1, 2, 3, 4, 5, 6]
  });
});
