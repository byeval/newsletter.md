import { getSessionFromCookie } from "../../lib/auth";
import { getUserById } from "../../lib/models";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie");
  const session = await getSessionFromCookie(cookie);
  if (!session) return Response.json({ user: null });
  const user = await getUserById(session.userId);
  return Response.json({ user });
}
