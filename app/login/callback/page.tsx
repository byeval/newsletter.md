"use client";

import { useEffect } from "react";

export default function LoginCallbackPage() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const idToken = hash.get("id_token");
    if (!idToken) {
      window.location.href = "/login";
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
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <main className="mt-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Signing you in...</h1>
      <p className="text-muted">Please wait.</p>
    </main>
  );
}
