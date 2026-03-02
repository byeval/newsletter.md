import type { ReactNode } from "react";

export const metadata = {
  title: "Admin - letters",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <a href="/admin" className="admin-logo">
            <strong>letters</strong> Admin
          </a>
          <nav className="admin-nav">
            <a href="/admin/posts">Posts</a>
            <a href="/admin/editor">Write</a>
            <a href="/admin/subscribers">Subscribers</a>
            <a href="/admin/profile">Profile</a>
            <a href="/login">Sign out</a>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
