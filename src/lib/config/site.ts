/**
 * Single source of truth for site identity, contact details and navigation.
 *
 * Everything a legal page or a Google Ads reviewer needs to verify lives here.
 * Nothing in this file may be invented: values marked TODO are placeholders and
 * MUST be replaced with real, verifiable details before the site goes live or
 * is submitted to Google Ads. Advertising with a placeholder address or an
 * unmonitored phone number is a policy violation in its own right.
 */

export const siteConfig = {
  name: "Viajarprimero",
  legalName: "Viajar Primero LLC",
  tagline:
    "Flights, hotels, car rental, cruises and private jets, booked with a real person.",
  // Every clause here has to be true and checkable. "Hundreds of airlines" or
  // "the lowest fares" would not be - we cannot substantiate either, and the
  // description is reused as the home page meta description and in the footer.
  description:
    "Flights, hotels, car rental, cruises and private jet charter, booked with a real travel agent — the full price broken down before you pay, and the fare rules explained up front.",
  url: "https://viajarprimero.com",
  locale: "en_US",
  currency: "USD",
} as const;

/**
 * Contact channels. Google Ads' Misrepresentation policy expects an advertiser
 * to be reachable, so every channel listed here must actually be monitored.
 * Delete a channel outright rather than shipping one nobody answers.
 */
export const contactConfig = {
  email: "info@viajarprimero.com",
  privacyEmail: "info@viajarprimero.com", // same inbox until a dedicated one exists
  // The monitored sales and support line. `phone` is E.164 for the tel: link,
  // `phoneDisplay` is the reading format. Both must stay in sync, and the
  // number must actually be answered during `supportHours` — an advertised
  // number nobody picks up is a Google Ads Misrepresentation violation.
  phone: "+19152551230",
  phoneDisplay: "+1 (915) 255-1230",
  /** Hours must describe when the phone is genuinely answered. */
  supportHours: "24/7",
  address: {
    street: "8832 Parkland Dr, Mailbox A",
    city: "El Paso",
    region: "Texas",
    postalCode: "79925",
    country: "United States",
  },
  /**
   * Registrations and accreditations. Leave EMPTY unless the business actually
   * holds them — an unearned IATA/ARC/ASTA badge is both an Ads violation and
   * a misrepresentation claim. Each entry is rendered with its ID so a
   * reviewer can check it against the issuing body's register.
   */
  accreditations: [] as ReadonlyArray<{ label: string; id: string }>,
} as const;

/**
 * The booking verticals this site actually sells.
 *
 * Flipping one to `false` removes it from the navigation, the home page, the
 * sitemap and the HTML site map in one edit — which is the point. A vertical
 * advertised in the nav but not actually supplied is the kind of gap an Ads
 * reviewer clicks straight into.
 */
export const verticals = {
  flights: true,
  hotels: true,
  cars: true,
  cruises: true,
  privateJets: true,
} as const;

/**
 * What each vertical is and what a quote for it actually contains.
 *
 * The home page, the site map and anywhere else that presents the four
 * verticals side by side reads this, so none of them can quietly fall out of
 * step with the nav — or with each other's prominence. Entries are filtered by
 * the `verticals` flags above, so switching a vertical off removes its card as
 * well as its nav link.
 *
 * `quote` describes what we send back. Each line has to be something we can
 * actually put in writing; "the cheapest rate" is not.
 */
const allVerticals = [
  {
    key: "flights",
    href: "/flights",
    label: "Flights",
    blurb: "Tell us the route and an agent will price it.",
    quote:
      "The airfare, the taxes and carrier-imposed charges, and our service fee — with the fare rules for that ticket explained before you pay.",
  },
  {
    key: "hotels",
    href: "/hotels",
    label: "Hotels",
    blurb: "Rooms priced as a total, not as a nightly headline.",
    quote:
      "The nightly rate with city taxes and any mandatory resort fee already in it, plus the cancellation deadline in the property's own time zone.",
  },
  {
    key: "cars",
    href: "/car-rentals",
    label: "Car rental",
    blurb: "The desk-side surprises settled in advance.",
    quote:
      "The rental rate, what the mandatory charges and insurance really come to, the excess you would be liable for, and the fuel policy.",
  },
  {
    key: "cruises",
    href: "/cruises",
    label: "Cruises",
    blurb: "What the fare covers, itemised.",
    quote:
      "The cabin fare, port charges and government taxes, gratuities, and what is genuinely included on board rather than sold again later.",
  },
  {
    key: "privateJets",
    href: "/private-jets",
    label: "Private jets",
    blurb: "Charter priced by the aircraft, not by the seat.",
    quote:
      "The all-in charter price with positioning, crew, landing and handling fees already in it, plus the operator's name, the aircraft type and what the quote excludes.",
  },
] as const;

