# slimconf

[![Version](https://img.shields.io/npm/v/slimconf.svg)](https://www.npmjs.com/package/slimconf)
[![Build Status](https://img.shields.io/travis/rafamel/slimconf.svg)](https://travis-ci.org/rafamel/slimconf)
[![Coverage](https://img.shields.io/coveralls/rafamel/slimconf.svg)](https://coveralls.io/github/rafamel/slimconf)
[![Dependencies](https://img.shields.io/david/rafamel/slimconf.svg)](https://david-dm.org/rafamel/slimconf)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/slimconf.svg)](https://snyk.io/test/npm/slimconf)
[![License](https://img.shields.io/github/license/rafamel/slimconf.svg)](https://github.com/rafamel/slimconf/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/slimconf.svg)](https://www.npmjs.com/package/slimconf)

<div align="center">
  <br />
  <br />
  <a href="https://www.npmjs.com/package/slimconf" target="_blank">
    <img alt="slimconf" width="350" src="https://raw.githubusercontent.com/rafamel/slimconf/master/scripts/assets/logo.png" />
  </a>
  <br />
  <br />
  <strong>A slim configuration util that fits both the thin and bulky</strong>
  <br />
  <br />
</div>

## Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [`slim`](#slim)
    * [With no environment variables](#with-no-environment-variables)
    * [With environment variables](#with-environment-variables)
  * [Utils](#utils)
    * [Merge strategies](#merge-strategies)
      * [`shallow`](#shallow)
      * [`merge`](#merge)
      * [`deep`](#deep)
    * [`fallback`](#fallback)
    * [`envs`](#envs)
      * [`assert`](#assert)
      * [`constrain`](#constrain)
      * [`get`](#get)
* [Documentation](https://rafamel.github.io/slimconf/globals.html)

## Install

[`npm install slimconf`](https://www.npmjs.com/package/slimconf)

## Usage

### `slim`

`slim` is the default function exported by `slimconf` -[see docs.](https://rafamel.github.io/slimconf/globals.html#slim)

#### With no environment variables

When the configuration doesn't depend on environment variables, it's possible to just call `slim` as follows:

```javascript
import slim from 'slimconf';

const config = slim({ foo: 'bar', baz: 'foobar', barbaz: { foobaz: 'slim' } });

// Get a path safely -will throw if non existent
config.get('barbaz.foobaz'); // 'slim'

// Set a value for a path
config.set('foo', { bar: 'baz' }); // { bar: 'baz' }
config.get('foo.bar'); // 'baz'

// Get the configuration object with no methods
config.pure(); // { foo: { bar: 'baz' }, baz: 'foobar', barbaz: { foobaz: 'slim' } }
```

#### With environment variables

When a configuration depends on environment variables, `slim` has the signature `slim(use: IUse, fn: TFn): TConfig`.

* `use` passes up the environment variables the configuration depends on -[see docs.](https://rafamel.github.io/slimconf/interfaces/iuse.html)
* `fn` should be a configuration object returning function -[see docs.](https://rafamel.github.io/slimconf/globals.html#tfn)

##### Fundamentals

If our configuration depended on `process.env.NODE_ENV` and `process.env.FOO_ENV`, we'd use `slim` as follows:

```javascript
import slim from 'slimconf';

const config = slim(
  {
    env: process.env.NODE_ENV,
    fooenv: process.env.FOO_ENV
  },
  (on, vars) => ({
    vars, // contains the current values for `env` and `fooenv`
    foo: 'bar',
    baz: on.env({
      defaults: 1,
      production: 2,
      development: 3,
      test: 4
    }),
    foobar: on.fooenv({
      defaults: 1,
      lorem: 2,
      ipsum: 3
    })
  })
);

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
specific.get('vars'); // { env: 'test', fooenv: 'lorem' }
```

##### Using merge strategies

When defining the values for each environment, you can set up custom strategies to merge with the `defaults` -see docs for [`TOn`](https://rafamel.github.io/slimconf/globals.html#ton), [`TDefineFn`](https://rafamel.github.io/slimconf/globals.html#tdefinefn), and [`TStrategy`.](https://rafamel.github.io/slimconf/globals.html#tstrategy)

`slimconf` also exports a set of common strategies that can also be used independently to merge any two objects - see [merge strategies.](#merge-strategies)

```javascript
import slim, { shallow, merge, deep } from 'slimconf';

const config = slim(
  { env: process.env.NODE_ENV },
  (on, vars) => ({
    // Shallow merge
    foo: on.env(shallow, {
      defaults: {
        ports: [3000],
        transports: { console: true, file: false },
        levels: { console: 'debug', file: 'info' }
      },
      production: {
        ports: [80],
        transports: { console: true, file: true }
      }
    }),
    // Deep merge
    bar: on.env(merge, {
      defaults: {
        ports: [3000],
        transports: { console: true, file: false },
        levels: { console: 'debug', file: 'info' }
      },
      production: {
        ports: [80], // Will be: [80]
        transports: { file: true } // Will be: { console: true, file: false }
      }
    }),
    // Deep merge with concatenated arrays
    baz: on.env(deep, {
      defaults: {
        ports: [3000],
        transports: { console: true, file: false },
        levels: { console: 'debug', file: 'info' }
      },
      production: {
        ports: [80], // Will be: [3000, 80]
        transports: { file: true } // Will be: { console: true, file: false }
      }
    })
  })
);
```

##### Mapping environment variables

When mapping environment variables, it is beneficial to use the built in api for it, as it will allow for the map to also apply when using `TConfig.environment()` -see [`TConfig`](https://rafamel.github.io/slimconf/globals.html#tconfig) and [`IConfig`.](https://rafamel.github.io/slimconf/interfaces/iconfig.html)

As an example, the following setup object maps to `'development'` whenever the `NODE_ENV` variable is not `'production'` or `'test'`. `slimconf` also exports the [`fallback`](#fallback) function for precisely this use case.

```javascript
import slim, { fallback } from 'slimconf';

const use = {
  nodeEnv: [
    process.env.NODE_ENV,
    (use) => use === 'production' || use === 'test' ? use : 'development'
  ],
  // 'nodeEnv' and 'env' are equivalent
  env: [
    process.env.NODE_ENV,
    fallback('development', ['production', 'test'])
  ]
};
const config = slim(use, (on, vars) => ({
  bar: on.node({
    defaults: 1,
    production: 2,
    development: 3,
    test: 4
  }),
  baz: on.env({
    defaults: 1,
    production: 2,
    development: 3,
    test: 4
  })
}));

config
  .environment({ env: null, fooenv: 'ipsum' })
  .pure(); // { foo: 'bar', baz: 3, foobar: 3 }
```

### Utils

#### Merge strategies

Merge strategies [can be used with `slim`](#using-merge-strategies) or independently to merge any two objects.

##### `shallow`

Shallow merge for objects -[see docs.](https://rafamel.github.io/slimconf/globals.html#shallow)

```javascript
import { shallow } from 'slimconf';

shallow(
  { foo: { bar: 'baz' }, bar: [1, 2], baz: 'foobar' },
  { foo: { baz: 'bar' }, bar: [3, 4] },
); // { foo: { baz: 'bar' }, bar: [3, 4], baz: 'foobar' }
```

##### `merge`

Deep merge for objects, excluding arrays -[see docs.](https://rafamel.github.io/slimconf/globals.html#merge)

```javascript
import { merge } from 'slimconf';

merge(
  { foo: { bar: 'baz' }, bar: [1, 2], baz: 'foobar' },
  { foo: { baz: 'bar' }, bar: [3, 4] },
); // { foo: { bar: 'baz', baz: 'bar' }, bar: [3, 4], baz: 'foobar' }
```

##### `deep`

Deep merge for objects, including array concatenation -[see docs.](https://rafamel.github.io/slimconf/globals.html#deep)

```javascript
import { deep } from 'slimconf';

deep(
  { foo: { bar: 'baz' }, bar: [1, 2], baz: 'foobar' },
  { foo: { baz: 'bar' }, bar: [3, 4] },
); // { foo: { bar: 'baz', baz: 'bar' }, bar: [1, 2, 3, 4], baz: 'foobar' }
```

#### `fallback`

Returns a function that will return a fallback if a given value is `undefined` or, in its case, if it doesn't match a set of allowed values. It can be used [with `slim` for environment variables mapping](#mapping-environment-variables) or independently. [See docs.](https://rafamel.github.io/slimconf/globals.html#fallback)

```javascript
import { fallback } from 'slimconf';

// Sets 'development' as fallback if value is not defined
const fb = fallback('development');
fb(); // development
fb('foo') // foo

// Sets 'development' as fallback if value is not 'production' or 'test'
const fba = fallback('development', ['production', 'test']);

fba(); // development
fba('foo'); // development
fba('production'); // production
```

#### `envs`

A set of convenience utilities for environment variables. [See docs.](https://rafamel.github.io/slimconf/globals.html#envs)

##### `assert`

Requires any number of environment variables to be defined; throws otherwise. [See docs.](https://rafamel.github.io/slimconf/globals.html#assert)

```javascript
import { envs } from 'slimconf';

envs.assert('NODE_ENV', 'PUBLIC_URL');
```

##### `constrain`

Requires environment variable to be defined, throwing otherwise. If an array of allowed values are passed the value will be checked against them, throwing if its not contained in the array. [See docs.](https://rafamel.github.io/slimconf/globals.html#constrain)

```javascript
import { envs } from 'slimconf';

// Throws if undefined
envs.constrain('NODE_ENV');

// Throws if not 'production', 'development', or 'test'
envs.constrain('NODE_ENV', ['production', 'development', 'test']);
```

##### `get`

Same as `constrain`, but it returns the environment variable value. [See docs.](https://rafamel.github.io/slimconf/globals.html#get)

```javascript
import { envs } from 'slimconf';

// Throws if undefined
const nodeEnv = envs.get('NODE_ENV');
```