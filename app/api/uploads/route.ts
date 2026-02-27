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
  const key = `uploads/${session.userId}/${Date.now()}-${body.filename}`;
  const uploadUrl = `/api/uploads?key=${encodeURIComponent(key)}`;
  const publicUrl = `/r2/${encodeURIComponent(key)}`;
  return Response.json({ upload_url: uploadUrl, key, public_url: publicUrl });
}

export async function PUT(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return Response.json({ error: "Missing key" }, { status: 400 });
  const bucket = getBucket();
  if (!bucket) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  const contentType = request.headers.get("content-type") ?? "application/octet-stream";
  await bucket.put(key, request.body ?? "", {
    httpMetadata: { contentType },
  });
  return Response.json({ key });
}
