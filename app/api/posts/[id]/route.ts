export async function PUT(request: Request, context: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  return Response.json({ id: context.params.id, status: body.status ?? "draft" });
}
