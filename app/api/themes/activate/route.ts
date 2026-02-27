import { getSessionFromCookie } from "../../../lib/auth";
import { getDb } from "../../../lib/db";

export async function POST(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json().catch(() => null)
    : Object.fromEntries(await request.formData().then((data) => data.entries()));
  if (!body || typeof body.theme_id !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const db = getDb();
  if (!db) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  await db.prepare("UPDATE user_themes SET is_active = 0 WHERE user_id = ?").bind(session.userId).run();
  await db
    .prepare(
      "INSERT INTO user_themes (user_id, theme_id, is_active, config_values) VALUES (?, ?, 1, '{}') ON CONFLICT(user_id, theme_id) DO UPDATE SET is_active = 1"
    )
    .bind(session.userId, body.theme_id)
    .run();
  return Response.json({ theme_id: body.theme_id, active: true });
}
