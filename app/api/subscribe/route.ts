import { getUserByUsername, addSubscriber } from "../../lib/models";
import { sendEmail } from "../../lib/email";
import { getEnv } from "../../lib/env";

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

  const confirmToken = crypto.randomUUID();
  const ok = await addSubscriber({
    id: crypto.randomUUID(),
    user_id: user.id,
    email: body.email.toLowerCase(),
    name: typeof body.name === "string" ? body.name : null,
    status: "pending",
    created_at: new Date().toISOString(),
    confirm_token: confirmToken,
    unsubscribe_token: crypto.randomUUID(),
  });

  if (!ok) return Response.json({ error: "Already subscribed" }, { status: 409 });
  const env = getEnv();
  if (env.BASE_URL) {
    const confirmUrl = `${env.BASE_URL}/confirm?token=${confirmToken}`;
    await sendEmail(
      [{ email: body.email.toLowerCase(), name: typeof body.name === "string" ? body.name : null }],
      {
        subject: `Confirm your subscription to @${user.username}`,
        html: `<p>Click to confirm your subscription.</p><p><a href="${confirmUrl}">Confirm subscription</a></p>`,
        text: `Confirm your subscription: ${confirmUrl}`,
      }
    );
  }
  return Response.json({ success: true });
}
