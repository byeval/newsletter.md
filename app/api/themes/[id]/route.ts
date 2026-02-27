import { getThemeById, parseThemeSchema } from "../../../lib/theme";

export async function GET(request: Request, context: { params: { id: string } }) {
  const theme = await getThemeById(context.params.id);
  if (!theme) return Response.json({ error: "Theme not found" }, { status: 404 });
  const schema = parseThemeSchema(theme.yaml_schema);
  if (!schema) return Response.json({ error: "Invalid schema" }, { status: 400 });
  return Response.json({ settings: schema.settings });
}
