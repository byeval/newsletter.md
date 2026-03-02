import { getUserByUsername, listPublishedPostsByUserId } from "../../../lib/models";

type PageProps = {
  params: { username: string };
};

export default async function UserHomePage({ params }: PageProps) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    return (
      <main className="mt-12 text-center">
        <h1 className="text-2xl font-bold">@{params.username}</h1>
        <p className="text-muted mt-2">User not found.</p>
      </main>
    );
  }
  
  const posts = await listPublishedPostsByUserId(user.id);
  const headerText = user.name || `@${user.username}`;
  
  return (
    <main className="mt-12 mx-auto" style={{ maxWidth: "700px" }}>
      <header className="flex flex-col items-center text-center mb-12">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" />
        ) : null}

        <h1 className="text-4xl font-bold mb-2">
          {headerText}
        </h1>
      </header>

      <div className="flex flex-col gap-6">
        {posts.length === 0 ? (
          <div className="card glass text-center text-muted flex flex-col items-center justify-center p-12 gap-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-50"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <p className="text-lg">No posts published yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card glass hover:translate-y-sm transition-transform">
              <a 
                href={`/u/${params.username}/${post.slug}`} 
                className="text-2xl font-bold mb-2 block" 
                style={{ color: "var(--text-color)", textDecoration: "none" }}
              >
                {post.title}
              </a>
              <p className="text-muted text-sm m-0">
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))
        )}
      </div>

      <section className="card glass mt-12 bg-primary/5">
        <h2 className="text-2xl font-bold mb-2 text-center">Subscribe</h2>
        <p className="text-muted mb-6 text-center">Get new posts delivered to your inbox.</p>
        <form method="post" action="/api/subscribe" className="bg-transparent border-0 shadow-none p-0">
          <input type="hidden" name="username" value={params.username} />
          <label>
            Name (optional)
            <input name="name" type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <button type="submit" className="btn btn-primary w-full md:w-auto self-center mt-2">Subscribe</button>
        </form>
      </section>

    </main>
  );
}
