import { getBucket } from "../../lib/r2";

export async function GET(request: Request, context: { params: { key: string[] } }) {
  const bucket = getBucket();
  if (!bucket) return new Response("Storage unavailable", { status: 503 });
  const key = context.params.key.join("/");
  const object = await bucket.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set("content-type", object.httpMetadata.contentType);
  }
  return new Response(object.body, { headers });
}
