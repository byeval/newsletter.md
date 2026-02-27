import { getSessionFromCookie } from "../../../lib/auth";
import { setUsername } from "../../../lib/models";
import { isValidUsername } from "../../../lib/validators";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json().catch(() => null)
    : Object.fromEntries(await request.formData().then((data) => data.entries()));
  if (!body || typeof body.username !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const username = body.username.toLowerCase();
  if (!isValidUsername(username)) {
    return Response.json({ error: "Invalid username" }, { status: 400 });
  }
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await setUsername(session.userId, username);
  if (!ok) return Response.json({ error: "Username taken" }, { status: 409 });
  return Response.json({ username });
}
