type PageProps = {
  searchParams: { token?: string };
};

async function unsubscribe(token: string | undefined) {
  if (!token) return null;
  const res = await fetch(`/api/subscribe/unsubscribe?token=${encodeURIComponent(token)}`, { cache: "no-store" });
  return res.ok;
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const ok = await unsubscribe(searchParams.token);
  return (
    <main className="mt-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Unsubscribe</h1>
      {ok ? (
        <p className="text-muted">You have been unsubscribed successfully.</p>
      ) : (
        <p className="text-muted">Invalid or expired unsubscribe link.</p>
      )}
    </main>
  );
}
