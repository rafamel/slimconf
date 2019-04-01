import slim from '~/slim';

describe(`bare`, () => {
  describe(`root`, () => {
    test(`succeeds`, () => {
      const c = slim({ foo: { bar: 1, baz: 2 }, barbaz: 3 });

      expect(c).toHaveProperty('foo');
      expect(c).toHaveProperty('barbaz');
      expect(c.foo).toEqual({ bar: 1, baz: 2 });
      expect(c.barbaz).toBe(3);
    });
    test(`fails with keys get, set, environment, pure`, () => {
      expect(() => slim({ foo: 'bar', get: 'baz' })).toThrowError();
      expect(() => slim({ foo: 'bar', set: 'baz' })).toThrowError();
      expect(() => slim({ foo: 'bar', environment: 'baz' })).toThrowError();
      expect(() => slim({ foo: 'bar', pure: 'baz' })).toThrowError();
    });
  });
  describe(`get`, () => {
    test(`succeeds`, () => {
      const c = slim({ foo: { bar: 1, baz: 2 }, barbaz: 3 });
      expect(c.get('foo.bar')).toBe(1);
    });
    test(`fails`, () => {
      const c = slim({ foo: { bar: 1, baz: 2 }, barbaz: 3 });
      expect(() => c.get('foo.bar.baz')).toThrowError();
    });
  });
  describe(`set`, () => {
    test(`succeeds`, () => {
      const c = slim({ foo: { bar: 1, baz: 2 }, barbaz: 3 });
      expect(c.set('foo.bar', { baz: 5 })).toEqual({ baz: 5 });
      expect(c.foo.bar).toEqual({ baz: 5 });
      expect(c.set('foo.bar.baz', 2)).toBe(2);
      expect(c.foo.bar).toHaveProperty('baz', 2);
    });
    test(`fails`, () => {
      const c = slim({ foo: { bar: 1, baz: 2 } });
      expect(() => c.set('bar', 1)).toThrowError();
      expect(() => c.set('foo.bar.baz', 1)).toThrowError();
    });
  });
  describe(`pure`, () => {
    test(`succeeds`, () => {
      const c = slim({ foo: 'bar' });
      expect(() => c.pure()).not.toThrow();
      expect(c.pure()).toEqual({ foo: 'bar' });
    });
  });
});

