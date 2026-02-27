import { getUserByUsername, listPublishedPostsByUserId } from "../../../lib/models";

type PageProps = {
  params: { username: string };
};

export default async function UserHomePage({ params }: PageProps) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    return (
      <main>
        <h1>@{params.username}</h1>
        <p>User not found.</p>
      </main>
    );
  }
  const posts = await listPublishedPostsByUserId(user.id);
  return (
    <main>
      <h1>@{params.username}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/u/${params.username}/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
