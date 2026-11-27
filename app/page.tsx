import Image from "next/image";
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
      <section className="hero-wrap">
        <div className="container hero">
          <div>
            <p className="eyebrow">Home care · Repairs · Building</p>
            <h1>
              Cleaning services and all your building&apos;s needs,{" "}
              <em>through one trusted platform.</em>
            </h1>
            <p className="lead">
              Find the right service, verify the provider, agree the price, pay through a regulated
              partner, and hold us accountable for the result.
            </p>
            <div className="hero-actions">
              <Link href="/request" className="btn">
                Request a service
              </Link>
              <a href="#services" className="btn btn-outline">
                See services
              </a>
            </div>
            <ul className="trust-row">
              <li>
                <i className="dot dot-green" aria-hidden="true" />
                <div>
                  <strong>Written quote</strong>
                  <span>Before anything is booked</span>
                </div>
              </li>
              <li>
                <i className="dot dot-navy" aria-hidden="true" />
                <div>
                  <strong>Verified provider</strong>
                  <span>Named on the job</span>
                </div>
              </li>
              <li>
                <i className="dot dot-orange" aria-hidden="true" />
                <div>
                  <strong>Fees in the open</strong>
                  <span>Every charge is listed</span>
                </div>
              </li>
            </ul>
          </div>
          <figure className="hero-frame">
            <Image
              className="hero-img"
              src={siteImages.hero}
              alt="A verified technician repairing a kitchen sink"
              fill
              priority
              sizes="(min-width: 900px) 460px, 100vw"
            />
            <figcaption className="hero-card">
              <span className="badge badge-green">Verified</span>
              <strong>Kitchen repair, agreed first</strong>
              <span>The price is written down before the visit.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="services" className="container section">
        <div className="section-head">
          <p className="eyebrow">What we cover</p>
          <h2>Three ways we look after a property.</h2>
          <p className="lead">Pick a category and tell us what the building needs. We reply with a quote.</p>
        </div>
        <div className="service-grid">
          {CATEGORIES.map((c) => (
            <Link className="service-card" key={c} href={`/request?category=${encodeURIComponent(c)}`}>
              {siteImages.categories[c] && (
                <div className="service-photo">
                  <Image
                    src={siteImages.categories[c]}
                    alt=""
                    fill
                    sizes="(min-width: 800px) 30vw, 100vw"
                  />
                </div>
              )}
              <div className="service-body">
                <h2>{c}</h2>
                <p>{descriptions[c]}</p>
                <span className="service-go">Request this</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 id="how-heading">Agree the work before anyone arrives.</h2>
          </div>
          <ol className="steps">
            <li>
              <span className="num">01</span>
              <h3>Tell us the job</h3>
              <p>Category, property and what needs doing. A time window helps.</p>
            </li>
            <li>
              <span className="num">02</span>
              <h3>Read the quote</h3>
              <p>Service, materials and the platform fee are each on their own line.</p>
            </li>
            <li>
              <span className="num">03</span>
              <h3>See the result</h3>
              <p>The provider is named on the job. Photos of the finished work stay with it.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="container closer-wrap">
        <div className="closer">
          <div>
            <p className="eyebrow">Start with a request</p>
            <h2>Tell us what the building needs.</h2>
            <p>We reply with a written quote. You approve the price before anyone is booked.</p>
          </div>
          <Link href="/request" className="btn">
            Request a service
          </Link>
        </div>
      </section>
    </>
  );
}
