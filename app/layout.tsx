import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart-Living360 Global",
  description:
    "One trusted place for the building, the people who maintain it and the services that make it work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="container header-row">
            <Link href="/" className="wordmark">
              Smart-Living<span>360</span> Global
            </Link>
            <nav className="nav">
              <Link href="/#services">Services</Link>
              <Link href="/request">Request</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site">
          <div className="container">
            © Smart-Living360 Global. Every fee is disclosed.
          </div>
        </footer>
      </body>
    </html>
  );
}
