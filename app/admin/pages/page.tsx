type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
};

async function getPages(): Promise<Page[]> {
  const res = await fetch("/api/pages", { cache: "no-store" });
  const data = (await res.json()) as { pages?: Page[] };
  return data.pages ?? [];
}

export default async function PagesPage() {
  const pages = await getPages();
  return (
    <main>
      <h1>Pages</h1>
      <form method="post" action="/api/pages">
        <label>
          Title
          <input name="title" type="text" />
        </label>
        <label>
          Slug
          <input name="slug" type="text" />
        </label>
        <label>
          Markdown
          <textarea name="markdown" rows={6} />
        </label>
        <label>
          Status
          <select name="status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            {page.title} ({page.status})
          </li>
        ))}
      </ul>
    </main>
  );
}
