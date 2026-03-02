import { getSessionFromCookie } from "../../../lib/auth";
import { deletePost, getPostById, updatePost, listActiveSubscribers, getUserById } from "../../../lib/models";
import { renderMarkdown } from "../../../lib/markdown";
import { sendEmail } from "../../../lib/email";
import { getEnv } from "../../../lib/env";

export async function GET(request: Request, context: { params: { id: string } }) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ post: null });
  const post = await getPostById(session.userId, context.params.id);
  return Response.json({ post });
}

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

  if (status === "published") {
    const env = getEnv();
    const author = await getUserById(session.userId);
    const subscribers = await listActiveSubscribers(session.userId);
    if (env.BASE_URL && author && subscribers.length > 0) {
      const postUrl = `${env.BASE_URL}/u/${author.username}/${slug}`;
      await sendEmail(
        subscribers.map((subscriber) => ({ email: subscriber.email, name: subscriber.name })),
        {
          subject: `${author.name || author.username} published: ${body.title}`,
          html: `<p>${author.name || author.username} published a new post.</p><p><a href="${postUrl}">${body.title}</a></p>`,
          text: `${author.name || author.username} published a new post: ${postUrl}`,
        }
      );
    }
  }
  return Response.json({ id: context.params.id, status });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await deletePost(context.params.id, session.userId);
  return Response.json({ success: true });
}
