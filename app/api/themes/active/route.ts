import { getSessionFromCookie } from "../../../lib/auth";
import { getDb } from "../../../lib/db";

export async function GET(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ theme_id: null, config_values: {} });
  const db = getDb();
  if (!db) return Response.json({ theme_id: null, config_values: {} });
  const result = await db
    .prepare("SELECT theme_id, config_values FROM user_themes WHERE user_id = ? AND is_active = 1 LIMIT 1")
    .bind(session.userId)
    .first<{ theme_id: string; config_values: string }>();
  let configValues: Record<string, unknown> = {};
  if (result?.config_values) {
    try {
      configValues = JSON.parse(result.config_values) as Record<string, unknown>;
    } catch {
      configValues = {};
    }
  }
  return Response.json({ theme_id: result?.theme_id ?? null, config_values: configValues });
}