describe(`full`, () => {
  describe(`root`, () => {
    test(`succeeds`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: 1, production: 2 }),
        bar: on.env({ default: 3, test: 4 }),
        baz: 5,
        barbaz: on.env({ test: 6 })
      }));

      expect(c.foo).toBe(1);
      expect(c.bar).toBe(4);
      expect(c.baz).toBe(5);
      expect(c.barbaz).toBe(6);
    });
    test(`on merges default object`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: 1, production: { bar: 'baz' } }),
        bar: on.env({ default: 3, test: { bar: 'baz' } }),
        baz: on.env({ default: {}, test: { a: 1, b: 2 } }),
        barbaz: on.env({ default: { a: 1, b: 2 }, test: {} }),
        foobar: on.env({ default: { a: 1, b: 2 }, test: { b: 3, c: 4 } }),
        foobaz: on.env({ default: { b: 3, c: 4 }, test: { a: 1, b: 2 } })
      }));

      expect(c.foo).toBe(1);
      expect(c.bar).toEqual({ bar: 'baz' });
      expect(c.baz).toEqual({ a: 1, b: 2 });
      expect(c.barbaz).toEqual({ a: 1, b: 2 });
      expect(c.foobar).toEqual({ a: 1, b: 3, c: 4 });
      expect(c.foobaz).toEqual({ a: 1, b: 2, c: 4 });
    });
    test(`fails with keys get, set, environment, pure`, () => {
      const setup = { env: 'test' };
      expect(() =>
        slim(setup, () => ({ foo: 'bar', get: 'baz' }))
      ).toThrowError();
      expect(() =>
        slim(setup, () => ({ foo: 'bar', set: 'baz' }))
      ).toThrowError();
      expect(() =>
        slim(setup, () => ({ foo: 'bar', environment: 'baz' }))
      ).toThrowError();
      expect(() =>
        slim(setup, () => ({ foo: 'bar', pure: 'baz' }))
      ).toThrowError();
    });
    test(`succeeds with setup when undefined`, () => {
      const c1 = slim({ env: undefined }, (_, on) => ({
        foo: on.env({ default: 1, production: 2 }),
        bar: on.env({ default: 3, test: 4 }),
        baz: 5,
        barbaz: on.env({ test: 6 })
      }));
      const c2 = slim(
        { env: { from: null, map: () => undefined } },
        (_, on) => ({
          foo: on.env({ default: 1, production: 2 }),
          bar: on.env({ default: 3, test: 4 }),
          baz: 5,
          barbaz: on.env({ test: 6 })
        })
      );

      [c1, c2].forEach((c) => {
        expect(c.foo).toBe(1);
        expect(c.bar).toBe(3);
        expect(c.baz).toBe(5);
        expect(c.barbaz).toBeUndefined();
      });
    });
  });
  describe(`get`, () => {
    test(`succeeds`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: { else: 1 }, production: 2 }),
        bar: { baz: on.env({ default: 3, test: 4 }) },
        barbaz: on.env({ production: 6 })
      }));

      expect(c.get('foo')).toEqual({ else: 1 });
      expect(c.get('foo.else')).toBe(1);
      expect(c.get('bar.baz')).toBe(4);
      expect(c.get('barbaz')).toBeUndefined();
    });
    test(`fails`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: { else: 1 }, production: 2 }),
        bar: { baz: on.env({ default: 3, test: 4 }) }
      }));

      expect(() => c.get('baz')).toThrowError();
      expect(() => c.get('bar.bar')).toThrowError();
      expect(() => c.get('foo.else.bar')).toThrowError();
    });
  });
  describe(`set`, () => {
    test(`succeeds`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: { else: 1 }, production: 2 }),
        bar: { baz: on.env({ default: 3, test: 4 }) },
        barbaz: on.env({ production: 6 })
      }));

      expect(c.set('foo', { bar: 'baz' })).toEqual({ bar: 'baz' });
      expect(c.foo).toEqual({ bar: 'baz' });
      expect(c.set('foo.bar', 'foobar')).toBe('foobar');
      expect(c.foo).toEqual({ bar: 'foobar' });
    });
    test(`fails`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: { else: 1 }, production: 2 }),
        bar: { baz: on.env({ default: 3, test: 4 }) },
        barbaz: on.env({ production: 6 })
      }));

      expect(() => c.set('baz', 1)).toThrowError();
      expect(() => c.set('bar.bar', 1)).toThrowError();
      expect(() => c.set('foo.else.bar', 1)).toThrowError();
    });
  });
  describe(`pure`, () => {
    test(`succeeds`, () => {
      const c = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({ default: 1, production: 2 }),
        bar: { baz: on.env({ default: 3, test: 4 }) },
        barbaz: on.env({ production: 6 })
      }));

      expect(() => c.pure()).not.toThrow();
      expect(c.pure()).toEqual({ foo: 1, bar: { baz: 4 }, barbaz: undefined });
    });
  });
  describe(`environment`, () => {
    test(`succeeds`, () => {
      const setup = {
        env: {
          from: 'test',
          map(env: string) {
            return env === 'hello' ? 'goodbye' : env;
          }
        }
      };
      const c1 = slim(setup, ({ env }, on) => ({
        foo: on.env({ default: 1, goodbye: 2 }),
        bar: on.env({ default: 3, test: 4 }),
        baz: 5,
        env
      }));
      const c2 = c1.environment({ env: 'hello' });

      expect(c1.pure()).toEqual({ foo: 1, bar: 4, baz: 5, env: 'test' });
      expect(c2.pure()).toEqual({ foo: 2, bar: 3, baz: 5, env: 'goodbye' });
    });
    test(`succeeds (deep)`, () => {
      const setup = {
        env: {
          from: 'test',
          map(env: string) {
            return env === 'hello' ? 'goodbye' : env;
          }
        },
        fooenv: 'one'
      };
      const c1 = slim(setup, ({ env, fooenv }, on) => ({
        foo: on.env({
          default: 1,
          goodbye: on.fooenv({ default: 10, one: 2 })
        }),
        bar: on.fooenv({ default: 3, one: 4 }),
        baz: 5,
        env,
        fooenv
      }));
      const c2 = c1.environment({ env: 'hello' });
      const c3 = c2.environment({ fooenv: 'two' });
      const c4 = c3.environment({ env: 'hello', fooenv: 'two' });

      expect(c1.pure()).toEqual({
        foo: 1,
        bar: 4,
        baz: 5,
        env: 'test',
        fooenv: 'one'
      });
      expect(c2.pure()).toEqual({
        foo: 2,
        bar: 4,
        baz: 5,
        env: 'goodbye',
        fooenv: 'one'
      });
      expect(c3.pure()).toEqual({
        foo: 1,
        bar: 3,
        baz: 5,
        env: 'test',
        fooenv: 'two'
      });
      expect(c4.pure()).toEqual({
        foo: 10,
        bar: 3,
        baz: 5,
        env: 'goodbye',
        fooenv: 'two'
      });
    });
    test(`succeeds wo/ filter`, () => {
      const c1 = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({
          default: { bar: 1, baz: 2 },
          test: { bar: 10 }
        })
      }));

      expect(() => c1.environment({ env: 'else' }).environment()).not.toThrow();
      expect(c1.environment({ env: 'else' }).environment().foo).toEqual({
        bar: 10,
        baz: 2
      });
    });
    test(`merges default`, () => {
      const c1 = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({
          default: { bar: 1, baz: 2 },
          test: { bar: 10 }
        })
      }));
      const c2 = c1.environment({ env: 'else' });

      expect(c1.foo).toEqual({ bar: 10, baz: 2 });
      expect(c2.foo).toEqual({ bar: 1, baz: 2 });
    });
    test(`recovers previous object if already created`, () => {
      const ct1 = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({
          default: { bar: 1, baz: 2 },
          test: { bar: 10 }
        })
      }));
      const ct2 = ct1.environment({ env: 'test' });
      const ce1 = ct2.environment({ env: 'else' });
      const ce2 = ct1.environment({ env: 'else' });
      const ct3 = ct1.environment({ env: 'test' });
      const ct4 = ce2.environment();

      expect(ct1).toBe(ct2);
      expect(ct2).toBe(ct3);
      expect(ct4).toBe(ct4);
      expect(ce1).toBe(ce2);
    });
    test(`set succeeds`, () => {
      const c1 = slim({ env: 'test' }, (_, on) => ({
        foo: on.env({
          default: { bar: 1, baz: 2 },
          test: { bar: 10 }
        })
      }));
      c1.environment({ env: 'other' }).set('foo.bar', 11);
      const c2 = c1.environment({ env: 'other' });

      expect(c1.foo).toEqual({ bar: 10, baz: 2 });
      expect(c2.foo).toEqual({ bar: 11, baz: 2 });
    });
  });
});
