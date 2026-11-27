import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/images";

const cleaningHref = "/request?category=Home%20care";

const cleaningOffers = [
  {
    title: "Homes",
    text: "Kitchens, bathrooms, laundry and a regular clean for the house.",
    image: siteImages.cleaning.home,
    position: "center",
  },
  {
    title: "Offices",
    text: "Desks, floors and shared workspaces, once or on a schedule.",
    image: siteImages.cleaning.office,
    position: "70% center",
  },
  {
    title: "Recurring visits",
    text: "The same clean, week after week, with the price written down first.",
    image: siteImages.cleaning.recurring,
    position: "center 20%",
  },
];

const otherServices = [
  {
    title: "Repairs",
    text: "Plumbing, electrical, AC and more",
    image: siteImages.categories.Repairs,
    href: "/request?category=Repairs",
  },
  {
    title: "Build & materials",
    text: "Supplies and construction support",
    image: siteImages.categories["Build & materials"],
    href: "/request?category=Build%20%26%20materials",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-wrap">
        <div className="container hero">
          <div>
            <p className="eyebrow">Cleaning, first</p>
            <h1>
              Home and office cleaning, <em>booked with a written quote.</em>
            </h1>
            <p className="lead">
              Tell us the rooms and how often. We match a verified cleaner, agree the price, and
              hold the visit to that quote. Repairs and building work are here too, when you need
              them.
            </p>
            <div className="hero-actions">
              <Link href={cleaningHref} className="btn">
                Request cleaning
              </Link>
              <a href="#services" className="btn btn-outline">
                See cleaning
              </a>
            </div>
            <ul className="trust-row">
              <li>
                <i className="dot dot-green" aria-hidden="true" />
                <div>
                  <strong>Homes and offices</strong>
                  <span>One-off visits or a plan</span>
                </div>
              </li>
              <li>
                <i className="dot dot-navy" aria-hidden="true" />
                <div>
                  <strong>Verified cleaner</strong>
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
              alt="A cleaning team ready for a home or office visit"
              fill
              priority
              sizes="(min-width: 900px) 460px, 100vw"
            />
            <figcaption className="hero-card">
              <span className="badge badge-green">Cleaning</span>
              <strong>Weekly clean, agreed first</strong>
              <span>The price is written down before anyone arrives.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="services" className="container section">
        <div className="section-head">
          <p className="eyebrow">Cleaning</p>
          <h2>The clean, on the schedule the building needs.</h2>
          <p className="lead">Homes, offices and standing visits. Each one starts with a written quote.</p>
        </div>
        <div className="service-grid">
          {cleaningOffers.map((offer) => (
            <Link className="service-card" key={offer.title} href={cleaningHref}>
              <div className="service-photo">
                <Image
                  src={offer.image}
                  alt=""
                  fill
                  sizes="(min-width: 800px) 30vw, 100vw"
                  style={{ objectPosition: offer.position }}
                />
              </div>
              <div className="service-body">
                <h2>{offer.title}</h2>
                <p>{offer.text}</p>
                <span className="service-go">Request cleaning</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="also-heading">
        <div className="section-head">
          <p className="eyebrow">Also on the platform</p>
          <h2 id="also-heading">Repairs and building, when the clean is not the whole job.</h2>
        </div>
        <div className="also-grid">
          {otherServices.map((service) => (
            <Link className="also-card" key={service.title} href={service.href}>
              <div className="also-photo">
                <Image src={service.image} alt="" fill sizes="160px" />
              </div>
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="service-go">Request this</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How a clean is booked</p>
            <h2 id="how-heading">Agree the visit before anyone arrives.</h2>
          </div>
          <ol className="steps">
            <li>
              <span className="num">01</span>
              <h3>Tell us the clean</h3>
              <p>Home or office, which rooms, and how often. A time window helps.</p>
            </li>
            <li>
              <span className="num">02</span>
              <h3>Read the quote</h3>
              <p>The visit and every fee are on their own lines. Nothing is booked until you approve it.</p>
            </li>
            <li>
              <span className="num">03</span>
              <h3>See the result</h3>
              <p>The cleaner is named on the job. Photos of the finished work stay with it.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="container closer-wrap">
        <div className="closer">
          <div>
            <p className="eyebrow">Start with the clean</p>
            <h2>Tell us what needs cleaning.</h2>
            <p>We reply with a written quote. You approve the price before the visit is booked.</p>
          </div>
          <Link href={cleaningHref} className="btn">
            Request cleaning
          </Link>
        </div>
      </section>
    </>
  );
}
