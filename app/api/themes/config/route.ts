export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.theme_id !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  return Response.json({ theme_id: body.theme_id, config_values: body.config_values ?? {} });
}
