import { signSession, verifyGoogleToken } from "../../../lib/auth";
import { createUser, getUserByGoogleId } from "../../../lib/models";
import { getEnv } from "../../../lib/env";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id_token !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await verifyGoogleToken(body.id_token);
  if (!session) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const existing = await getUserByGoogleId(session.userId);
  if (!existing) {
    await createUser({
      id: session.userId,
      google_id: session.userId,
      email: session.email,
      name: session.name ?? null,
      avatar_url: session.avatarUrl ?? null,
      username: null,
      created_at: new Date().toISOString(),
    });
  }

  const token = await signSession(session);
  const headers = new Headers();
  if (token) {
    headers.append(
      "Set-Cookie",
      `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );
  }

  return Response.json({ user: session }, { headers });
}

export async function GET() {
  const env = getEnv();
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return Response.json({ error: "OAuth not configured" }, { status: 500 });
  }
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.GOOGLE_REDIRECT_URI);
  url.searchParams.set("response_type", "token");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  return Response.redirect(url.toString(), 302);
}
