import { getSessionFromCookie } from "../../lib/auth";
import { listAllSubscribers } from "../../lib/models";

export async function GET(request: Request) {
  const session = await getSessionFromCookie(request.headers.get("cookie"));
  if (!session) return Response.json({ subscribers: [] });
  const subscribers = await listAllSubscribers(session.userId);
  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    const header = "email,name,status,created_at";
    const lines = subscribers.map((s) =>
      [s.email, s.name ?? "", s.status, s.created_at]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    return new Response(csv, {
      headers: {
        "content-type": "text/csv",
        "content-disposition": "attachment; filename=letters-subscribers.csv",
      },
    });
  }
  return Response.json({ subscribers });
}
