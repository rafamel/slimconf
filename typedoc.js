const pkg = require('./package.json');
const path = require('path');
const project = require('./project.config');

module.exports = {
  name: `${pkg.name} ${pkg.version}`,
  mode: 'file',
  module: 'system',
  theme: 'default',
  includeDeclarations: true,
  excludePrivate: true,
  excludeProtected: true,
  excludeExternals: true,
  excludePrivate: true,
  excludeNotExported: false,
  readme: path.join(project.get('paths.root'), 'README.md'),
  exclude: [
    '**/internal/**/*.ts',
    '**/slim/full/**/*.ts',
    '**/slim/bare.ts',
    '**/slim/get.ts',
    '**/slim/set.ts',
    '**/slim/verify.ts'
  ]
};
