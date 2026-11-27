import type { Metadata } from "next";
import Link from "next/link";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Wordmark } from "@/components/wordmark";

const sans = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Smart-Living360 Global",
  description:
    "Home and office cleaning, plus repairs and building support, through one trusted place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <footer className="site">
          <div className="container footer-grid">
            <div className="footer-brand">
              <Wordmark compact />
              <p>
                Home and office cleaning first. Repairs and building support when the property needs
                more than a clean.
              </p>
            </div>
            <nav className="footer-col" aria-label="Footer">
              <span className="footer-label">Customers</span>
              <Link href="/#services">Cleaning</Link>
              <Link href="/request?category=Home%20care">Request cleaning</Link>
            </nav>
            <div className="footer-col">
              <span className="footer-label">The promise</span>
              <p>Every fee is disclosed. A written quote comes before anything is booked.</p>
            </div>
          </div>
          <div className="container footer-base">
            <span>© Smart-Living360 Global</span>
            <span>Powered By Cicitz 24 Ventures</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
