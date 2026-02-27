import { signSession, verifyGoogleToken } from "../../../lib/auth";
import { createUser, getUserByGoogleId } from "../../../lib/models";

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
