import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "letters",
  description: "WordPress-lite on Cloudflare",
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
