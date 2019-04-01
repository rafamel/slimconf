/**
 * Requires the presence of a number of environment variables; if they are not present, it will throw.
 */
export default function requireEnv(...arr: string[]): void {
  if (!arr.filter((x) => !process.env[x]).length) return;
  throw Error(`Required environment variables: ${arr.join(', ')}`);
}
