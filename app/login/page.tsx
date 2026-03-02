export default function LoginPage() {
  return (
    <main className="mt-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Sign in</h1>
      <p className="text-muted mb-6">Use Google to access your writer dashboard.</p>
      <a href="/api/auth/google" className="btn btn-primary">Continue with Google</a>
    </main>
  );
}
