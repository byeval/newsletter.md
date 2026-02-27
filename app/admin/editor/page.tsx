export default function EditorPage() {
  return (
    <main>
      <h1>Editor</h1>
      <form method="post" action="/api/posts">
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
          <textarea name="markdown" rows={12} />
        </label>
        <button type="submit">Save draft</button>
      </form>
    </main>
  );
}
