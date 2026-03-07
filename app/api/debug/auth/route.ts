import { getSessionFromCookie } from "../../../lib/auth";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie");
  const session = await getSessionFromCookie(cookie);
  return Response.json({ cookiePresent: !!cookie, session });
}
