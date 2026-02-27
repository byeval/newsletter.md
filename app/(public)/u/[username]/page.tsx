import {
  getActiveThemeConfigByUserId,
  getUserByUsername,
  listPublishedPostsByUserId,
} from "../../../lib/models";

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
  const themeConfig = await getActiveThemeConfigByUserId(user.id);
  const brand = typeof themeConfig.brand === "string" ? themeConfig.brand : null;
  const primaryColor = typeof themeConfig.primary_color === "string" ? themeConfig.primary_color : null;
  const posts = await listPublishedPostsByUserId(user.id);
  return (
    <main>
      <h1 style={primaryColor ? { color: primaryColor } : undefined}>@{params.username}</h1>
      {brand ? <p>{brand}</p> : null}
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
