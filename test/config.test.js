import config from '../src/config';

describe(`- Basic`, () => {
  test(`Works with no setup`, () => {
    const c1 = config(null, () => ({ some: { a: 1, b: 2 }, other: 3 }));
    const c2 = config(undefined, () => ({ some: { a: 1, b: 2 }, other: 3 }));

    expect(c1).toHaveProperty('some');
    expect(c1.some.a).toBe(1);
    expect(c1.some.b).toBe(2);
    expect(c1.other).toBe(3);

    expect(c2).toHaveProperty('some');
    expect(c2.some.a).toBe(1);
    expect(c2.some.b).toBe(2);
    expect(c2.other).toBe(3);
  });

  test(`Throws with keys get, set, environment`, () => {
    expect(() => config(null, () => ({ some: 1, get: 2 }))).toThrowError();
    expect(() => config(null, () => ({ some: 1, set: 2 }))).toThrowError();
    expect(() =>
      config(null, () => ({ some: 1, environment: 2 }))
    ).toThrowError();
  });

  test(`Works with setup`, () => {
    const setup = {
      env: 'test'
    };
    const c = config(setup, ({ env }, on) => ({
      some: on.env({
        default: 1,
        hello: 2
      }),
      other: on.env({
        default: 3,
        test: 4
      }),
      else: 5
    }));

    expect(c.some).toBe(1);
    expect(c.other).toBe(4);
    expect(c.else).toBe(5);
  });

  test(`Get works with no setup & throws when key doesn't exist`, () => {
    const c = config(null, () => ({ some: { a: 1, b: 2 }, other: 3 }));

    expect(c).toHaveProperty('some');
    expect(c.get('some').a).toBe(1);
    expect(c.get('some.a')).toBe(1);
    expect(c.get('some').b).toBe(2);
    expect(c.get('some.b')).toBe(2);
    expect(c.get('other')).toBe(3);
    expect(() => c.get('not')).toThrowError();
    expect(() => c.get('other.not')).toThrowError();
  });

  test(`Set works with no setup & throws when key doesn't exist`, () => {
    const c = config(null, () => ({ some: { a: 1, b: 2 }, other: 3 }));

    c.set('some.a', 4);
    c.set('other', 5);

    expect(c.get('some.a')).toBe(4);
    expect(c.get('some.b')).toBe(2);
    expect(c.get('other')).toBe(5);
    expect(() => c.set('not')).toThrowError();
  });
});

describe(`- Environment`, () => {
  test(`Works with no setup`, () => {
    const c = config(null, () => ({
      some: { a: 1, b: 2 },
      other: 3
    })).environment();

    expect(c).toHaveProperty('some');
    expect(c.some.a).toBe(1);
    expect(c.some.b).toBe(2);
    expect(c.other).toBe(3);
  });
  test(`Works with setup`, () => {
    const setup = {
      env: {
        default: 'test',
        map(env) {
          return env === 'hello' ? 'goodbye' : env;
        }
      }
    };
    const c1 = config(setup, ({ env }, on) => ({
      some: on.env({
        default: 1,
        goodbye: 2
      }),
      other: on.env({
        default: 3,
        test: 4
      }),
      else: 5
    }));
    const c2 = c1.environment({ env: 'hello' });

    expect(c1.some).toBe(1);
    expect(c1.other).toBe(4);
    expect(c1.else).toBe(5);
    expect(c2.some).toBe(2);
    expect(c2.other).toBe(3);
    expect(c2.else).toBe(5);
  });
  test(`Works with setup (2)`, () => {
    const setup = {
      env: {
        default: 'test',
        map(env) {
          return env === 'hello' ? 'goodbye' : env;
        }
      },
      inst: 'one'
    };
    const c1 = config(setup, ({ env }, on) => ({
      some: on.env({
        default: 1,
        goodbye: on.inst({
          default: 10,
          one: 2
        })
      }),
      other: on.inst({
        default: 3,
        one: 4
      }),
      else: 5
    }));

    const c2 = c1.environment({ env: 'hello' });
    const c3 = c1.environment({ inst: 'two' });
    const c4 = c1.environment({ env: 'hello', inst: 'two' });

    expect(c1.some).toBe(1);
    expect(c1.other).toBe(4);
    expect(c1.else).toBe(5);

    expect(c2.some).toBe(2);
    expect(c2.other).toBe(4);
    expect(c2.else).toBe(5);

    expect(c3.some).toBe(1);
    expect(c3.other).toBe(3);
    expect(c3.else).toBe(5);

    expect(c4.some).toBe(10);
    expect(c4.other).toBe(3);
    expect(c4.else).toBe(5);
  });
  test(`Merges default`, () => {
    const setup = {
      env: 'test'
    };
    const c1 = config(setup, ({ env }, on) => ({
      some: on.env({
        default: {
          one: 1,
          two: 2
        },
        test: {
          one: 10
        }
      })
    }));
    const c2 = c1.environment({ env: 'other' });

    expect(c1.some.one).toBe(10);
    expect(c1.some.two).toBe(2);
    expect(c2.some.one).toBe(1);
    expect(c2.some.two).toBe(2);
  });

  test(`Set works`, () => {
    const setup = {
      env: 'test'
    };
    const c1 = config(setup, ({ env }, on) => ({
      some: on.env({
        default: {
          one: 1,
          two: 2
        },
        test: {
          one: 10
        }
      })
    }));
    c1.environment({ env: 'other' }).set('some.one', 11);
    const c2 = c1.environment({ env: 'other' });

    expect(c1.some.one).toBe(10);
    expect(c1.some.two).toBe(2);
    expect(c2.some.one).toBe(11);
    expect(c2.some.two).toBe(2);
  });
});
