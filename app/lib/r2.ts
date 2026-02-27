import { getEnv } from "./env";

export function getBucket(): R2Bucket | null {
  return getEnv().BUCKET ?? null;
}
