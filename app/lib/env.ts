export type Env = {
  DB: D1Database;
  BUCKET: R2Bucket;
  THEME_KV: KVNamespace;
  AUTH_SECRET: string;
};

export function getEnv(): Partial<Env> {
  return (globalThis as unknown as { env?: Partial<Env> }).env ?? {};
}
