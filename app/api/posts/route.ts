import { getSessionFromCookie } from "../../lib/auth";
import { createPost, listPosts } from "../../lib/models";
import { renderMarkdown } from "../../lib/markdown";

function createId() {
  return crypto.randomUUID();
}

export async function GET(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ posts: [] });
  const posts = await listPosts(session.userId);
  return Response.json({ posts });
}

export async function POST(request: Request) {
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
  const id = createId();
  await createPost({
    id,
    user_id: session.userId,
    title: body.title,
    slug,
    markdown,
    html,
    status,
    created_at: now,
    updated_at: now,
    published_at: status === "published" ? now : null,
  });
  return Response.json({ id, status });
}
