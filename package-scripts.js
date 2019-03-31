const path = require('path');
const project = require('./project.config');

/* Define functions */
const scripts = (x) => ({ scripts: x });
const ifelse = (x, a, b) => (x ? a || x : b || 'shx echo');
const series = (...x) => `(${x.map((y) => ifelse(y)).join(') && (')})`;

/* Get project config */
const dir = (file) => path.join(project.get('paths.root'), file);
const OUT_DIR = project.get('paths.output');
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
    default: 'cross-env NODE_ENV=production nps validate build.dev',
    dev: 'nps build.prepare build.transpile build.declaration',
    prepare: series(
      `jake run:zero["shx rm -r \"${OUT_DIR}\""]`,
      `shx mkdir "${OUT_DIR}"`,
      `jake fixpackage["${project.get('paths.root')}","${OUT_DIR}"]`,
      `jake run:zero["shx cp README* LICENSE* CHANGELOG* \"${OUT_DIR}/\""]`
    ),
    transpile: `babel src --out-dir "${OUT_DIR}" --extensions ${DOT_EXT} --source-maps inline`,
    declaration: series(
      TS && `ttsc --project ttsconfig.json --outDir "${OUT_DIR}"`,
      TS && `jake cpr["./src","${OUT_DIR}",d.ts]`,
      `shx echo "${TS ? 'Declaration files built' : ''}"`
    )
  },
  publish: `cd "${OUT_DIR}" && npm publish`,
  watch: series(
    'nps build.prepare',
    `onchange "./src/**/*.{${EXT}}" --initial --kill -- ` +
      `jake clear run:exec["shx echo ⚡"] run:zero["nps private.watch"]`
  ),
  fix: {
    default: 'nps fix.format fix.md',
    format: [
      'prettier',
      `--write "./**/*.{${EXT},json,scss}"`,
      `--config "${dir('.prettierrc.js')}"`,
      `--ignore-path "${dir('.prettierignore')}"`
    ].join(' '),
    md:
      "mdspell --en-us '**/*.md' '!**/CHANGELOG.md' '!**/node_modules/**/*.md' '!**/lib/**/*.md'"
  },
  types: ifelse(TS, 'tsc'),
  lint: {
    default: `eslint ./src ./test --ext ${DOT_EXT} -c ${dir('.eslintrc.js')}`,
    md: series(
      `markdownlint README.md --config ${dir('markdown.json')}`,
      "mdspell -r --en-us '**/*.md' '!**/CHANGELOG.md' '!**/node_modules/**/*.md' '!**/lib/**/*.md'"
    ),
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
    `jake run:zero["shx rm -r \"${OUT_DIR}\" \"${DOCS_DIR}\" coverage CHANGELOG.md"]`,
    'shx rm -rf node_modules'
  ),
  // Private
  private: {
    watch:
      'concurrently "nps build.transpile" "nps build.declaration" "nps lint"' +
      ' -n babel,tsc,eslint -c green,magenta,yellow',
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
