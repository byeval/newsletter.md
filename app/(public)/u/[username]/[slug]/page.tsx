import { renderMarkdown } from "../../../../lib/markdown";

type PageProps = {
  params: { username: string; slug: string };
};

export default async function PostPage({ params }: PageProps) {
  const html = renderMarkdown(`# ${params.slug}`);
  return (
    <main>
      <h1>@{params.username}</h1>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
