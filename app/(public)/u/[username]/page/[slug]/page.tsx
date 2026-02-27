import { getPublishedPageByUsernameSlug } from "../../../../../lib/models";

type PageProps = {
  params: { username: string; slug: string };
};

export default async function CustomPage({ params }: PageProps) {
  const page = await getPublishedPageByUsernameSlug(params.username, params.slug);
  if (!page) {
    return (
      <main>
        <h1>@{params.username}</h1>
        <p>Page not found.</p>
      </main>
    );
  }
  return (
    <main>
      <h1>@{params.username}</h1>
      <h2>{page.title}</h2>
      <article dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}
