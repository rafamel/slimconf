# slimconf

[![Version](https://img.shields.io/npm/v/slimconf.svg)](https://www.npmjs.com/package/slimconf)
[![Build Status](https://travis-ci.org/rafamel/slimconf.svg)](https://travis-ci.org/rafamel/slimconf)
[![Coverage](https://img.shields.io/coveralls/rafamel/slimconf.svg)](https://coveralls.io/github/rafamel/slimconf)
[![Dependencies](https://david-dm.org/rafamel/slimconf/status.svg)](https://david-dm.org/rafamel/slimconf)
[![Vulnerabilities](https://snyk.io/test/npm/slimconf/badge.svg)](https://snyk.io/test/npm/slimconf)
[![Issues](https://img.shields.io/github/issues/rafamel/slimconf.svg)](https://github.com/rafamel/slimconf/issues)
[![License](https://img.shields.io/github/license/rafamel/slimconf.svg)](https://github.com/rafamel/slimconf/blob/master/LICENSE)

<!-- markdownlint-disable MD036 -->
**A slim configuration util**
<!-- markdownlint-enable MD036 -->

## Install

[`npm install slimconf`](https://www.npmjs.com/package/slimconf)

## Usage

### `config(setup?: object, callback: Function): object`

* `setup`: *object, optional,* sets up the environment variables the configuration depends on.
  * As an example, if it depended on `process.env.NODE_ENV` and `process.env.MY_ENV_VARIABLE`, we'd set it up as follows: `{ env: process.env.NODE_ENV, myEnvVar: process.env.MY_ENV_VARIABLE }`.
  * We can also use it to map it in case of `undefined`. As an example, the following setup object maps to a `development` value when there's no `NODE_ENV`:

```javascript
const setup = {
  myEnvVar: process.env.MY_ENV_VARIABLE,
  env: {
    default: process.env.NODE_ENV,
    map(env) {
      return env === 'production' || env === 'test' ? env : 'development';
    }
  }
};
```

* `callback`: *function,* with signature `(obj: object, on: object): object`.
  * `obj`: *object,* with the same keys of the `setup` object, and values of the current environment.
  * `on`: *object,* with the same keys of the `setup` object, and values of a function taking an object that you can use to specify the values for each environment -the `default` key will be used if no specific value for an environment was specified.

`config()` will return an object with the same properties as its `callback`, with three additional methods:
  
* `get(path: string)`: Will return the value at `path` for the current environment, if it exists -otherwise it will throw. Example: `obj.get('logs.transports')`.
* `set(path: string, value: any)`: Will set the value at `path` for the current environment, if it exists -otherwise it will throw. Example: `obj.set('logs.transports', { console: false, file: false })`.
* `pure()`: Will return the configuration object without any of these method (`get()`, `set()`, `pure()`, and `environment()`).
* `environment(obj: object)`: Will return the configuration for a specific environment that might not be the current. As an example, we could access the configuration for a production environment when in a development environment: `obj.environment({ env: 'production' })`.

#### Usage example

File: `config.js`:

```javascript
import { config } from 'slimconf';

const setup = {
  env: {
    default: process.env.NODE_ENV,
    map(env) {
      return env === 'production' || env === 'test' ? env : 'development';
    }
  }
};

export default config(setup, ({ env }, on) => ({
  logs: {
    levels: { console: 'debug', file: 'info' },
    transports: on.env({
      default: { console: true, file: false },
      production: { console: false, file: true },
      test: { console: false, file: false }
    })
  }
}))
```

Some other file:

```javascript
import config from './config.js';

// Logs transports for the current environment
const logsTransports = config.get('logs.transports');

// Say we're in development and want to access the production config
const productionLogsTransports = config
  .environment({ env: 'production' })
  .get('logs.transports');

// ...use logsTransports and productionLogsTransports somehow
```

### `requireEnv(...vars: string[]): void`

Requires the presence of a number of environment variables; if they are not present, it will throw.

As an example `requireEnv('NODE_ENV', 'MY_ENV_VARIABLE')` will throw if any of `process.env.NODE_ENV` and `process.env.MY_ENV_VARIABLE` don't exist.

```javascript
import { requireEnv } from 'slimconf';

requireEnv('NODE_ENV', 'MY_ENV_VARIABLE');
```
