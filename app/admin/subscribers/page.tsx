type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  created_at: string;
};

async function getSubscribers(): Promise<Subscriber[]> {
  const res = await fetch("/api/subscribers", { cache: "no-store" });
  const data = (await res.json()) as { subscribers?: Subscriber[] };
  return data.subscribers ?? [];
}

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();
  return (
    <main className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-0">Subscribers</h1>
        <a href="/admin/subscribers/export" className="btn btn-outline">Export CSV</a>
      </div>

      {subscribers.length === 0 ? (
        <div className="card text-center text-muted">
          No subscribers yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="card flex flex-col md:flex-row justify-between items-center" style={{ padding: "1rem 1.5rem" }}>
              <div className="w-full">
                <div className="text-lg font-bold">{subscriber.email}</div>
                {subscriber.name ? <div className="text-sm text-muted">{subscriber.name}</div> : null}
                <div className="text-sm text-muted mt-1">
                  Joined: {new Date(subscriber.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className={`badge ${subscriber.status === "active" ? "badge-success" : "badge-warning"}`}>
                {subscriber.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
