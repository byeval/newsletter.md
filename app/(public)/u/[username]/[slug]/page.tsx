import { renderMarkdown } from "../../../../lib/markdown";
import { getPublishedPostByUsernameSlug, getUserByUsername } from "../../../../lib/models";

type PageProps = {
  params: { username: string; slug: string };
};

export default async function PostPage({ params }: PageProps) {
  const post = await getPublishedPostByUsernameSlug(params.username, params.slug);
  if (!post) {
    return (
      <main>
        <h1>@{params.username}</h1>
        <p>Post not found.</p>
      </main>
    );
  }
  const user = await getUserByUsername(params.username);
  const html = post.html || renderMarkdown(post.markdown);
  return (
    <main className="mx-auto" style={{ maxWidth: "800px", padding: "2rem 1rem", marginTop: "2rem" }}>
      <nav className="mb-12 flex items-center justify-between">
        <a href={`/u/${params.username}`} className="flex items-center gap-3 text-muted" style={{ textDecoration: "none" }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : null}
          <span className="font-medium hover:underline">
            {user?.name || `@${params.username}`}
          </span>
        </a>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ lineHeight: 1.2 }}>
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-muted mb-8">
          <time dateTime={post.published_at || post.created_at}>
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <span>•</span>
          <span>By {user?.name || `@${params.username}`}</span>
        </div>
        {post.cover_url && (
          <img 
            src={post.cover_url} 
            alt={post.title} 
            className="w-full rounded-xl object-cover mb-12 shadow-sm" 
            style={{ maxHeight: "60vh" }} 
          />
        )}
      </header>

      <article 
        style={{ fontSize: "1.125rem", color: "var(--text-color)" }}
        dangerouslySetInnerHTML={{ __html: html }} 
      />

      <section className="card glass mt-16 mt-12 md:mt-24">
        <h2 className="text-2xl font-bold mb-2 text-center">Subscribe to {user?.name || `@${params.username}`}</h2>
        <p className="text-muted mb-6 text-center">Get new posts delivered directly to your inbox.</p>
        <form method="post" action="/api/subscribe" className="bg-transparent border-0 shadow-none p-0 max-w-md mx-auto">
          <input type="hidden" name="username" value={params.username} />
          <label>
            Name (optional)
            <input name="name" type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <button type="submit" className="btn btn-primary w-full mt-2">Subscribe</button>
        </form>
      </section>

    </main>
  );
}
