import { getSessionFromCookie } from "../../../lib/auth";
import { getThemeById, validateThemeConfig } from "../../../lib/theme";
import { getDb } from "../../../lib/db";

export async function PUT(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.theme_id !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const theme = await getThemeById(body.theme_id);
  if (!theme) return Response.json({ error: "Theme not found" }, { status: 404 });
  const schema = JSON.parse(theme.yaml_schema) as { name: string; version: string; settings: Record<string, unknown> };
  const ok = validateThemeConfig(schema as never, body.config_values ?? {});
  if (!ok) return Response.json({ error: "Invalid config" }, { status: 400 });
  const db = getDb();
  if (!db) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  await db
    .prepare("UPDATE user_themes SET config_values = ? WHERE user_id = ? AND theme_id = ?")
    .bind(JSON.stringify(body.config_values ?? {}), session.userId, body.theme_id)
    .run();
  return Response.json({ theme_id: body.theme_id, config_values: body.config_values ?? {} });
}
