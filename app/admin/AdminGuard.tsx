"use client";

import { useEffect, useState } from "react";

type GuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: GuardProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store", credentials: "include" })
      .then((res) => res.json() as Promise<{ user?: { id?: string } | null }>)
      .then((data) => {
        if (!data.user) {
          window.location.href = "/login";
          return;
        }
        setReady(true);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  if (!ready) {
    return (
      <main className="mt-12 text-center">
        <p className="text-muted">Checking session...</p>
      </main>
    );
  }

  return <>{children}</>;
}
