/**
 * Legal and compliance configuration.
 *
 * The policy pages read every substantive value from here so that a change of
 * fee, jurisdiction or effective date happens once. Values marked TODO are
 * placeholders: a policy page that states a fee we do not charge, or omits one
 * we do, is exactly the "unclear billing" problem that gets travel advertisers
 * suspended under Google Ads' Misrepresentation policy.
 */

/** ISO date the current version of each policy took effect. */
export const policyEffectiveDate = "2026-09-14";

/** Governing law and forum for the Terms. Ask counsel before setting these. */
export const jurisdiction = {
  governingLaw: "the State of Texas, USA",
  courts: "the state and federal courts of El Paso County, Texas",
} as const;

/**
 * How the business actually operates. This drives the wording across the
 * Terms, Refund policy and Disclaimer, so it must describe reality.
 *
 * - "agency"   — we sell tickets as an agent; the airline is the supplier and
 *                the carrier's own conditions of carriage govern the flight.
 * - "merchant" — we sell as principal and carry the contractual obligation.
 */
export const businessModel = "agency" as const;

/**
 * Service fees charged by us, on top of the airfare and carrier-imposed
 * charges. An empty array renders as "we charge no service fees", so leaving
 * this empty while actually charging a fee is a billing misrepresentation.
 *
 * Amounts are per passenger per ticket unless `basis` says otherwise.
 */
export const serviceFees: ReadonlyArray<{
  name: string;
  amount: string;
  basis: string;
  refundable: boolean;
  note?: string;
}> = [
  {
    name: "Booking service fee",
    amount: "$10–$200",
    basis: "per passenger, per ticket",
    refundable: false,
    note: "Varies with how complex the booking is. Shown as one exact dollar amount in your quote before you pay — never added afterwards.",
  },
];

/**
 * We charge only the booking service fee above. A change or cancellation
 * carries no separate fee of ours — what it costs is whatever the airline,
 * hotel, rental company or cruise line charges under its own fare rules or
 * booking conditions, passed on unchanged. Every page that discusses changes
 * or cancellations reads this rather than assuming a company-side processing
 * fee exists.
 */
export const changeAndCancellationFeePolicy =
  "We do not charge our own fee to process a change or cancellation. What it costs is whatever the airline, hotel, rental company or cruise line charges under its own rules — passed on to you unchanged.";

/**
 * The US DOT 24-hour reservation requirement (14 CFR 259.5(b)(4)). It binds
 * carriers and ticket agents for itineraries touching the United States booked
 * at least seven days before departure. Set to false only if no part of the
 * business is within its scope — and record why.
 */
export const dotTwentyFourHourRuleApplies = true;

/**
 * Third-party services that set cookies or receive personal data. The cookie
 * table and the "who we share data with" section are generated from this, so
 * an entry removed here disappears from both. Add every tag you actually fire
 * — a consent banner that under-declares is worse than none at all.
 */
export const dataProcessors: ReadonlyArray<{
  name: string;
  purpose: string;
  category: "essential" | "analytics" | "marketing";
  policyUrl: string;
}> = [
  {
    name: "Google Analytics",
    purpose: "Aggregate traffic and on-site behaviour measurement.",
    category: "analytics",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    name: "Google Ads",
    purpose: "Conversion measurement and remarketing audiences.",
    category: "marketing",
    policyUrl: "https://policies.google.com/technologies/ads",
  },
];

/** Cookies actually set by this site, by category. Keep in sync with reality. */
export const cookieInventory: ReadonlyArray<{
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: "essential" | "analytics" | "marketing";
}> = [
  {
    name: "vp_consent",
    provider: "Viajarprimero",
    purpose: "Stores your cookie choices so we do not ask again on every page.",
    duration: "6 months",
    category: "essential",
  },
  {
    name: "_ga / _ga_*",
    provider: "Google Analytics",
    purpose: "Distinguishes visitors and sessions for aggregate reporting.",
    duration: "up to 2 years",
    category: "analytics",
  },
  {
    name: "_gcl_au",
    provider: "Google Ads",
    purpose: "Attributes a booking to the ad that led to it.",
    duration: "90 days",
    category: "marketing",
  },
];

/**
 * US state Seller of Travel registrations.
 *
 * California, Florida, Washington, Hawaii and Iowa each require a business
 * that sells air travel to consumers in that state to register, and California
 * and Florida require the registration number to appear in advertising. This
 * is enforced by the states themselves, and Google Ads' Misrepresentation
 * policy expects the same claims to be verifiable.
 *
 * Leave this array EMPTY until the registrations actually exist. An invented
 * CST number is checkable against the California Attorney General's public
 * register in about ten seconds, and publishing one is a criminal matter in
 * California rather than merely an advertising problem.
 */
export const sellerOfTravelRegistrations: ReadonlyArray<{
  state: string;
  /** e.g. "CST", "ST", "UBI" — the label the state itself uses. */
  scheme: string;
  registrationNumber: string;
  /** Public register a reviewer can check the number against. */
  verifyUrl: string;
}> = [];

/**
 * Whether the business participates in California's Travel Consumer
 * Restitution Fund. Only registered California sellers of travel can, and
 * the disclosure wording differs depending on the answer, so this is a
 * three-state value rather than a boolean.
 */
export const californiaRestitutionFund: "participant" | "not-participant" | "not-applicable" =
  "not-applicable";

/**
 * Does the business sell or share personal information as the CCPA/CPRA
 * defines those terms?
 *
 * Read this carefully before setting it to false. Under the CPRA, running
 * Google Ads remarketing or passing identifiers to an ad platform generally
 * counts as "sharing" for cross-context behavioural advertising even when no
 * money changes hands. If any marketing tag in `dataProcessors` fires, the
 * honest answer is almost certainly true.
 */
export const sellsOrSharesPersonalInformation = dataProcessors.some(
  (processor) => processor.category === "marketing",
);

/**
 * US state privacy laws currently in force that grant consumers a right to
 * opt out of targeted advertising. The privacy-choices page enumerates these
 * so a resident can see their own state named rather than guessing whether
 * "California and similar states" includes them.
 */
export const usStatePrivacyLaws: ReadonlyArray<{
  state: string;
  law: string;
}> = [
  { state: "California", law: "CCPA, as amended by the CPRA" },
  { state: "Colorado", law: "Colorado Privacy Act" },
  { state: "Connecticut", law: "Connecticut Data Privacy Act" },
  { state: "Virginia", law: "Virginia Consumer Data Protection Act" },
  { state: "Utah", law: "Utah Consumer Privacy Act" },
  { state: "Texas", law: "Texas Data Privacy and Security Act" },
  { state: "Oregon", law: "Oregon Consumer Privacy Act" },
  { state: "Montana", law: "Montana Consumer Data Privacy Act" },
];

/**
 * How long a quote request or booking enquiry is retained before deletion.
 * Stated on the privacy page, so it has to match what the CRM actually does.
 */
export const enquiryRetentionPeriod = "24 months from the date of your last contact with us";
