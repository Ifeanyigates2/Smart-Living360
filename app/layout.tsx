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
    "One trusted place for the building, the people who maintain it and the services that make it work.",
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
                One trusted place for the building, the people who maintain it, and the services
                that make it work.
              </p>
            </div>
            <nav className="footer-col" aria-label="Footer">
              <span className="footer-label">Customers</span>
              <Link href="/#services">Services</Link>
              <Link href="/request">Request a service</Link>
            </nav>
            <div className="footer-col">
              <span className="footer-label">The promise</span>
              <p>Every fee is disclosed. A written quote comes before anything is booked.</p>
            </div>
          </div>
          <div className="container footer-base">© Smart-Living360 Global</div>
        </footer>
      </body>
    </html>
  );
}
