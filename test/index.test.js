import iConfig, { requireEnv as iRequireEnv } from '~/index';
import config from '~/config';
import requireEnv from '~/require-env';

test(`exports config as default`, () => {
  expect(iConfig).toBe(config);
});
test(`exports requireEnv`, () => {
  expect(iRequireEnv).toBe(requireEnv);
});
