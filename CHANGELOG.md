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



