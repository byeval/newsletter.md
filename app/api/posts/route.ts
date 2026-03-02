import { getSessionFromCookie } from "../../lib/auth";
import { createPost, listPosts, listActiveSubscribers, getUserById } from "../../lib/models";
import { renderMarkdown } from "../../lib/markdown";
import { sendEmail } from "../../lib/email";
import { getEnv } from "../../lib/env";

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
  const coverUrl = typeof body.cover_url === "string" ? body.cover_url : null;
  const html = renderMarkdown(markdown);
  const slug = typeof body.slug === "string" ? body.slug : body.title.toLowerCase().replace(/\s+/g, "-");
  const status = typeof body.status === "string" ? body.status : "draft";
  const id = createId();
  await createPost({
    id,
    user_id: session.userId,
    title: body.title,
    slug,
    cover_url: coverUrl,
    markdown,
    html,
    status,
    created_at: now,
    updated_at: now,
    published_at: status === "published" ? now : null,
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
  return Response.json({ id, status });
}
