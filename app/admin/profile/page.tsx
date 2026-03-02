async function getUser() {
  const res = await fetch("/api/me", { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json() as { user?: { name?: string | null; email?: string; avatar_url?: string | null; username?: string | null } };
  return data.user ?? null;
}

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <main className="mt-6 mx-auto" style={{ maxWidth: "600px" }}>
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <div className="card mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="Avatar" className="avatar avatar-lg" />
        ) : (
          <div className="avatar avatar-lg flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }}>
            {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-bold mb-1">{user?.name || "Anonymous User"}</h2>
          <p className="text-muted mb-3">{user?.email || "No email available"}</p>
          {user?.username ? (
            <div className="badge badge-success">@{user.username}</div>
          ) : (
            <div className="badge badge-warning">Setup Required</div>
          )}
        </div>
      </div>

      <form method="post" action="/api/username/claim" className="card" style={{ padding: "2rem" }}>
        <h3 className="text-xl font-bold mb-2 m-0">Writer Profile</h3>
        <p className="text-muted mb-6">
          Your username sets your blog address (e.g. yoursite.com/u/username). Once claimed, it uniquely identifies your posts globally.
        </p>

        <label className="flex flex-col gap-2 w-full">
          Desired Username
          <input 
            name="username" 
            type="text" 
            className="w-full" 
            style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem" }}
            placeholder="e.g. awesome-writer" 
            defaultValue={user?.username || ""} 
            disabled={!!user?.username}
            required 
          />
        </label>
        
        {user?.username ? (
          <p className="mt-6 mb-0 font-medium" style={{ color: "var(--success)" }}>
            ✓ Username successfully claimed and secured.
          </p>
        ) : (
          <button type="submit" className="btn btn-primary w-full mt-6">
            Claim Username
          </button>
        )}
      </form>
    </main>
  );
}
