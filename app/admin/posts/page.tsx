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
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>
              <a href={`/admin/editor?id=${post.id}`}>{post.title}</a>
            </strong>
            <span>
              ({post.status})
              {user?.username ? (
                <> - <a href={`/u/${user.username}/${post.slug}`}>View Public</a></>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
