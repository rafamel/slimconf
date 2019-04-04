import { shallow, merge, deep } from '~/strategies';

test(`shallow returns shallow merge`, () => {
  expect(shallow(1, 2)).toBe(2);
  expect(shallow({ a: 1 }, 2)).toBe(2);
  expect(shallow(1, { b: 1 })).toEqual({ b: 1 });
  expect(shallow({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
  expect(shallow([1, 2], [3, 4])).toEqual([3, 4]);
  expect(shallow({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(shallow([1, 2], { b: 1 })).toEqual({ b: 1 });
  expect(shallow({ a: { b: 3 }, c: 1 }, { a: { d: 3 }, d: 4 })).toEqual({
    a: { d: 3 },
    c: 1,
    d: 4
  });
});

test(`merge returns deep merge wo/ arrays`, () => {
  expect(merge(1, 2)).toBe(2);
  expect(merge({ a: 1 }, 2)).toBe(2);
  expect(merge(1, { b: 1 })).toEqual({ b: 1 });
  expect(merge({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
  expect(merge([1, 2], [3, 4])).toEqual([3, 4]);
  expect(merge({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(merge([1, 2], { b: 1 })).toEqual({ b: 1 });
  expect(merge({ a: { b: 3 }, c: 1 }, { a: { d: 3 }, d: 4 })).toEqual({
    a: { b: 3, d: 3 },
    c: 1,
    d: 4
  });
  expect(
    merge(
      { a: { b: [1, 2], c: 3 }, d: [1, 2, 3] },
      { a: { b: 3, c: [3, 4] }, d: [4, 5, 6] }
    )
  ).toEqual({
    a: { b: 3, c: [3, 4] },
    d: [4, 5, 6]
  });
});

test(`deep returns deep merge w/ arrays`, () => {
  expect(deep(1, 2)).toBe(2);
  expect(deep({ a: 1 }, 2)).toBe(2);
  expect(deep(1, { b: 1 })).toEqual({ b: 1 });
  expect(deep({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
  expect(deep([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  expect(deep({ a: 1 }, [3, 4])).toEqual([3, 4]);
  expect(deep([1, 2], { b: 1 })).toEqual({ b: 1 });
  expect(deep({ a: { b: 3 }, c: 1 }, { a: { d: 3 }, d: 4 })).toEqual({
    a: { b: 3, d: 3 },
    c: 1,
    d: 4
  });
  expect(
    deep(
      { a: { b: [1, 2], c: 3 }, d: [1, 2, 3] },
      { a: { b: 3, c: [3, 4] }, d: [4, 5, 6] }
    )
  ).toEqual({
    a: { b: 3, c: [3, 4] },
    d: [1, 2, 3, 4, 5, 6]
  });
});
