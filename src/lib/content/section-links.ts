import { footerNav } from "@/lib/config/site";
import { airlines } from "@/lib/content/airlines";
import { airports } from "@/lib/content/airports";
import { cruiseLines } from "@/lib/content/cruise-lines";
import { dealGroups } from "@/lib/content/deals";
import { destinations } from "@/lib/content/destinations";
import { aircraftCategories, jetRoutes } from "@/lib/content/private-jets";
import { getResolvedRoutes } from "@/lib/content/routes";

/**
 * Related-page link columns shown at the foot of each booking section.
 *
 * Somebody on the hotel pages wants other hotel cities and hotel deals next,
 * not private jet routes — so each section gets its own columns directly above
 * the site footer. Every link is built from the data it points at, so a city
 * or route added to its content file appears here without a second edit, and
 * a removed one cannot leave a dead link behind.
 */

export interface FooterLink {
  href: string;
  label: string;
}

export interface LinkColumn {
  title: string;
  links: readonly FooterLink[];
}

export type BookingSection =
  | "flights"
  | "hotels"
  | "cars"
  | "cruises"
  | "vacations"
  | "privateJets";

const EUROPE = new Set([
  "United Kingdom",
  "Spain",
  "Portugal",
  "Italy",
  "France",
  "Netherlands",
  "Germany",
]);

function dealLinks(slugs: readonly string[]): FooterLink[] {
  const all = dealGroups.flatMap((group) => group.items);

  return slugs.flatMap((slug) =>
    all
      .filter((item) => item.slug === slug)
      .map((item) => ({ href: `/deals#${item.slug}`, label: item.label })),
  );
}

const quickLinks: LinkColumn = {
  title: "Quick links",
  links: [
    { href: "/about", label: "About us" },
    { href: "/contact", label: "Contact us" },
    { href: "/customer-support", label: "Customer support" },
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/terms-and-conditions", label: "Terms & conditions" },
    { href: "/site-map", label: "Site map" },
  ],
};

const planYourTrip: readonly FooterLink[] = [
  { href: "/flights", label: "Flights" },
  { href: "/hotels", label: "Hotels" },
  { href: "/car-rentals", label: "Car rental" },
  { href: "/cruises", label: "Cruises" },
  { href: "/vacations", label: "Vacation packages" },
  { href: "/private-jets", label: "Private jets" },
  { href: "/destinations", label: "Destinations" },
  { href: "/guides", label: "Travel guides" },
];

/** The "Plan your trip" column, minus the section the reader is already in. */
function planLinks(current: string): LinkColumn {
  return {
    title: "Plan your trip",
    links: planYourTrip.filter((link) => link.href !== current),
  };
}

function hotelCityLinks(inEurope: boolean): FooterLink[] {
  return destinations
    .filter((destination) => EUROPE.has(destination.country) === inEurope)
    .map((destination) => ({
      href: `/hotels/${destination.slug}`,
      label: `Hotels in ${destination.city}`,
    }));
}

function carLocationLinks(inUs: boolean): FooterLink[] {
  return airports
    .filter((airport) => (airport.countryCode === "US") === inUs)
    .slice(0, 8)
    .map((airport) => ({
      href: `/car-rentals/${airport.code.toLowerCase()}`,
      label: `Cars in ${airport.city}`,
    }));
}

export const sectionLinkLabels: Record<BookingSection, string> = {
  flights: "More flight pages",
  hotels: "More hotel pages",
  cars: "More car rental pages",
  cruises: "More cruise pages",
  vacations: "More vacation pages",
  privateJets: "More private aviation pages",
};

export function sectionLinkColumns(
  section: BookingSection,
): readonly LinkColumn[] {
  switch (section) {
    case "flights":
      return [
        {
          title: "Popular flight routes",
          links: getResolvedRoutes()
            .slice(0, 8)
            .map((route) => ({
              href: `/flights/${route.slug}`,
              label: `${route.origin.city} to ${route.destination.city}`,
            })),
        },
        {
          title: "Top airlines",
          links: airlines.slice(0, 8).map((airline) => ({
            href: `/airlines/${airline.slug}`,
            label: airline.name,
          })),
        },
        {
          title: "Flight deals",
          links: dealLinks([
            "last-minute-flight-deals",
            "coupon-deals",
            "business-class-flights",
            "top-airline-deals",
            "student-travel-deals",
            "deals-for-seniors",
          ]),
        },
        { title: "Traveller tools", links: footerNav.travellerTools },
      ];

    case "hotels":
      return [
        { title: "Hotels in Europe", links: hotelCityLinks(true) },
        { title: "Hotels in the Americas & Asia", links: hotelCityLinks(false) },
        {
          title: "Hotel deals",
          links: dealLinks([
            "hotel-deals",
            "flight-hotel-deals",
            "couples-deals",
            "honeymoon-deals",
            "family-deals",
            "existing-customer-deals",
          ]),
        },
        quickLinks,
      ];

    case "cars":
      return [
        { title: "Top car rental locations", links: carLocationLinks(true) },
        { title: "International locations", links: carLocationLinks(false) },
        {
          title: "Car rental deals",
          links: dealLinks([
            "car-deals",
            "vacation-deals",
            "family-deals",
            "group-deals",
            "existing-customer-deals",
          ]),
        },
        quickLinks,
      ];

    case "cruises":
      return [
        {
          title: "Cruise lines",
          links: cruiseLines.slice(0, 8).map((line) => ({
            href: `/cruises/${line.slug}`,
            label: line.name,
          })),
        },
        {
          title: "Cruise deals",
          links: dealLinks([
            "cruise-deals",
            "honeymoon-deals",
            "couples-deals",
            "family-deals",
            "group-deals",
          ]),
        },
        planLinks("/cruises"),
        quickLinks,
      ];

    case "vacations":
      return [
        {
          title: "Top destinations",
          links: destinations.map((destination) => ({
            href: `/destinations/${destination.slug}`,
            label: `${destination.city}, ${destination.country}`,
          })),
        },
        {
          title: "Vacation deals",
          links: dealLinks([
            "vacation-deals",
            "flight-hotel-deals",
            "honeymoon-deals",
            "couples-deals",
            "family-deals",
            "group-deals",
          ]),
        },
        planLinks("/vacations"),
        quickLinks,
      ];

    case "privateJets":
      return [
        { title: "Private aviation", links: footerNav.privateAviation },
        {
          title: "Popular jet routes",
          links: jetRoutes.slice(0, 8).map((route) => ({
            href: `/private-jets/routes/${route.slug}`,
            label: `${route.originCity} to ${route.destinationCity}`,
          })),
        },
        {
          title: "Aircraft",
          links: aircraftCategories.map((category) => ({
            href: `/private-jets/aircraft/${category.slug}`,
            label: category.name,
          })),
        },
        {
          title: "Destinations",
          links: destinations.map((destination) => ({
            href: `/destinations/${destination.slug}`,
            label: destination.city,
          })),
        },
        {
          title: "Trips & deals",
          links: [
            ...dealLinks([
              "private-jet-deals",
              "group-deals",
              "existing-customer-deals",
            ]),
            { href: "/vacations", label: "Vacation packages" },
            { href: "/cruises", label: "Cruises" },
            { href: "/hotels", label: "Hotels" },
          ],
        },
      ];
  }
}
