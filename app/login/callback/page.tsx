"use client";

import { useEffect, useState } from "react";

export default function LoginCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const idToken = hash.get("id_token");
    if (!idToken) {
      setError("Missing Google token. Please try again.");
      return;
    }
    fetch("/api/auth/google", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    }).then((res) => {
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        res.json().then((data) => {
          setError(data?.error || "Login failed. Please try again.");
        });
      }
    });
  }, []);

  return (
    <main className="mt-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Signing you in...</h1>
      {error ? <p className="text-muted">{error}</p> : <p className="text-muted">Please wait.</p>}
      {error ? (
        <div className="mt-4">
          <a className="btn btn-outline" href="/login">Back to login</a>
        </div>
      ) : null}
    </main>
  );
}
