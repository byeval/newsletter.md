export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.username !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  return Response.json({ username: body.username });
}
