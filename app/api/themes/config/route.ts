import { getSessionFromCookie } from "../../../lib/auth";
import { getThemeById, parseThemeSchema, validateThemeConfig } from "../../../lib/theme";
import { getDb } from "../../../lib/db";

export async function PUT(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json().catch(() => null)
    : Object.fromEntries(await request.formData().then((data) => data.entries()));
  if (!body || typeof body.theme_id !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const theme = await getThemeById(body.theme_id);
  if (!theme) return Response.json({ error: "Theme not found" }, { status: 404 });
  const schema = parseThemeSchema(theme.yaml_schema);
  if (!schema) return Response.json({ error: "Invalid theme schema" }, { status: 400 });
  const configValues = typeof body.config_values === "object" && body.config_values ? body.config_values : parseConfig(body);
  const ok = validateThemeConfig(schema, configValues);
  if (!ok) return Response.json({ error: "Invalid config" }, { status: 400 });
  const db = getDb();
  if (!db) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  await db
    .prepare("UPDATE user_themes SET config_values = ? WHERE user_id = ? AND theme_id = ?")
    .bind(JSON.stringify(configValues), session.userId, body.theme_id)
    .run();
  return Response.json({ theme_id: body.theme_id, config_values: configValues });
}

function parseConfig(body: Record<string, unknown>): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (!key.startsWith("config_values.")) continue;
    const configKey = key.slice("config_values.".length);
    config[configKey] = value;
  }
  return config;
}
