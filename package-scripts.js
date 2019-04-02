const path = require('path');
const project = require('./project.config');

/* Define functions */
const scripts = (x) => ({ scripts: x });
const ifelse = (x, a, b) => (x ? a || x : b || 'shx echo');
const series = (...x) => `(${x.map((y) => ifelse(y)).join(') && (')})`;

/* Get project config */
const dir = (file) => path.join(project.get('paths.root'), file);
const DOCS_DIR = project.get('paths.docs');
const TS = project.get('ext.ts') && project.get('typescript');
const EXT = TS
  ? project.get('ext.js') + ',' + project.get('ext.ts')
  : project.get('ext.js');
const DOT_EXT = '.' + EXT.replace(/,/g, ',.');
const { COMMIT, COMMITIZEN } = process.env;

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  build: {
    default: 'nps validate build.force',
    force: series(
      TS && `jake build:prepika["${project.get('paths.root')}"]`,
      'cross-env NODE_ENV=production pack build'
    )
  },
  publish: `cd "${dir('pkg')}" && npm publish`,
  watch: series(
    TS && `jake build:prepika["${project.get('paths.root')}"]`,
    `onchange "./src/**/*.{${EXT}}" --initial --kill -- ` +
      `jake clear run:exec["shx echo ⚡"] run:zero["nps private.watch"]`
  ),
  fix: [
    'prettier',
    `--write "./**/*.{${EXT},json,scss}"`,
    `--config "${dir('.prettierrc.js')}"`,
    `--ignore-path "${dir('.prettierignore')}"`
  ].join(' '),
  types: ifelse(TS, 'tsc --noEmit --emitDeclarationOnly false'),
  lint: {
    default: `eslint ./src ./test --ext ${DOT_EXT} -c ${dir('.eslintrc.js')}`,
    md: `markdownlint README.md --config ${dir('markdown.json')}`,
    scripts: 'jake lintscripts["' + project.get('paths.root') + '"]'
  },
  test: {
    default: series('nps lint types', 'cross-env NODE_ENV=test jest'),
    watch:
      `onchange "./{src,test}/**/*.{${EXT}}" --initial --kill -- ` +
      'jake clear run:exec["shx echo ⚡"] run:zero["nps test"]'
  },
  validate: series(
    // prettier-ignore
    COMMIT && !COMMITIZEN && 'jake run:conditional[' +
        `"\nCommits should be done via 'npm run commit'. Continue?",` +
        '"","exit 1",Yes,5]',
    'nps test lint.md lint.scripts',
    'jake run:zero["npm outdated"]',
    COMMIT && `jake run:conditional["\nCommit?","","exit 1",Yes,5]`
  ),
  docs: series(
    TS && `jake run:zero["shx rm -r \"${DOCS_DIR}\""]`,
    TS && `typedoc --out "${DOCS_DIR}" ./src`
  ),
  changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
  update: series('npm update --save/save-dev', 'npm outdated'),
  clean: series(
    `jake run:zero["shx rm -r pkg \"${DOCS_DIR}\" coverage CHANGELOG.md"]`,
    'shx rm -rf node_modules'
  ),
  // Private
  private: {
    watch:
      'concurrently "cross-env NODE_ENV=production pack build" "nps lint"' +
      ' -n pack,eslint -c blue,yellow',
    preversion: series(
      'shx echo "Recommended version bump is:"',
      'conventional-recommended-bump --preset angular --verbose',
      `jake run:conditional["\nContinue?","","exit 1",Yes]`
    ),
    version: series(
      'nps changelog',
      project.get('release.docs') && 'nps docs',
      project.get('release.build') && 'nps build',
      'git add .'
    )
  }
});
