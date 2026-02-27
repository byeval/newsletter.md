export function isValidUsername(value: string): boolean {
  if (value.length < 3 || value.length > 20) return false;
  if (!/^[a-z0-9_]+$/.test(value)) return false;
  if (value.startsWith("_")) return false;
  return true;
}
