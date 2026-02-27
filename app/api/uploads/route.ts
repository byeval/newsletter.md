import { getSessionFromCookie } from "../../lib/auth";
import { getBucket } from "../../lib/r2";

export async function POST(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.filename !== "string") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const bucket = getBucket();
  if (!bucket) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  const key = `uploads/${session.userId}/${body.filename}`;
  const uploadUrl = new URL(`https://example.invalid/${key}`);
  return Response.json({ upload_url: uploadUrl.toString(), key, public_url: "" });
}
