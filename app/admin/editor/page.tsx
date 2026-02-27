import UploadWidget from "./UploadWidget";

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
          <input id="cover_url" name="cover_url" type="text" />
        </label>
        <UploadWidget />
        <label>
          Status
          <select name="status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label>
          Pin on profile
          <input name="pinned" type="checkbox" value="1" />
        </label>
        <button type="submit">Save draft</button>
      </form>
    </main>
  );
}
