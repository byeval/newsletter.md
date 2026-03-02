import { unsubscribeByToken } from "../../../lib/models";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return Response.json({ success: false }, { status: 400 });
  const ok = await unsubscribeByToken(token);
  if (!ok) return Response.json({ success: false }, { status: 404 });
  return Response.json({ success: true });
}
