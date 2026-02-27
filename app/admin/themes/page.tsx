type Theme = {
  id: string;
  slug: string;
  name: string;
  version: string;
};

async function getThemes(): Promise<Theme[]> {
  const res = await fetch("/api/themes", { cache: "no-store" });
  const data = (await res.json()) as { themes?: Theme[] };
  return data.themes ?? [];
}

export default async function ThemesPage() {
  const themes = await getThemes();
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
      <ul>
        {themes.map((theme) => (
          <li key={theme.id}>
            {theme.name} ({theme.slug}) v{theme.version}
          </li>
        ))}
      </ul>
    </main>
  );
}
