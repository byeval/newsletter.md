import { renderMarkdown } from "../../../../lib/markdown";
import {
  getActiveThemeConfigByUserId,
  getPublishedPostByUsernameSlug,
  getUserByUsername,
} from "../../../../lib/models";

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
  const themeConfig = user ? await getActiveThemeConfigByUserId(user.id) : {};
  const brand = typeof themeConfig.brand === "string" ? themeConfig.brand : null;
  const logo = typeof themeConfig.logo === "string" ? themeConfig.logo : null;
  const primaryColor = typeof themeConfig.primary_color === "string" ? themeConfig.primary_color : null;
  const socialLinks = Array.isArray(themeConfig.social_links) ? themeConfig.social_links : [];
  const html = post.html || renderMarkdown(post.markdown);
  return (
    <main>
      <header>
        <h1 style={primaryColor ? { color: primaryColor } : undefined}>@{params.username}</h1>
        {brand ? <p>{brand}</p> : null}
        {logo ? <img src={logo} alt="Logo" /> : null}
      </header>
      <h2>{post.title}</h2>
      {post.cover_url ? <img src={post.cover_url} alt="Cover" /> : null}
      <article dangerouslySetInnerHTML={{ __html: html }} />
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
