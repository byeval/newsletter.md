import { getDb } from "../../lib/db";

export async function GET() {
  const db = getDb();
  if (!db) return Response.json({ themes: [] });
  const result = await db.prepare("SELECT id, slug, name, version FROM themes ORDER BY name ASC").all();
  return Response.json({ themes: result.results ?? [] });
}
