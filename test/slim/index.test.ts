import slim from '~/slim';
import { TOn } from '~/types';

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
      const c = slim({ foo: { bar: 1, baz: 2 }, barbaz: undefined });
      expect(c.get('foo.bar')).toBe(1);
      expect(() => c.get('barbaz')).toThrowError();
      expect(c.get('barbaz', true)).toBe(undefined);
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
      const c = slim({ env: 'test' }, (on) => ({
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
    test(`fails with keys get, set, environment, pure`, () => {
      const use = { env: 'test' };
      expect(() =>
        slim(use, () => ({ foo: 'bar', get: 'baz' }))
      ).toThrowError();
      expect(() =>
        slim(use, () => ({ foo: 'bar', set: 'baz' }))
      ).toThrowError();
      expect(() =>
        slim(use, () => ({ foo: 'bar', environment: 'baz' }))
      ).toThrowError();
      expect(() =>
        slim(use, () => ({ foo: 'bar', pure: 'baz' }))
      ).toThrowError();
    });
    test(`succeeds with use when undefined`, () => {
      const c1 = slim({ env: undefined }, (on, vars) => ({
        foo: on.env({ default: 1, production: 2 }),
        bar: on.env({ default: 3, test: 4 }),
        baz: 5,
        barbaz: on.env({ test: 6 }),
        vars
      }));
      const c2 = slim({ env: [undefined, () => undefined] }, (on, vars) => ({
        foo: on.env({ default: 1, production: 2 }),
        bar: on.env({ default: 3, test: 4 }),
        baz: 5,
        barbaz: on.env({ test: 6 }),
        vars
      }));

      [c1, c2].forEach((c) => {
        expect(c.foo).toBe(1);
        expect(c.bar).toBe(3);
        expect(c.baz).toBe(5);
        expect(c.barbaz).toBeUndefined();
        expect(c.vars).toEqual({ env: undefined });
      });
    });
  });
  describe(`strategies`, () => {
    test(`doesn't use strategy when no default`, () => {
      const strategy = jest.fn();
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env(strategy, { test: {} })
      }));
      expect(strategy).not.toHaveBeenCalled();
      expect(c.foo).toEqual({});
    });
    test(`doesn't uses strategy when no value`, () => {
      const strategy = jest.fn();
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env(strategy, { default: {} })
      }));
      expect(strategy).not.toHaveBeenCalled();
      expect(c.foo).toEqual({});
    });
    test(`uses strategy when both values`, () => {
      const res = {};
      const strategy = jest.fn().mockImplementation(() => res);
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env(strategy, { default: 1, test: 5 }),
        bar: on.env(strategy, {
          default: { a: 1, b: { c: 2 } },
          test: { a: 2, b: { c: 3 } }
        })
      }));
      expect(strategy).toHaveBeenCalledTimes(2);
      expect(strategy).toHaveBeenCalledWith(1, 5);
      expect(strategy).toHaveBeenCalledWith(
        { a: 1, b: { c: 2 } },
        { a: 2, b: { c: 3 } }
      );
      expect(c.foo).toBe(res);
      expect(c.bar).toBe(res);
    });
    test(`shallow strategy`, () => {
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env('shallow', {
          default: { a: 1, c: 3, d: { e: 1, g: [1, 2] } },
          test: { b: 2, c: 4, d: { f: 1, g: [3, 4] } }
        })
      }));
      expect(c.foo).toEqual({ a: 1, b: 2, c: 4, d: { f: 1, g: [3, 4] } });
    });
    test(`merge strategy`, () => {
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env('merge', {
          default: { a: 1, c: 3, d: { e: 1, g: [1, 2] } },
          test: { b: 2, c: 4, d: { f: 1, g: [3, 4] } }
        })
      }));
      expect(c.foo).toEqual({ a: 1, b: 2, c: 4, d: { e: 1, f: 1, g: [3, 4] } });
    });
    test(`deep strategy`, () => {
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env('deep', {
          default: { a: 1, c: 3, d: { e: 1, g: [1, 2] } },
          test: { b: 2, c: 4, d: { f: 1, g: [3, 4] } }
        })
      }));
      expect(c.foo).toEqual({
        a: 1,
        b: 2,
        c: 4,
        d: { e: 1, f: 1, g: [1, 2, 3, 4] }
      });
    });
    test(`fails on non-existent strategy`, () => {
      expect(() =>
        slim({ env: 'test' }, (on) => ({
          foo: on.env('err' as any, { default: { a: 1 }, test: { b: 2 } })
        }))
      ).toThrowErrorMatchingInlineSnapshot(
        `"Strategy \\"err\\" doesn't exist"`
      );
    });
  });
  describe(`get`, () => {
    test(`succeeds`, () => {
      const c = slim({ env: 'test' }, (on) => ({
        foo: on.env({ default: { else: 1 }, production: 2 }),
        bar: { baz: on.env({ default: 3, test: 4 }) },
        barbaz: on.env({ production: 6 })
      }));

      expect(c.get('foo')).toEqual({ else: 1 });
      expect(c.get('foo.else')).toBe(1);
      expect(c.get('bar.baz')).toBe(4);
      expect(() => c.get('barbaz')).toThrowError();
      expect(c.get('barbaz', true)).toBeUndefined();
    });
    test(`fails`, () => {
      const c = slim({ env: 'test' }, (on) => ({
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
      const c = slim({ env: 'test' }, (on) => ({
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
      const c = slim({ env: 'test' }, (on) => ({
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
      const c = slim({ env: 'test' }, (on) => ({
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
      const c1 = slim(
        { env: ['test', (value) => (value === 'hello' ? 'goodbye' : value)] },
        (on, { env }) => ({
          foo: on.env({ default: 1, goodbye: 2 }),
          bar: on.env({ default: 3, test: 4 }),
          baz: 5,
          env
        })
      );
      const c2 = c1.environment({ env: 'hello' });

      expect(c1.pure()).toEqual({ foo: 1, bar: 4, baz: 5, env: 'test' });
      expect(c2.pure()).toEqual({ foo: 2, bar: 3, baz: 5, env: 'goodbye' });
    });
    test(`succeeds (deep)`, () => {
      const c1 = slim(
        {
          fooenv: 'one',
          env: ['test', (value) => (value === 'hello' ? 'goodbye' : value)]
        },
        (on, { env, fooenv }) => ({
          foo: on.env({
            default: 1,
            goodbye: on.fooenv({ default: 10, one: 2 })
          }),
          bar: on.fooenv({ default: 3, one: 4 }),
          baz: 5,
          env,
          fooenv
        })
      );
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
      const c1 = slim({ env: 'test' }, (on) => ({
        foo: on.env({
          default: { bar: 1, baz: 2 },
          test: { bar: 10 }
        })
      }));

      expect(() => c1.environment({ env: 'else' }).environment()).not.toThrow();
      expect(c1.environment({ env: 'else' }).environment().foo).toEqual({
        bar: 10
      });
    });
    test(`recovers previous object if already created`, () => {
      const ct1 = slim({ env: 'test' }, (on) => ({
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
      const c1 = slim({ env: 'test' }, (on) => ({
        foo: on.env({
          default: { bar: 1, baz: 2 },
          test: { bar: 10 }
        })
      }));
      c1.environment({ env: 'other' }).set('foo.bar', 11);
      const c2 = c1.environment({ env: 'other' });

      expect(c1.foo).toEqual({ bar: 10 });
      expect(c2.foo).toEqual({ bar: 11, baz: 2 });
    });
  });
  describe(`use is not a string: TUseType`, () => {
    test(`number`, () => {
      const fn = (on: TOn<any>, vars: any): any => ({
        vars,
        foo: on.env({
          default: { bar: 1 },
          2: { bar: 2 }
        })
      });
      const c1 = slim({ env: 2 }, fn);
      const c2 = slim({ env: [null, (x: any) => (x === null ? 2 : x)] }, fn);

      [c1, c2].forEach((c) => {
        expect(c.pure()).toEqual({ vars: { env: 2 }, foo: { bar: 2 } });
        expect(c.environment({ env: 10 }).pure()).toEqual({
          vars: { env: 10 },
          foo: { bar: 1 }
        });
        expect(c.environment({ env: undefined }).pure()).toEqual({
          vars: { env: undefined },
          foo: { bar: 1 }
        });
      });
    });
    test(`boolean`, () => {
      const fn = (on: TOn<any>, vars: any): any => ({
        vars,
        foo: on.env({
          default: { bar: 1 },
          true: { bar: 2 },
          false: { bar: 3 }
        })
      });
      const c1 = slim({ env: true }, fn);
      const c2 = slim({ env: false }, fn);
      const c3 = slim({ env: [null, (x: any) => (x === null ? true : x)] }, fn);
      const c4 = slim(
        { env: [null, (x: any) => (x === null ? false : x)] },
        fn
      );

      [c1, c3].forEach((c) => {
        expect(c.pure()).toEqual({ vars: { env: true }, foo: { bar: 2 } });
        expect(c.environment({ env: undefined }).pure()).toEqual({
          vars: { env: undefined },
          foo: { bar: 1 }
        });
      });
      [c2, c4].forEach((c) => {
        expect(c.pure()).toEqual({ vars: { env: false }, foo: { bar: 3 } });
        expect(c.environment({ env: undefined }).pure()).toEqual({
          vars: { env: undefined },
          foo: { bar: 1 }
        });
      });
    });
    test(`null`, () => {
      const fn = (on: TOn<any>, vars: any): any => ({
        vars,
        foo: on.env({
          default: { bar: 1 },
          null: { bar: 2 }
        })
      });
      const c1 = slim({ env: null }, fn);
      const c2 = slim({ env: [true, (x: any) => (x === true ? null : x)] }, fn);

      [c1, c2].forEach((c) => {
        expect(c.pure()).toEqual({ vars: { env: null }, foo: { bar: 2 } });
        expect(c.environment({ env: false }).pure()).toEqual({
          vars: { env: false },
          foo: { bar: 1 }
        });
        expect(c.environment({ env: undefined }).pure()).toEqual({
          vars: { env: undefined },
          foo: { bar: 1 }
        });
      });
    });
  });
});
