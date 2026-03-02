export default function HomePage() {
  return (
    <main className="flex flex-col items-center text-center mt-6">
      <div className="badge badge-primary mb-4">vinext + cloudflare</div>
      
      <h1 className="text-4xl font-bold mb-4">
        Letters
      </h1>
      
      <p className="text-xl text-muted max-w-md mb-6">
        A lightning-fast, premium publishing platform. 
        Write in Markdown, deploy to Cloudflare's edge in seconds.
      </p>

      <div className="flex items-center gap-4">
        <a href="/api/auth/google" className="btn btn-primary text-lg">
          Start Writing
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-outline text-lg">
          View GitHub
        </a>
      </div>

      <div className="card mt-6 w-full max-w-md text-left">
        <h3 className="text-lg font-bold mb-2">Why Letters?</h3>
        <ul className="gap-2 text-muted">
          <li className="p-0 border-0 shadow-none bg-transparent">✓ Minimalist Markdown Editor</li>
          <li className="p-0 border-0 shadow-none bg-transparent">✓ Zero-config Image Uploads to R2</li>
          <li className="p-0 border-0 shadow-none bg-transparent">✓ Global SSR via Cloudflare Workers</li>
          <li className="p-0 border-0 shadow-none bg-transparent">✓ Edge-cached SQLite on D1</li>
        </ul>
      </div>
    </main>
  );
}
