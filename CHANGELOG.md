# [0.7.0](https://github.com/rafamel/slimconf/compare/v0.6.0...v0.7.0) (2019-04-05)


### Code Refactoring

* **slim:** changes variable mapping api; renames type ISetup to IUse ([f2a6a42](https://github.com/rafamel/slimconf/commit/f2a6a42))
* **strategies:** renames rules to strategies; exports them as named exports ([07eaa3a](https://github.com/rafamel/slimconf/commit/07eaa3a))


### Features

* **envs:** adds envs: convenience utilities for environment variables ([78f7696](https://github.com/rafamel/slimconf/commit/78f7696))
* **fallback:** adds fallback ([aa4d71e](https://github.com/rafamel/slimconf/commit/aa4d71e))
* **strategies:** prevents mutations from having an effect over defaults ([c5d25f5](https://github.com/rafamel/slimconf/commit/c5d25f5))


### BREAKING CHANGES

* **envs:** `requireEnv` is now `envs.assert`
* **slim:** Mapping used to be done via an IEnvSetup object; the same result can no be achieved
by using a TUseMap array. Previous type ISetup has also been renamed to IUse.
* **strategies:** rules are now called strategies and are exported as named exports



# [0.6.0](https://github.com/rafamel/slimconf/compare/v0.5.0...v0.6.0) (2019-04-04)


### Code Refactoring

* **slim:** config callback w/ on as first argument and vars as second ([6029dd4](https://github.com/rafamel/slimconf/commit/6029dd4))
* **slim:** default values are now obtained from a defaults key (instead of default) ([efdfbf7](https://github.com/rafamel/slimconf/commit/efdfbf7))


### Features

* **slim:** adds merge rules ([cab1205](https://github.com/rafamel/slimconf/commit/cab1205))


### BREAKING CHANGES

* **slim:** for configs depending on environment variables, now TOn is sent as a first argument
to the callback and the environment variables values as a second argument.
* **slim:** default values, previously obtained from `IDefinition.default`, should now be in a
`defaults` key (note the final *s*). See `IDefinition`.
* **slim:** The default behavior doesn't shallow merges the value for an environment with the
default anymore. This can be now done via rules.



# [0.5.0](https://github.com/rafamel/slimconf/compare/v0.4.0...v0.5.0) (2019-04-02)


### Features

* adds web, node, and esnext specific builds ([8deb1e5](https://github.com/rafamel/slimconf/commit/8deb1e5))



# [0.4.0](https://github.com/rafamel/slimconf/compare/v0.3.0...v0.4.0) (2019-04-01)


### Code Refactoring

* exports config as default on entry point ([8d29e13](https://github.com/rafamel/slimconf/commit/8d29e13))


### Features

* **slim:** allows first argument as a configuration object (no setup) ([be53ecc](https://github.com/rafamel/slimconf/commit/be53ecc))
* **slim:** improves typings; uses object hash to id filters; splits up slim functions ([075cb3a](https://github.com/rafamel/slimconf/commit/075cb3a))
* renames IEnvSetup.default to IEnvSetup.from ([2790ad6](https://github.com/rafamel/slimconf/commit/2790ad6))


### BREAKING CHANGES

* environment variables were previously mapped via a IEnvSetup, which had a `default`
property. `IEnvSetup.default` has been renamed to `IEnvSetup.from`
* **slim:** You could previously pass `undefined` as a first argument to `slim()`, while the
second was always a configuration object returning function. Now, `slim()` takes either just one
argument (a configuration object), or a setup object as first and a configuration object returning
function as second argument.
* the previously named export `config` is now a default export



# [0.3.0](https://github.com/rafamel/slimconf/compare/v0.2.1...v0.3.0) (2019-01-11)



## [0.2.1](https://github.com/rafamel/slimconf/compare/v0.2.0...v0.2.1) (2019-01-10)



# [0.2.0](https://github.com/rafamel/slimconf/compare/v0.1.0...v0.2.0) (2019-01-10)



# [0.1.0](https://github.com/rafamel/slimconf/compare/v0.0.2...v0.1.0) (2018-12-08)



## [0.0.2](https://github.com/rafamel/slimconf/compare/v0.0.1...v0.0.2) (2018-12-07)



## 0.0.1 (2018-11-16)



