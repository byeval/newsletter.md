type Theme = {
  id: string;
  slug: string;
  name: string;
  version: string;
};

type ThemeSchema = {
  settings: Record<string, { type?: string }>;
};

async function getThemes(): Promise<Theme[]> {
  const res = await fetch("/api/themes", { cache: "no-store" });
  const data = (await res.json()) as { themes?: Theme[] };
  return data.themes ?? [];
}

async function getThemeSchema(themeId: string): Promise<ThemeSchema | null> {
  const res = await fetch(`/api/themes/${themeId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as ThemeSchema;
}

export default async function ThemesPage() {
  const themes = await getThemes();
  const schemaById = new Map<string, ThemeSchema>();
  for (const theme of themes) {
    const schema = await getThemeSchema(theme.id);
    if (schema) schemaById.set(theme.id, schema);
  }
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
            <form method="post" action="/api/themes/config">
              <input name="theme_id" type="hidden" value={theme.id} />
              {Object.entries(schemaById.get(theme.id)?.settings ?? {}).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input name={`config_values.${key}`} type={value.type === "color" ? "color" : "text"} />
                </label>
              ))}
              <button type="submit">Save config</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
