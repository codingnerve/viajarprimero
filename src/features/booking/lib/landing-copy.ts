import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * Every word on the flight landing page, so the English (`/enflight`) and
 * Spanish (`/esflights`) pages are one design with two scripts. Functions take
 * the number or hours so the copy never hard-codes either.
 */
export interface LandingCopy {
  lang: "en" | "es";
  crumbs: { home: string; page: string };
  hero: {
    badge: (hours: string) => string;
    titleTop: string;
    titleBottom: string;
    titleEm: string;
    intro: string;
    call: (display: string) => string;
    how: string;
    passLabel: string;
    seat: string;
    fields: readonly { label: string; hint: string }[];
    ready: string;
    desk: string;
    ariaCall: (display: string) => string;
  };
  ticker: readonly string[];
  steps: {
    eyebrow: string;
    title: string;
    intro: string;
    items: readonly { title: string; body: string }[];
  };
  receipt: {
    header: string;
    lines: readonly { label: string; note: string }[];
    onCall: string;
    total: string;
    totalValue: string;
    rules: string;
    eyebrow: string;
    title: string;
    body: string;
    cta: (display: string) => string;
  };
  routes: {
    eyebrow: string;
    title: string;
    to: string;
    nonstop: (duration: string) => string;
    connection: string;
    best: string;
    callAbout: string;
    callShort: string;
    ariaCall: (display: string, from: string, to: string) => string;
    /** The months are English-only content, so the Spanish page omits them. */
    showMonths: boolean;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: (phone: LandingPhone, siteName: string) => readonly {
      question: string;
      answer: string;
    }[];
  };
  closing: {
    eyebrow: string;
    title: string;
    hours: (hours: string) => string;
    button: string;
    disclaimer: (siteName: string) => string;
  };
}

export const landingCopyEn: LandingCopy = {
  lang: "en",
  crumbs: { home: "Home", page: "Book flights" },
  hero: {
    badge: (hours) => `Flight desk open ${hours}`,
    titleTop: "One call.",
    titleBottom: "Your whole fare,",
    titleEm: "itemised.",
    intro:
      "Tell a travel agent where and when. You hear the airfare, the taxes and carrier charges and our fee — plus the fare rules for that ticket — before you pay anything.",
    call: (display) => `Call ${display}`,
    how: "How a call goes",
    passLabel: "Boarding pass",
    seat: "Seat: yours",
    fields: [
      { label: "From", hint: "city or airport" },
      { label: "To", hint: "city or airport" },
      { label: "Depart", hint: "date" },
      { label: "Travellers", hint: "how many" },
    ],
    ready: "Have these four to hand and we do the rest.",
    desk: "Call the flight desk",
    ariaCall: (display) => `Call ${display}`,
  },
  ticker: [
    "Real travel agents",
    "Full price before you pay",
    "Fare rules explained up front",
  ],
  steps: {
    eyebrow: "How a call goes",
    title: "Three things happen, in this order.",
    intro:
      "No fare tables to decode and no total that grows at checkout. You talk to a person, and the price arrives in clear pieces.",
    items: [
      {
        title: "Say where and when",
        body: "Route, dates, how many are travelling. If your dates can move, say so — it changes what we look at.",
      },
      {
        title: "Hear the full price",
        body: "The airfare, taxes and carrier-imposed charges, and our service fee, as separate lines. Then the fare rules for that exact ticket: changes, refunds, bags.",
      },
      {
        title: "Decide, then pay",
        body: "Nothing is booked until you say yes. If the answer is no, you hang up having paid nothing.",
      },
    ],
  },
  receipt: {
    header: "Your quote · read aloud, then confirmed",
    lines: [
      { label: "Airfare", note: "the carrier's fare for your dates" },
      { label: "Taxes & carrier-imposed charges", note: "itemised, not folded in" },
      { label: "Our service fee", note: "stated as its own line" },
    ],
    onCall: "on the call",
    total: "Total, before you pay",
    totalValue: "one number",
    rules:
      "Plus the fare rules for this ticket, explained: changes, cancellations and baggage.",
    eyebrow: "The price",
    title: "Built line by line, so nothing hides in the total.",
    body: "A headline fare is only the first line of a ticket. We read you all of them, including the one that is ours, and you can ask about any of them before a card comes out.",
    cta: (display) => `Ask for your quote · ${display}`,
  },
  routes: {
    eyebrow: "Departures",
    title: "Routes people call about most.",
    to: "to",
    nonstop: (duration) => `Nonstop about ${duration}`,
    connection: "Connection required",
    best: "Best",
    callAbout: "Call about this",
    callShort: "Call",
    ariaCall: (display, from, to) => `Call ${display} about ${from} to ${to}`,
    showMonths: true,
  },
  faq: {
    eyebrow: "Questions",
    title: "Before you call",
    items: (phone, siteName) => [
      {
        question: "Do I pay before I know the full price?",
        answer:
          "No. An agent gives you the airfare, the taxes and carrier-imposed charges and our service fee, and explains the fare rules for that ticket, before you pay.",
      },
      {
        question: "Who answers the phone?",
        answer: `A travel agent at ${siteName}, ${phone.hours}. Call ${phone.display}.`,
      },
      {
        question: "Are you an airline?",
        answer: `No. ${siteName} is a travel agency that books flights on the airlines' behalf. The carrier sets the fare and its rules; we explain them to you.`,
      },
      {
        question: "What should I have ready when I call?",
        answer:
          "Where you are flying from and to, your travel dates, and how many people are travelling. Each traveller's name as it appears on their passport or ID is needed to book, not to get a price.",
      },
      {
        question: "Can I change or cancel a ticket afterwards?",
        answer:
          "That depends on the fare rules of the ticket, which is why we go through them with you first. Our refund and cancellation policy page sets out how we handle requests.",
      },
    ],
  },
  closing: {
    eyebrow: "Ready when you are",
    title: "Say the route. Hear the price.",
    hours: (hours) => `Real travel agents, ${hours}.`,
    button: "Call now",
    disclaimer: (siteName) =>
      `${siteName} is a travel agency, not an airline. Fares and fare rules are set by the carriers and confirmed with you before anything is booked.`,
  },
};
