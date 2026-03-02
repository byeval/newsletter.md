export type Env = {
  DB: D1Database;
  BUCKET: R2Bucket;
  AUTH_SECRET: string;
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
};

export function getEnv(): Partial<Env> {
  return (globalThis as unknown as { env?: Partial<Env> }).env ?? {};
}
