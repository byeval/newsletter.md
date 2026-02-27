import { getSessionFromCookie } from "../../../lib/auth";
import { updatePost } from "../../../lib/models";
import { renderMarkdown } from "../../../lib/markdown";

export async function PUT(request: Request, context: { params: { id: string } }) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const markdown = typeof body.markdown === "string" ? body.markdown : "";
  const coverUrl = typeof body.cover_url === "string" ? body.cover_url : null;
  const html = renderMarkdown(markdown);
  const slug = typeof body.slug === "string" ? body.slug : body.title.toLowerCase().replace(/\s+/g, "-");
  const status = typeof body.status === "string" ? body.status : "draft";
  const publishedAt = status === "published" ? now : null;
  await updatePost({
    id: context.params.id,
    user_id: session.userId,
    title: body.title,
    slug,
    cover_url: coverUrl,
    markdown,
    html,
    status,
    created_at: now,
    updated_at: now,
    published_at: publishedAt,
  });
  return Response.json({ id: context.params.id, status });
}
