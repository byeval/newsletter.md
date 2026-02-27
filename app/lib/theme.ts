import yaml from "js-yaml";
import { getDb } from "./db";

export type ThemeSchema = {
  name: string;
  version: string;
  settings: Record<string, ThemeField>;
};

export type ThemeField =
  | { type: "color"; default: string }
  | { type: "image"; default: string | null }
  | { type: "text"; default: string }
  | { type: "list"; item: Record<string, "string"> };

export type ThemeRecord = {
  id: string;
  slug: string;
  name: string;
  yaml_schema: string;
};

export async function getThemeById(id: string): Promise<ThemeRecord | null> {
  const db = getDb();
  if (!db) return null;
  const stmt = db.prepare("SELECT * FROM themes WHERE id = ? LIMIT 1");
  const result = await stmt.bind(id).first<ThemeRecord>();
  return result ?? null;
}

export function parseThemeSchema(yamlSchema: string): ThemeSchema | null {
  try {
    const data = yaml.load(yamlSchema) as ThemeSchema;
    if (!data || typeof data !== "object") return null;
    if (!data.name || !data.version || !data.settings) return null;
    return data;
  } catch {
    return null;
  }
}

export function validateThemeConfig(schema: ThemeSchema, values: Record<string, unknown>): boolean {
  for (const [key, field] of Object.entries(schema.settings)) {
    const value = values[key];
    if (value === undefined || value === null) continue;
    if (field.type === "color" || field.type === "text") {
      if (typeof value !== "string") return false;
    }
    if (field.type === "image") {
      if (value !== null && typeof value !== "string") return false;
    }
    if (field.type === "list") {
      if (!Array.isArray(value)) return false;
      for (const item of value) {
        if (typeof item !== "object" || !item) return false;
        for (const itemKey of Object.keys(field.item)) {
          if (typeof (item as Record<string, unknown>)[itemKey] !== "string") return false;
        }
      }
    }
  }
  return true;
}
