import { getSessionFromCookie } from "../../../lib/auth";
import { updatePage } from "../../../lib/models";
import { renderMarkdown } from "../../../lib/markdown";

export async function PUT(request: Request, context: { params: { id: string } }) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json().catch(() => null)
    : Object.fromEntries(await request.formData().then((data) => data.entries()));
  if (!body || typeof body.title !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const markdown = typeof body.markdown === "string" ? body.markdown : "";
  const html = renderMarkdown(markdown);
  const slug = typeof body.slug === "string" ? body.slug : body.title.toLowerCase().replace(/\s+/g, "-");
  const status = typeof body.status === "string" ? body.status : "draft";
  await updatePage({
    id: context.params.id,
    user_id: session.userId,
    title: body.title,
    slug,
    markdown,
    html,
    status,
    created_at: now,
    updated_at: now,
  });
  return Response.json({ id: context.params.id, status });
}
