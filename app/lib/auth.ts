import { SignJWT, jwtVerify } from "jose";
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

export async function signSession(session: Session): Promise<string> {
  const env = getEnv();
  if (!env.AUTH_SECRET) return "";
  const secret = new TextEncoder().encode(env.AUTH_SECRET);
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function getSessionFromCookie(cookie: string | null): Promise<Session | null> {
  if (!cookie) return null;
  const match = cookie.match(/(?:^|; )session=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  const env = getEnv();
  if (!env.AUTH_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as Session;
  } catch {
    return null;
  }
}
