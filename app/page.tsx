import Link from "next/link";
import { CATEGORIES } from "@/lib/request-schema";
import { siteImages } from "@/lib/images";

const descriptions: Record<string, string> = {
  "Home care": "Cleaning, laundry and recurring plans",
  Repairs: "Plumbing, electrical, AC and more",
  "Build & materials": "Supplies and construction support",
};

export default function HomePage() {
  return (
    <>
      <section className="hero hero-split">
        <div>
          <h1>Anything your building needs, through one trusted platform.</h1>
          <p className="lead">
            Find the right service, verify the provider, agree the price, pay through a regulated
            partner, and hold us accountable for the result.
          </p>
          <div>
            <Link href="/request" className="btn">Request a service</Link>
          </div>
        </div>
        <img className="hero-img" src={siteImages.hero} alt="A verified technician working in a home" />
      </section>

      <section id="services" className="section-title">
        <div className="grid">
          {CATEGORIES.map((c) => (
            <div className="card" key={c}>
              {siteImages.categories[c] && (
                <img className="card-img" src={siteImages.categories[c]} alt={`${c} service`} />
              )}
              <h2 className="card-title">{c}</h2>
              <p>{descriptions[c]}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
