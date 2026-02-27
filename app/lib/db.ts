import { getEnv } from "./env";

export function getDb(): D1Database | null {
  return getEnv().DB ?? null;
}
