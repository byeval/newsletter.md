type PageProps = {
  searchParams: { token?: string };
};

async function confirm(token: string | undefined) {
  if (!token) return null;
  const res = await fetch(`/api/subscribe/confirm?token=${encodeURIComponent(token)}`, { cache: "no-store" });
  return res.ok;
}

export default async function ConfirmPage({ searchParams }: PageProps) {
  const ok = await confirm(searchParams.token);
  return (
    <main className="mt-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Confirm subscription</h1>
      {ok ? (
        <p className="text-muted">You're confirmed. Welcome aboard.</p>
      ) : (
        <p className="text-muted">Invalid or expired confirmation link.</p>
      )}
    </main>
  );
}
