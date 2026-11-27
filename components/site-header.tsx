"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/wordmark";

export function SiteHeader() {
  const path = usePathname();
  const staff = path.startsWith("/ops");

  return (
    <header className="site">
      <div className="container header-row">
        <Wordmark />
        {staff ? (
          <nav className="nav" aria-label="Staff">
            {path !== "/ops/login" && <Link href="/ops/inbox">Inbox</Link>}
            {path !== "/ops/login" && <Link href="/ops/quotes/new">New quote</Link>}
            <span className="badge">Staff</span>
          </nav>
        ) : (
          <nav className="nav" aria-label="Primary">
            <Link href="/#services">Services</Link>
            <Link href="/request" className="btn btn-small">
              <span className="wide-only">Request a service</span>
              <span className="narrow-only">Request</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
