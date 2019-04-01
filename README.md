# slimconf

[![Version](https://img.shields.io/npm/v/slimconf.svg)](https://www.npmjs.com/package/slimconf)
[![Build Status](https://img.shields.io/travis/rafamel/slimconf.svg)](https://travis-ci.org/rafamel/slimconf)
[![Coverage](https://img.shields.io/coveralls/rafamel/slimconf.svg)](https://coveralls.io/github/rafamel/slimconf)
[![Dependencies](https://img.shields.io/david/rafamel/slimconf.svg)](https://david-dm.org/rafamel/slimconf)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/slimconf.svg)](https://snyk.io/test/npm/slimconf)
[![License](https://img.shields.io/github/license/rafamel/slimconf.svg)](https://github.com/rafamel/slimconf/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/slimconf.svg)](https://www.npmjs.com/package/slimconf)

<!-- markdownlint-disable MD036 -->
**A slim configuration util**
<!-- markdownlint-enable MD036 -->

* [Install](#install)
* [Usage](#usage)
  * [`slim`](#slim)
  * [`requireEnv`](#requireenvvars-string-void)
* [Documentation](https://rafamel.github.io/slimconf)

## Install

[`npm install slimconf`](https://www.npmjs.com/package/slimconf)

## Usage

### `slim`

`slim` is the default function exported by `slimconf` - [see docs.](https://rafamel.github.io/slimconf/globals.html#slim)

#### With no environment variables

When the configuration doesn't depend on environment variables, it's possible to just call `slim` as follows:

```javascript
import slim from 'slimconf';

const config = slim({ foo: 'bar', baz: 'foobar', barbaz: { foobaz: 'slim' } });

// Get a path
config.get('barbaz.foobaz'); // 'slim'

// Set a value for a path
config.set('foo', { bar: 'baz' }); // { bar: 'baz' }
config.get('foo.bar'); // 'baz'

// Get the configuration object with no methods
config.pure(); // { foo: { bar: 'baz' }, baz: 'foobar', barbaz: { foobaz: 'slim' } }
```

#### With environment variables

When a configuration depends on environment variables, `slim` has the signature `slim(setup: ISetup, fn: TFn): TConfig`.

* `setup` sets up the environment variables the configuration depends on - [see docs.](https://rafamel.github.io/slimconf/interfaces/isetup.html)
* `fn` should be a configuration object returning function - [see docs.](https://rafamel.github.io/slimconf/globals.html#tfn)

##### Fundamentals

If our configuration depended on `process.env.NODE_ENV` and `process.env.FOO_ENV`, we'd use `slim` as follows:

```javascript
import slim from 'slimconf';

const setup = {
  env: process.env.NODE_ENV,
  fooenv: process.env.FOO_ENV
};

const config = slim(slim, (envs, on) => ({
  envs, // contains the current values for `env` and `fooenv`
  foo: 'bar',
  baz: on.env({
    default: 1,
    production: 2,
    development: 3,
    test: 4
  }),
  foobar: on.fooenv({
    default: 1,
    lorem: 2,
    ipsum: 3
  })
}));

// Get a path
config.get('baz'); // 1, 2, 3, or 4

// Set a value for a path
config.set('baz', { bar: 'baz' }); // { bar: 'baz' }
config.get('baz.bar'); // 'baz'

// Get the configuration object with no methods
config.pure();

// Get the configuration for a different set of environment variables values
const specific = config.environment({ env: 'test', fooenv: 'lorem' });

// You can use all methods as usual
specific.pure(); // { foo: 'bar', baz: 4, foobar: 2 }
specific.get('envs'); // { env: 'test', fooenv: 'lorem' }
```

##### Mapping environment variables

As an example of environment variables mapping, the following setup object maps to `'development'` when there's no `NODE_ENV`:

```javascript
const setup = {
  fooenv: process.env.MY_ENV_VARIABLE,
  env: {
    from: process.env.NODE_ENV,
    map: (env) => env === 'production' || env === 'test' ? env : 'development'
  }
};
const config = slim(slim, (envs, on) => ({
  foo: 'bar',
  baz: on.env({
    default: 1,
    production: 2,
    development: 3,
    test: 4
  }),
  foobar: on.fooenv({
    default: 1,
    lorem: 2,
    ipsum: 3
  })
}));

config
  .environment({ env: null, fooenv: 'ipsum' })
  .pure(); // { foo: 'bar', baz: 3, foobar: 3 }
```

### `requireEnv(...vars: string[]): void`

Requires the presence of a number of environment variables; if they are not present, it will throw - [see docs.](https://rafamel.github.io/slimconf/globals.html#requireenv)

As an example `requireEnv('NODE_ENV', 'MY_ENV_VARIABLE')` will throw if any of `process.env.NODE_ENV` and `process.env.MY_ENV_VARIABLE` don't exist.

```javascript
import { requireEnv } from 'slimconf';

requireEnv('NODE_ENV', 'MY_ENV_VARIABLE');
```
