// Photo mapping for the site. Files live in public/images/.
// Only photos checked to show no other company's branding are used here.
// Still confirm you hold the rights (or a model release) for each person pictured before launch.
export const siteImages = {
  hero: "/images/cleaning-team.webp",
  cleaning: {
    home: "/images/cleaning-home.jpg",
    office: "/images/cleaning-office.webp",
    recurring: "/images/cleaning-pair.jpg",
    desk: "/images/cleaning-desk.jpg",
  },
  categories: {
    "Home care": "/images/cleaning-team.webp",
    Repairs: "/images/trade-04.jpg",
    "Build & materials": "/images/trade-13.jpg",
  } as Record<string, string>,
};
