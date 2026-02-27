export default function AdminHomePage() {
  return (
    <main>
      <h1>Admin</h1>
      <ul>
        <li>
          <a href="/admin/editor">Editor</a>
        </li>
        <li>
          <a href="/admin/posts">Posts</a>
        </li>
        <li>
          <a href="/admin/themes">Themes</a>
        </li>
        <li>
          <a href="/admin/profile">Profile</a>
        </li>
      </ul>
    </main>
  );
}
