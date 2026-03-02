import { getUserByUsername, addSubscriber } from "../../lib/models";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json().catch(() => null)
    : Object.fromEntries(await request.formData().then((data) => data.entries()));

  if (!body || typeof body.username !== "string" || typeof body.email !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await getUserByUsername(body.username);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const ok = await addSubscriber({
    id: crypto.randomUUID(),
    user_id: user.id,
    email: body.email.toLowerCase(),
    name: typeof body.name === "string" ? body.name : null,
    status: "active",
    created_at: new Date().toISOString(),
    unsubscribe_token: crypto.randomUUID(),
  });

  if (!ok) return Response.json({ error: "Already subscribed" }, { status: 409 });
  return Response.json({ success: true });
}
