import { signSession, verifyGoogleToken } from "../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id_token !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await verifyGoogleToken(body.id_token);
  if (!session) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const token = signSession(session);
  const headers = new Headers();
  if (token) {
    headers.append(
      "Set-Cookie",
      `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );
  }

  return Response.json({ user: session }, { headers });
}
