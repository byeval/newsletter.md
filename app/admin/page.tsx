export default function AdminHomePage() {
  return (
    <main className="mt-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted mb-6">Welcome back. Here's what's happening with your publication.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        <div className="card glass hover:translate-y-sm transition-transform flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Editor</h2>
            <p className="text-muted mb-6">Write and publish a new story to your audience.</p>
          </div>
          <a href="/admin/editor" className="btn btn-primary w-full text-center">Write a Story</a>
        </div>

        <div className="card glass hover:translate-y-sm transition-transform flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Posts</h2>
            <p className="text-muted mb-6">Manage your published library and drafts.</p>
          </div>
          <a href="/admin/posts" className="btn btn-outline w-full text-center">View Posts</a>
        </div>

        <div className="card glass hover:translate-y-sm transition-transform flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Subscribers</h2>
            <p className="text-muted mb-6">Track your newsletter audience in one place.</p>
          </div>
          <a href="/admin/subscribers" className="btn btn-outline w-full text-center">View Subscribers</a>
        </div>

        <div className="card glass hover:translate-y-sm transition-transform flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Profile</h2>
            <p className="text-muted mb-6">Update your username and personal details.</p>
          </div>
          <a href="/admin/profile" className="btn btn-outline w-full text-center">Settings</a>
        </div>

      </div>
    </main>
  );
}