export const verticalCatalogue = allVerticals.filter(
  (vertical) => verticals[vertical.key],
);

/**
 * Header navigation, in the order the business asked for.
 *
 * Verticals carry their `verticals` key so switching one off removes its nav
 * link too. Destinations is not up here — it lives on the home page and in
 * the footer. `/deals` renders as a dropdown (see `DealsMenu`).
 */
const allMainNav = [
  { href: "/flights", label: "Flights", vertical: "flights" },
  { href: "/private-jets", label: "Private jets", vertical: "privateJets" },
  { href: "/cruises", label: "Cruises", vertical: "cruises" },
  { href: "/hotels", label: "Hotels", vertical: "hotels" },
  { href: "/car-rentals", label: "Cars", vertical: "cars" },
  { href: "/trains", label: "Trains", vertical: null },
  { href: "/vacations", label: "Vacation packages", vertical: null },
  { href: "/about", label: "About", vertical: null },
  { href: "/deals", label: "Deals", vertical: null },
  { href: "/reviews", label: "Reviews", vertical: null },
  { href: "/travel-blog", label: "Blogs", vertical: null },
] as const;

export const mainNav = allMainNav.filter(
  (item) => item.vertical === null || verticals[item.vertical],
);

/** The small links in the header's top pill. */
export const utilityNav = [
  { href: "/customer-support", label: "Customer support" },
  { href: "/contact", label: "Contact us" },
] as const;

export const footerNav = {
  book: [
    { href: "/flights", label: "Flights" },
    { href: "/hotels", label: "Hotels" },
    { href: "/car-rentals", label: "Car rental" },
    { href: "/cruises", label: "Cruises" },
    { href: "/trains", label: "Trains" },
    { href: "/vacations", label: "Vacation packages" },
    { href: "/private-jets", label: "Private jets" },
    { href: "/deals", label: "Deals" },
  ],
  privateAviation: [
    { href: "/private-jets/charter", label: "Private jet charter" },
    { href: "/private-jets/empty-legs", label: "Empty leg flights" },
    { href: "/private-jets/aircraft", label: "Aircraft guide" },
    { href: "/private-jets/routes", label: "Popular jet routes" },
    { href: "/private-jets/corporate", label: "Corporate travel" },
    { href: "/private-jets/services", label: "Onboard services" },
    { href: "/private-jets/faq", label: "Private jet FAQ" },
    { href: "/private-jets/request-a-quote", label: "Request a quote" },
  ],
  travellerTools: [
    { href: "/manage-booking", label: "Manage a booking" },
    { href: "/destinations", label: "Destinations" },
    { href: "/guides", label: "Travel guides" },
    { href: "/travel-blog", label: "Blogs" },
    { href: "/airlines", label: "Airlines" },
    { href: "/airports", label: "Airports" },
    { href: "/online-check-in", label: "Online check-in" },
    { href: "/baggage-information", label: "Baggage information" },
  ],
  company: [
    { href: "/about", label: "About us" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/contact", label: "Contact us" },
    { href: "/reviews", label: "Reviews" },
    { href: "/customer-support", label: "Customer support" },
    { href: "/site-map", label: "Site map" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/your-privacy-choices", label: "Your privacy choices" },
    { href: "/cookie-policy", label: "Cookie policy" },
    { href: "/terms-and-conditions", label: "Terms & conditions" },
    { href: "/refund-and-cancellation-policy", label: "Refunds & cancellations" },
    { href: "/fees-and-charges", label: "Fees & charges" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/accessibility-statement", label: "Accessibility" },
    { href: "/photo-credits", label: "Photo credits" },
  ],
} as const;
