import UploadWidget from "./UploadWidget";

type PageProps = {
  searchParams: { id?: string };
};

type Post = {
  id: string;
  title: string;
  slug: string;
  markdown: string;
  cover_url: string | null;
  status: string;
};

export default async function EditorPage({ searchParams }: PageProps) {
  let post: Post | null = null;
  if (searchParams.id) {
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await res.json() as { posts?: Post[] };
    post = data.posts?.find((p) => p.id === searchParams.id) ?? null;
  }

  const isEditing = !!post;
  const actionUrl = isEditing ? `/api/posts/${post?.id}` : "/api/posts";

  return (
    <main>
      <h1>{isEditing ? "Edit Post" : "New Post"}</h1>
      <form
        id="editor-form"
        method="post"
        action={actionUrl}
        onSubmit={(e) => {
          if (isEditing) {
            e.preventDefault();
            const form = e.currentTarget;
            fetch(form.action, {
              method: "PUT",
              body: new FormData(form),
            }).then(() => {
              window.location.href = "/admin/posts";
            });
          }
        }}
      >
        <label>
          Title
          <input name="title" type="text" defaultValue={post?.title ?? ""} required />
        </label>
        <label>
          Slug
          <input name="slug" type="text" defaultValue={post?.slug ?? ""} />
        </label>
        <label>
          Markdown
          <textarea name="markdown" rows={12} defaultValue={post?.markdown ?? ""} required />
        </label>
        <label>
          Cover Image URL
          <input id="cover_url" name="cover_url" type="text" defaultValue={post?.cover_url ?? ""} />
        </label>
        <UploadWidget />
        <label>
          Status
          <select name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <button type="submit">{isEditing ? "Update Post" : "Save Post"}</button>
      </form>
    </main>
  );
}
