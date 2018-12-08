export default function requireEnv(...arr) {
  if (!arr.filter((x) => !process.env[x]).length) return;
  throw Error(`Required environment variables: ${arr.join(', ')}`);
}
