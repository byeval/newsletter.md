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
  const config = await getActiveThemeConfigByUserId(user.id);
  const brand = typeof config.brand === "string" ? config.brand : null;
  const logo = typeof config.logo === "string" ? config.logo : null;
  const primaryColor = typeof config.primary_color === "string" ? config.primary_color : null;
  const socialLinks = Array.isArray(config.social_links) ? config.social_links : [];
  const posts = await listPublishedPostsByUserId(user.id);
  return (
    <main>
      <h1 style={primaryColor ? { color: primaryColor } : undefined}>@{params.username}</h1>
      {brand ? <p>{brand}</p> : null}
      {logo ? <img src={logo} alt="Logo" /> : null}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/u/${params.username}/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
      {socialLinks.length ? (
        <footer>
          <ul>
            {socialLinks.map((link, index) => (
              <li key={`${link?.url ?? ""}-${index}`}>
                <a href={link?.url ?? "#"}>{link?.label ?? "Link"}</a>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </main>
  );
}
