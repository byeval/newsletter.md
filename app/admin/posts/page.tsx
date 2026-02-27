type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  pinned: number;
  updated_at: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts", { cache: "no-store" });
  const data = (await res.json()) as { posts?: Post[] };
  return data.posts ?? [];
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} ({post.status}){post.pinned ? " [pinned]" : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}
