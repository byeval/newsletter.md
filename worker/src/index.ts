import { Hono } from "hono";

type Env = {
  Bindings: {
    DB: D1Database;
    BUCKET: R2Bucket;
    THEME_KV: KVNamespace;
  };
};

const app = new Hono<Env>();

app.get("/api/health", (c) => {
  return c.json({ ok: true });
});

app.get("/api/me", (c) => {
  return c.json({ user: null });
});

app.post("/api/auth/google", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.id_token !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ user: null });
});

app.post("/api/username/claim", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.username !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ username: body.username });
});

app.get("/api/themes", (c) => {
  return c.json({ themes: [] });
});

app.post("/api/themes/activate", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.theme_id !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ theme_id: body.theme_id, active: true });
});

app.put("/api/themes/config", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.theme_id !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ theme_id: body.theme_id, config_values: body.config_values ?? {} });
});

app.get("/api/posts", (c) => {
  return c.json({ posts: [] });
});

app.post("/api/posts", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.title !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ id: "draft", status: "draft" });
});

app.put("/api/posts/:id", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.title !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ id: c.req.param("id"), status: body.status ?? "draft" });
});

app.post("/api/uploads", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.filename !== "string") {
    return c.json({ error: "Invalid payload" }, 400);
  }
  return c.json({ upload_url: "", key: "", public_url: "" });
});

app.get("/@:username", (c) => {
  const username = c.req.param("username");
  return c.text(`@${username} homepage`);
});

app.get("/@:username/:slug", (c) => {
  const username = c.req.param("username");
  const slug = c.req.param("slug");
  return c.text(`@${username} post ${slug}`);
});

app.get("/@:username/page/:slug", (c) => {
  const username = c.req.param("username");
  const slug = c.req.param("slug");
  return c.text(`@${username} page ${slug}`);
});

app.notFound((c) => c.json({ error: "Not Found" }, 404));

export default app;
