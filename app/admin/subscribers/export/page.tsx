export default function ExportPage() {
  return (
    <main className="mt-6">
      <h1 className="text-3xl font-bold mb-4">Export Subscribers</h1>
      <p className="text-muted mb-6">Download a CSV of your subscriber list.</p>
      <a href="/api/subscribers?format=csv" className="btn btn-primary">Download CSV</a>
    </main>
  );
}
