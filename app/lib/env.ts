export type Env = {
  DB: D1Database;
  BUCKET: R2Bucket;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  SEND_EMAIL: {
    send: (message: {
      to: { email: string; name?: string }[];
      from: { email: string; name?: string };
      subject: string;
      html?: string;
      text?: string;
    }) => Promise<void>;
  };
  EMAIL_FROM: string;
  BASE_URL: string;
  GOOGLE_REDIRECT_URI: string;
};

export function getEnv(): Partial<Env> {
  const globalEnv = (globalThis as unknown as { env?: Partial<Env> }).env ?? {};
  const processEnv = (typeof process !== "undefined" ? process.env : {}) as Record<string, string | undefined>;
  const metaEnv = (typeof import.meta !== "undefined" ? (import.meta as { env?: Record<string, string | undefined> }).env : {}) ?? {};
  const withPrefix = (key: string) => metaEnv[`VITE_${key}`] ?? processEnv[`VITE_${key}`];
  return {
    ...globalEnv,
    AUTH_SECRET: globalEnv.AUTH_SECRET ?? processEnv.AUTH_SECRET ?? metaEnv.AUTH_SECRET ?? withPrefix("AUTH_SECRET"),
    GOOGLE_CLIENT_SECRET:
      globalEnv.GOOGLE_CLIENT_SECRET ??
      processEnv.GOOGLE_CLIENT_SECRET ??
      metaEnv.GOOGLE_CLIENT_SECRET ??
      withPrefix("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CLIENT_ID:
      globalEnv.GOOGLE_CLIENT_ID ??
      processEnv.GOOGLE_CLIENT_ID ??
      metaEnv.GOOGLE_CLIENT_ID ??
      withPrefix("GOOGLE_CLIENT_ID"),
    GOOGLE_REDIRECT_URI:
      globalEnv.GOOGLE_REDIRECT_URI ??
      processEnv.GOOGLE_REDIRECT_URI ??
      metaEnv.GOOGLE_REDIRECT_URI ??
      withPrefix("GOOGLE_REDIRECT_URI"),
    EMAIL_FROM: globalEnv.EMAIL_FROM ?? processEnv.EMAIL_FROM ?? metaEnv.EMAIL_FROM ?? withPrefix("EMAIL_FROM"),
    BASE_URL: globalEnv.BASE_URL ?? processEnv.BASE_URL ?? metaEnv.BASE_URL ?? withPrefix("BASE_URL"),
  } as Partial<Env>;
}
