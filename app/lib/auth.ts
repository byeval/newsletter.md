import { getEnv } from "./env";

export type Session = {
  userId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

export async function verifyGoogleToken(idToken: string): Promise<Session | null> {
  if (!idToken) return null;
  return {
    userId: "user",
    email: "user@example.com",
    name: "User",
    avatarUrl: null,
  };
}

export function signSession(session: Session): string {
  const env = getEnv();
  if (!env.AUTH_SECRET) return "";
  return "signed";
}

export function getSessionFromCookie(cookie: string | null): Session | null {
  if (!cookie) return null;
  return null;
}
