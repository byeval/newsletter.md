type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts", { cache: "no-store" });
  const data = (await res.json()) as { posts?: Post[] };
  return data.posts ?? [];
}

async function getUser(): Promise<{ username: string | null } | null> {
  const res = await fetch("/api/me", { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json() as { user?: { username: string | null } };
  return data.user ?? null;
}

export default async function PostsPage() {
  const posts = await getPosts();
  const user = await getUser();
  return (
    <main className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-0">Posts</h1>
        <a href="/admin/editor" className="btn btn-primary">New Post</a>
      </div>
      
      {posts.length === 0 ? (
        <div className="card text-center text-muted">
          No posts found. <a href="/admin/editor">Write your first post.</a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post.id} className="card flex flex-col md:flex-row justify-between items-center" style={{ padding: "1rem 1.5rem" }}>
              <div className="w-full">
                <a href={`/admin/editor?id=${post.id}`} className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
                  {post.title}
                </a>
                <div className="text-sm text-muted mt-1">
                  Last updated: {new Date(post.updated_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className={`badge ${post.status === "published" ? "badge-success" : "badge-warning"}`}>
                  {post.status}
                </span>
                {user?.username ? (
                  <a href={`/u/${user.username}/${post.slug}`} className="text-sm btn btn-outline" style={{ padding: "0.4rem 0.8rem" }}>View Public</a>
                ) : null}
                <form
                  style={{ margin: 0, padding: 0, background: "none", border: "none", boxShadow: "none", width: "auto" }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (confirm("Are you sure you want to delete this post?")) {
                      fetch(`/api/posts/${post.id}`, { method: "DELETE" }).then(() => {
                        window.location.reload();
                      });
                    }
                  }}
                >
                  <button type="submit" className="btn btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
