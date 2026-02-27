export default function ThemesPage() {
  return (
    <main>
      <h1>Themes</h1>
      <form method="post" action="/api/themes/activate">
        <label>
          Theme ID
          <input name="theme_id" type="text" />
        </label>
        <button type="submit">Activate</button>
      </form>
    </main>
  );
}
