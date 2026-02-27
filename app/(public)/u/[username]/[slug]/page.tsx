import { renderMarkdown } from "../../../../lib/markdown";
import { getPublishedPostByUsernameSlug } from "../../../../lib/models";

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
  const html = post.html || renderMarkdown(post.markdown);
  return (
    <main>
      <h1>@{params.username}</h1>
      <h2>{post.title}</h2>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
