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
        <label>
          Cover Image URL
          <input name="cover_url" type="text" />
        </label>
        <label>
          Status
          <select name="status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <button type="submit">Save draft</button>
      </form>
    </main>
  );
}
