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
    const res = await fetch(`/api/posts/${searchParams.id}`, { cache: "no-store" });
    const data = await res.json() as { post?: Post | null };
    post = data.post ?? null;
  }

  const isEditing = !!post;
  const actionUrl = isEditing ? `/api/posts/${post?.id}` : "/api/posts";

  return (
    <main className="mt-6" style={{ maxWidth: "1000px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-0">{isEditing ? "Edit Post" : "New Post"}</h1>
        <a href="/admin/posts" className="btn btn-outline">Cancel</a>
      </div>

      <form
        id="editor-form"
        method="post"
        action={actionUrl}
        style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}
        className="flex flex-col md:flex-row gap-6"
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
        <div className="card flex-col flex-1" style={{ minWidth: "0" }}>
          <label>
            Title
            <input name="title" type="text" style={{ fontSize: "1.25rem", fontWeight: "bold" }} defaultValue={post?.title ?? ""} placeholder="Post title..." required />
          </label>
          <label className="mt-4" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            Markdown Content
            <textarea name="markdown" style={{ minHeight: "500px", fontFamily: "SFMono-Regular, Consolas, Monaco, monospace", resize: "vertical" }} defaultValue={post?.markdown ?? ""} placeholder="Write your post content using Markdown..." required />
          </label>
        </div>

        <div className="flex flex-col gap-6" style={{ width: "100%", maxWidth: "320px", flexShrink: 0 }}>
          <div className="card">
            <h3 className="text-lg font-bold mb-4 mt-0">Publishing</h3>
            <label>
              Status
              <select name="status" defaultValue={post?.status ?? "draft"}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="mt-4">
              URL Slug
              <input name="slug" type="text" defaultValue={post?.slug ?? ""} placeholder="Auto-generated if empty" />
            </label>
            <button type="submit" className="btn btn-primary w-full mt-6">
              {isEditing ? "Update Post" : "Save Post"}
            </button>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4 mt-0">Media</h3>
            <label>
              Cover Image URL
              <input id="cover_url" name="cover_url" type="text" defaultValue={post?.cover_url ?? ""} placeholder="https://" />
            </label>
            <div className="mt-4 text-sm">
              <UploadWidget />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
