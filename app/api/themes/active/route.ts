import { getSessionFromCookie } from "../../../lib/auth";
import { getDb } from "../../../lib/db";

export async function GET(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ theme_id: null });
  const db = getDb();
  if (!db) return Response.json({ theme_id: null });
  const result = await db
    .prepare("SELECT theme_id FROM user_themes WHERE user_id = ? AND is_active = 1 LIMIT 1")
    .bind(session.userId)
    .first<{ theme_id: string }>();
  return Response.json({ theme_id: result?.theme_id ?? null });
}
