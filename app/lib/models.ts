import { getDb } from "./db";

export type DbUser = {
  id: string;
  google_id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string;
};

export async function getUserByGoogleId(googleId: string): Promise<DbUser | null> {
  const db = getDb();
  if (!db) return null;
  const stmt = db.prepare("SELECT * FROM users WHERE google_id = ? LIMIT 1");
  const result = await stmt.bind(googleId).first<DbUser>();
  return result ?? null;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const db = getDb();
  if (!db) return null;
  const stmt = db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
  const result = await stmt.bind(id).first<DbUser>();
  return result ?? null;
}

export async function getUserByUsername(username: string): Promise<DbUser | null> {
  const db = getDb();
  if (!db) return null;
  const stmt = db.prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
  const result = await stmt.bind(username).first<DbUser>();
  return result ?? null;
}

export async function createUser(data: DbUser): Promise<void> {
  const db = getDb();
  if (!db) return;
  const stmt = db.prepare(
    "INSERT INTO users (id, google_id, email, name, avatar_url, username, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  await stmt
    .bind(
      data.id,
      data.google_id,
      data.email,
      data.name,
      data.avatar_url,
      data.username,
      data.created_at
    )
    .run();
}

export async function setUsername(userId: string, username: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const exists = await db
    .prepare("SELECT 1 FROM users WHERE username = ? LIMIT 1")
    .bind(username)
    .first();
  if (exists) return false;
  await db.prepare("UPDATE users SET username = ? WHERE id = ?").bind(username, userId).run();
  return true;
}

export type DbPost = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  markdown: string;
  html: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type DbPage = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  markdown: string;
  html: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function getPublishedPostByUsernameSlug(
  username: string,
  slug: string
): Promise<DbPost | null> {
  const db = getDb();
  if (!db) return null;
  const stmt = db.prepare(
    "SELECT posts.* FROM posts JOIN users ON posts.user_id = users.id WHERE users.username = ? AND posts.slug = ? AND posts.status = 'published' LIMIT 1"
  );
  const result = await stmt.bind(username, slug).first<DbPost>();
  return result ?? null;
}

export async function listPosts(userId: string): Promise<DbPost[]> {
  const db = getDb();
  if (!db) return [];
  const stmt = db.prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY updated_at DESC");
  const result = await stmt.bind(userId).all<DbPost>();
  return result.results ?? [];
}

export async function listPublishedPostsByUserId(userId: string): Promise<DbPost[]> {
  const db = getDb();
  if (!db) return [];
  const stmt = db.prepare(
    "SELECT * FROM posts WHERE user_id = ? AND status = 'published' ORDER BY published_at DESC"
  );
  const result = await stmt.bind(userId).all<DbPost>();
  return result.results ?? [];
}

export async function createPost(post: DbPost): Promise<void> {
  const db = getDb();
  if (!db) return;
  const stmt = db.prepare(
    "INSERT INTO posts (id, user_id, title, slug, cover_url, markdown, html, status, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  await stmt
    .bind(
      post.id,
      post.user_id,
      post.title,
      post.slug,
      post.cover_url,
      post.markdown,
      post.html,
      post.status,
      post.created_at,
      post.updated_at,
      post.published_at
    )
    .run();
}

export async function updatePost(post: DbPost): Promise<void> {
  const db = getDb();
  if (!db) return;
  const stmt = db.prepare(
    "UPDATE posts SET title = ?, slug = ?, cover_url = ?, markdown = ?, html = ?, status = ?, updated_at = ?, published_at = ? WHERE id = ? AND user_id = ?"
  );
  await stmt
    .bind(
      post.title,
      post.slug,
      post.cover_url,
      post.markdown,
      post.html,
      post.status,
      post.updated_at,
      post.published_at,
      post.id,
      post.user_id
    )
    .run();
}

export async function listPages(userId: string): Promise<DbPage[]> {
  const db = getDb();
  if (!db) return [];
  const stmt = db.prepare("SELECT * FROM pages WHERE user_id = ? ORDER BY updated_at DESC");
  const result = await stmt.bind(userId).all<DbPage>();
  return result.results ?? [];
}

export async function createPage(page: DbPage): Promise<void> {
  const db = getDb();
  if (!db) return;
  const stmt = db.prepare(
    "INSERT INTO pages (id, user_id, title, slug, markdown, html, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  await stmt
    .bind(
      page.id,
      page.user_id,
      page.title,
      page.slug,
      page.markdown,
      page.html,
      page.status,
      page.created_at,
      page.updated_at
    )
    .run();
}

export async function updatePage(page: DbPage): Promise<void> {
  const db = getDb();
  if (!db) return;
  const stmt = db.prepare(
    "UPDATE pages SET title = ?, slug = ?, markdown = ?, html = ?, status = ?, updated_at = ? WHERE id = ? AND user_id = ?"
  );
  await stmt
    .bind(
      page.title,
      page.slug,
      page.markdown,
      page.html,
      page.status,
      page.updated_at,
      page.id,
      page.user_id
    )
    .run();
}

export async function getPublishedPageByUsernameSlug(
  username: string,
  slug: string
): Promise<DbPage | null> {
  const db = getDb();
  if (!db) return null;
  const stmt = db.prepare(
    "SELECT pages.* FROM pages JOIN users ON pages.user_id = users.id WHERE users.username = ? AND pages.slug = ? AND pages.status = 'published' LIMIT 1"
  );
  const result = await stmt.bind(username, slug).first<DbPage>();
  return result ?? null;
}

export async function getActiveThemeConfigByUserId(
  userId: string
): Promise<Record<string, unknown>> {
  const db = getDb();
  if (!db) return {};
  const result = await db
    .prepare("SELECT config_values FROM user_themes WHERE user_id = ? AND is_active = 1 LIMIT 1")
    .bind(userId)
    .first<{ config_values: string }>();
  if (!result?.config_values) return {};
  try {
    return JSON.parse(result.config_values) as Record<string, unknown>;
  } catch {
    return {};
  }
}
