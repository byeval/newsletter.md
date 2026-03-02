import { getSessionFromCookie } from "../../lib/auth";
import { listAllSubscribers } from "../../lib/models";

export async function GET(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ subscribers: [] });
  const subscribers = await listAllSubscribers(session.userId);
  return Response.json({ subscribers });
}
