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
  const env = getEnv();
  if (!env.GOOGLE_CLIENT_ID) return null;
  const response = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken));
  if (!response.ok) return null;
  const payload = (await response.json()) as {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
    aud?: string;
  };
  if (!payload.sub || !payload.email) return null;
  if (payload.aud !== env.GOOGLE_CLIENT_ID) return null;
  return {
    userId: payload.sub,
    email: payload.email,
    name: payload.name ?? null,
    avatarUrl: payload.picture ?? null,
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
