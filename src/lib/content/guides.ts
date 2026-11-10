/**
 * Practical travel guides.
 *
 * These are task-shaped reference pages: "I need to do this specific thing,
 * what do I actually have to know". That is what separates them from
 * `articles.ts`, which explains how a system works, and from the traveller
 * tool pages under `(marketing)`, which describe what *we* do for you.
 *
 * Editorial rules for this collection, and they are not negotiable:
 *
 * - Nothing here may state a rule as universal when it is set by an airline,
 *   a supplier or a government. Say who sets it and tell the reader where to
 *   confirm it.
 * - No entitlement is promised. Passenger-rights regimes differ by route,
 *   carrier and country, and a guide that says "you will be compensated" is
 *   wrong somewhere and actionable everywhere.
 * - No fee, allowance or age threshold is quoted as a number unless it comes
 *   from `lib/config/legal.ts` and is therefore ours to state.
 *
 * Prose lives here as structured data rather than MDX because this project
 * carries no MDX dependency — the same decision `articles.ts` already made.
 */

export interface GuideSection {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly string[];
}

/**
 * "On the day" was "At the airport" while this collection was flight-only.
 * The same guidance is needed at a hotel desk, a rental counter and a cruise
 * terminal, so the category is named for the moment rather than the place.
 */
export type GuideCategory =
  | "Before you book"
  | "On the day"
  | "When things go wrong"
  | "Money";

export interface Guide {
  slug: string;
  title: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  category: GuideCategory;
  /** ISO date the guide was last substantively revised. */
  updatedAt: string;
  readingMinutes: number;
  intro: string;
  /** The short version, for readers who will not read the long version. */
  checklist: readonly string[];
  sections: readonly GuideSection[];
  /**
   * Related pages. Every href must be a route that exists — these are checked
   * by hand rather than generated, so keep them to static paths.
   */
  related: readonly { href: string; label: string }[];
}

export const guides: readonly Guide[] = [
  {
    slug: "flying-with-children-and-infants",
    title: "Flying with children and infants",
    summary:
      "How children are ticketed, what an infant fare actually buys, and the things to settle before you pay rather than at the gate.",
    category: "Before you book",
    updatedAt: "2026-03-04",
    readingMinutes: 8,
    intro:
      "Almost everything about flying with a child is decided by the airline rather than by any general rule, and the decisions that matter are made at booking. This guide covers what to establish before you pay, because the alternative is discovering it at a check-in desk with a toddler.",
    checklist: [
      "Confirm the airline's age definitions for infant, child and unaccompanied minor.",
      "Decide between an infant on your lap and an infant in a purchased seat.",
      "Check whether your car seat is approved for the aircraft and how it is carried.",
      "Ask what pushchair and baby-equipment allowance applies, and where the pushchair is collected.",
      "Book seats together explicitly rather than assuming the airline will do it.",
      "Check what travel documents a child needs for your route, including any consent letter.",
    ],
    sections: [
      {
        heading: "The age brackets are the airline's, not a standard",
        paragraphs: [
          "Carriers divide young passengers into infants, children and unaccompanied minors, and each carrier draws those lines where it chooses. The common pattern is that an infant is under two at the time of each flight and a child is under twelve, but the thresholds and the way they are applied to the return leg vary enough that you should read the airline's own family travel page for your specific carrier.",
          "The age that counts is usually the age on the date of travel, not the date of booking. A child who turns two between the outbound and the return is a real and frequent problem: on many airlines that return leg needs a seat and a child fare, and the ticket has to reflect it from the start.",
        ],
      },
      {
        heading: "Lap infant or purchased seat",
        paragraphs: [
          "An infant travelling on an adult's lap is normally ticketed at a reduced fare or a percentage of the adult fare, plus taxes. It does not buy a seat, it does not buy a baggage allowance on most carriers, and it does not entitle the infant to a seatbelt of their own beyond the loop belt the crew provides.",
          "Buying a seat for an infant costs more and, on most airlines, requires an approved child restraint device that you bring yourself. Parents who have done a long-haul flight both ways tend to have a strong opinion about which is worth it. The practical point for booking is that the two are different products and you have to choose at the time of booking, not at the airport.",
        ],
        list: [
          "Lap infants are usually limited to one per adult, which shapes how a family of two adults and three small children can be ticketed at all.",
          "Bassinets on long-haul aircraft are limited in number, attach only at certain bulkhead rows, and carry a weight and length limit. They are requested, not reserved, and are confirmed by the airline.",
          "If you buy a seat for an infant, confirm the car seat's approval marking and its width against the seat before you fly. An unapproved seat is refused at the gate.",
        ],
      },
      {
        heading: "Seating together is not automatic",
        paragraphs: [
          "Several carriers now have a policy of seating young children with an accompanying adult without charge, and several apply it only if seats are available when the booking is made. In practice the reliable approach is to select seats at booking, verify them again after any schedule change, and check them once more at check-in, because an aircraft swap reassigns everyone.",
          "If you are booking through us, tell us at the quote stage that you are travelling with children. Seat requests are made to the airline and the airline confirms them, so the earlier that request exists the better it tends to do.",
        ],
      },
      {
        heading: "Documents for a child",
        paragraphs: [
          "Children need their own passport for international travel in essentially every case, and a child cannot travel on a parent's passport under the arrangements most countries now operate. Child passports also expire faster than adult ones, which catches families who checked the adult passports and assumed.",
          "Some countries require documentary evidence of parental consent when a child travels with one parent, with a grandparent, or with anyone who is not a legal guardian, and border officers do ask. The requirement is set by the destination and sometimes by the country of departure. Check with the relevant embassy or the official government source for your route before you travel — we are not able to advise authoritatively on immigration requirements.",
        ],
      },
      {
        heading: "Unaccompanied minors",
        paragraphs: [
          "A child travelling without an adult is a separate service with its own rules, its own fee, and its own paperwork naming the adult who hands the child over and the adult who collects them. Many airlines will not accept an unaccompanied minor on an itinerary with a connection, and almost none will accept one where the connection involves a change of carrier or a self-transfer.",
          "This is not a booking you should make on price. Establish which carriers will accept the child on the routing you need, and build the itinerary around that answer.",
        ],
      },
    ],
    related: [
      { href: "/baggage-information", label: "Baggage information" },
      { href: "/flights", label: "Flight routes we cover" },
      { href: "/customer-support", label: "Customer support" },
    ],
  },
  {
    slug: "delayed-or-cancelled-flights",
    title: "When a flight is delayed or cancelled",
    summary:
      "What actually happens next, who is responsible for what, and the evidence to collect while you are still at the airport.",
    category: "When things go wrong",
    updatedAt: "2026-03-04",
    readingMinutes: 9,
    intro:
      "A disruption is the one moment where knowing the structure genuinely changes your outcome, because the useful actions have to happen in the first hour and most of them are yours to take. This guide is about that hour.",
    checklist: [
      "Talk to the operating airline first — it controls the aircraft and the rebooking.",
      "Get the reason for the disruption in writing or on the app, not verbally.",
      "Photograph the departure board and keep every boarding pass and receipt.",
      "Ask specifically what you are being offered: rebooking, refund, or a duty-of-care expense.",
      "Do not accept a voucher until you know what accepting it settles.",
      "Check your own travel insurance and card benefits before spending on a replacement.",
    ],
    sections: [
      {
        heading: "The airline operating the flight is the one that can act",
        paragraphs: [
          "We arrange travel as an agent for the airlines that operate the flights. When a flight is disrupted, the operating carrier holds the seats, the aircraft and the rebooking authority, and it is the only party that can put you on another aircraft. That is why our advice for anything happening at the airport or within twenty-four hours of departure is always to contact the airline directly first — they can act in minutes on something that would take us an exchange of messages to relay.",
          "We will help you deal with the airline afterwards, and we will chase a claim on your behalf. What we cannot do is grant compensation or a refund on the airline's behalf, and any page that implies an agent can is misleading you.",
        ],
      },
      {
        heading: "Get the reason, in writing",
        paragraphs: [
          "Whether anything is owed to you beyond a seat on another flight usually turns on the cause of the disruption and on which regulation applies to your route. Weather and air traffic control restrictions are treated differently from a crew shortage or a technical fault in most regimes, and the airline's own stated reason is the document a later claim is decided on.",
          "So capture it while it exists. The airline app, an email, or a text message stating the cause is worth considerably more than a verbal explanation at a gate, and the record has a habit of becoming less specific over the following weeks.",
        ],
        list: [
          "Screenshot the airline app showing the delay or cancellation and the stated reason.",
          "Photograph the departure board showing the status and the time.",
          "Keep boarding passes, bag tags and every receipt for food, transport and accommodation.",
          "Note the names of staff you dealt with and the time you spoke to them.",
        ],
      },
      {
        heading: "Rights depend on the route, not on the airline's goodwill",
        paragraphs: [
          "Passenger-rights regimes are set by governments and apply according to where you departed from, where you were going, and which carrier operated the flight. They differ substantially, and a rule that applies to a departure from one region may not apply to the same airline flying an identical delay elsewhere. That is why this guide does not tell you what you are entitled to.",
          "What it will tell you is that entitlements typically fall into three separable buckets, and that you should ask about each one by name rather than accepting the first thing offered.",
        ],
        list: [
          "Rerouting or a refund — being carried to your destination, or having the unused portion refunded.",
          "Duty of care — meals, communication and accommodation while you wait, which in most regimes is owed regardless of the cause.",
          "Fixed compensation — a set sum for the disruption itself, which in most regimes is owed only for causes within the airline's control.",
        ],
      },
      {
        heading: "Be careful what a voucher settles",
        paragraphs: [
          "A travel credit or voucher offered at the airport is sometimes generous and sometimes a settlement of a claim worth more than the voucher. Ask directly whether accepting it waives a compensation claim. If nobody can answer, take the rebooking and decline the voucher, and pursue the claim separately afterwards.",
          "The same applies to a refund offered in place of rerouting. In several regimes accepting a refund ends the airline's obligation to get you to your destination, which is the wrong trade if you still need to be there.",
        ],
      },
      {
        heading: "If you booked the legs separately",
        paragraphs: [
          "An itinerary made of two separate tickets is two separate contracts. A delay on the first that makes you miss the second is, to the second airline, simply a passenger who did not turn up. There is no protection, no rebooking obligation and usually no refund, and this is the single most expensive misunderstanding in flight booking.",
          "If your trip is built this way, the disruption plan has to be your own: your insurance, your card benefits, and a connection buffer long enough to absorb a delay. Our guide to multi-city trips covers how to tell the difference before you book.",
        ],
      },
      {
        heading: "Then come to us",
        paragraphs: [
          "Once you are rebooked and out of the airport, send us the booking reference, the evidence you collected and what the airline told you. We will take it up with the carrier, and we will tell you honestly if we think a claim has no prospect rather than billing you to file it.",
        ],
      },
    ],
    related: [
      { href: "/manage-booking", label: "Manage a booking" },
      { href: "/refund-and-cancellation-policy", label: "Refunds and cancellations" },
      { href: "/customer-support", label: "Customer support" },
    ],
  },
  {
    slug: "multi-city-and-open-jaw-trips",
    title: "Booking a multi-city or open-jaw trip",
    summary:
      "How an itinerary with more than two flights is priced, when separate tickets are a real saving, and when they are a liability.",
    category: "Before you book",
    updatedAt: "2026-03-04",
    readingMinutes: 7,
    intro:
      "Trips that are not a simple return get priced in ways that surprise people, and the structure you choose determines what protection you have when something goes wrong. The choice is worth making deliberately.",
    checklist: [
      "Decide whether the trip is one ticket or several before you compare prices.",
      "Check whether the fare rules allow a stopover, and at what cost.",
      "Leave a connection buffer that reflects the airport, not the minimum shown.",
      "Confirm that an open-jaw does not require you to arrange the surface segment yourself under time pressure.",
      "Never rely on a separate ticket to protect a later separate ticket.",
    ],
    sections: [
      {
        heading: "Open-jaw, multi-city and separate tickets are three different things",
        paragraphs: [
          "An open-jaw is a single ticket where you fly into one city and out of another, covering the gap yourself. A multi-city itinerary is a single ticket with three or more flown segments in a deliberate sequence. Separate tickets are several independent bookings that you have assembled into a trip in your head but not in any airline's system.",
          "The first two are one contract of carriage, and the airline is responsible for getting you through the whole sequence. The third is not, and no amount of care in scheduling changes that.",
        ],
      },
      {
        heading: "Why a multi-city fare is not the sum of its legs",
        paragraphs: [
          "Fares are constructed for an itinerary rather than accumulated per flight. A published fare has rules about the direction of travel, the minimum and maximum stay, and whether a stopover is permitted, and a multi-city itinerary is priced against those rules as a whole. This is why adding a third city sometimes costs very little and sometimes costs more than a separate return would.",
          "It also means that an open-jaw is frequently cheaper than you expect. Flying into one city and out of another can price close to a straightforward return, and it removes a backtracking leg from your trip entirely.",
        ],
      },
      {
        heading: "Stopovers",
        paragraphs: [
          "A stopover is a deliberate stay of more than a set number of hours at a connecting point, and whether one is allowed — and at what price — is set by the fare rules of the specific ticket. Some airlines actively market stopovers at their hub; on other fares a long layover reprices the whole itinerary.",
          "This is a good thing to ask us about rather than to experiment with in a search box, because the search engine will happily show you a price for something the fare rules do not permit at that price.",
        ],
      },
      {
        heading: "When separate tickets are worth it",
        paragraphs: [
          "Sometimes they genuinely are. A long-haul on one carrier and a regional flight on a low-cost airline that does not interline with anybody can be far cheaper than any single-ticket routing, and if the saving is large and you build in real slack, it can be the right call.",
          "The condition is that you accept the risk explicitly and price it. That means a connection buffer measured in hours rather than the sixty minutes a booking site will let you select, an overnight in the connecting city on the outbound if the schedule is thin, and insurance that covers a missed onward flight caused by a delay rather than a cancellation.",
        ],
        list: [
          "Check whether your bags are through-checked. On separate tickets they usually are not, which means clearing customs, collecting bags and re-checking in.",
          "Check whether the connecting airport requires you to pass immigration to move between terminals, and whether you hold the visa or transit permission to do so.",
          "Put the riskier leg first when you can, so a delay costs you a cheap flight rather than an expensive one.",
        ],
      },
      {
        heading: "Ask us to price it both ways",
        paragraphs: [
          "For anything more complicated than a return, send us the shape of the trip rather than a specific set of flights. We will price the single-ticket construction and the separate-ticket construction, show you both totals with our service fee as its own line, and tell you what each one protects you against. Choosing the cheaper one with your eyes open is a perfectly good decision. Choosing it without knowing is not.",
        ],
      },
    ],
    related: [
      { href: "/flights", label: "Flight routes we cover" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/travel-blog/what-to-check-before-you-book-a-connection", label: "What to check before you book a connection" },
    ],
  },
  {
    slug: "special-assistance-and-medical-needs",
    title: "Requesting special assistance",
    summary:
      "How airport and airline assistance is arranged, what notice it needs, and how mobility aids and medication are handled.",
    category: "On the day",
    updatedAt: "2026-03-04",
    readingMinutes: 8,
    intro:
      "Assistance at an airport is a service that has to be requested, routed to the right operator and confirmed. It is reliable when it is arranged properly and unreliable when it is assumed, and the difference is almost entirely made at booking.",
    checklist: [
      "Request assistance at the time of booking, and at minimum well before departure.",
      "Say what help is actually needed rather than naming a condition.",
      "Declare a wheelchair or mobility aid with its dimensions, weight and battery type.",
      "Carry medication in hand baggage with its documentation.",
      "Reconfirm the request after any schedule change or aircraft swap.",
      "Check the assistance arrangements at every airport in the itinerary, including the connection.",
    ],
    sections: [
      {
        heading: "Who actually provides it",
        paragraphs: [
          "In most countries assistance inside the terminal is provided by the airport or a contractor it appoints, not by the airline, while assistance on board is the airline's. The request is normally made to the airline, which passes it to the airport. That handover is where requests get lost, which is why a request made late or made only to one party is the one that fails.",
          "Airlines generally ask for advance notice — a set number of hours before departure is common — and meeting that deadline is what obliges the airport to have someone there. Requesting earlier is always better.",
        ],
      },
      {
        heading: "Describe the help, not the diagnosis",
        paragraphs: [
          "Assistance is categorised by what the passenger needs at each stage: help to the gate, help to the aircraft door, help to the seat, help with a connection, help with orientation for a visual impairment, or an escort for someone travelling with a hidden disability. Naming the practical requirement gets the right category coded onto the booking; naming a condition often does not.",
          "Be specific about the parts of the journey that are hard rather than the journey as a whole. Long walks between gates, standing in a queue, hearing announcements and following a connection under time pressure are all separately solvable.",
        ],
      },
      {
        heading: "Wheelchairs and mobility aids",
        paragraphs: [
          "Mobility aids are carried in addition to your baggage allowance under most carriers' rules and in several regulatory regimes, but they must be declared, and a powered chair has to be declared in detail. The battery chemistry decides whether it can be carried at all and how it must be prepared, and airlines apply the dangerous-goods rules here strictly because they are not free to do otherwise.",
          "Give the airline the make and model, the folded dimensions, the weight, and the battery type. If you can use your own chair to the aircraft door rather than transferring early, say so — it is usually possible and it means the chair spends less time out of your control.",
        ],
        list: [
          "Photograph the chair before handover, including any existing damage.",
          "Remove and carry loose parts such as cushions, joysticks and footplates where you can.",
          "Attach clear handling instructions to the chair itself, not only to the booking.",
          "Report any damage before leaving the baggage hall, and get it recorded in writing.",
        ],
      },
      {
        heading: "Medication, equipment and dietary needs",
        paragraphs: [
          "Carry essential medication in hand baggage, in its original labelled packaging, with a copy of the prescription or a letter from your prescriber. Hold baggage goes missing and hold temperatures are not controlled for medicines. Liquid medication is normally exempt from the standard cabin liquid limits, but you should expect to declare it at security and to be asked for documentation.",
          "Medical devices such as portable oxygen concentrators and CPAP machines usually require the airline's approval before travel, and approval is specific to the device model. Start that conversation early, because it can involve a form completed by a doctor.",
          "Special meals are ordered from the airline and generally need to be requested some days ahead. A meal ordered late will not appear, and cabin crew cannot create one in the air.",
        ],
      },
      {
        heading: "Reconfirm after any change",
        paragraphs: [
          "A schedule change, an aircraft swap or a rebooking after a disruption creates a new flight record, and an assistance request does not always follow it across. After any change to your itinerary, check that the request is still on the booking. If you booked through us, ask us and we will confirm it with the airline in writing.",
        ],
      },
    ],
    related: [
      { href: "/accessibility-statement", label: "Accessibility statement" },
      { href: "/manage-booking", label: "Manage a booking" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    slug: "booking-a-flight-for-someone-else",
    title: "Booking a flight for someone else",
    summary:
      "Name accuracy, paying with your own card, and the consent and contact details that keep a third-party booking working.",
    category: "Before you book",
    updatedAt: "2026-03-04",
    readingMinutes: 6,
    intro:
      "Booking travel for a relative, a colleague or a client is routine, and it goes wrong in a small number of predictable ways. Nearly all of them are about names, payment or who the airline will actually talk to.",
    checklist: [
      "Copy the name exactly as it appears on the passport, from the passport.",
      "Check the airline's rules on third-party card payment before you pay.",
      "Give the traveller's own contact details for disruption notices, and yours as well.",
      "Confirm you have the traveller's consent to share their personal data with us and the airline.",
      "Send the traveller their own copy of the itinerary and the fare rules.",
    ],
    sections: [
      {
        heading: "The name is the part that fails",
        paragraphs: [
          "A ticket has to match the traveller's passport closely enough that the airline and the border authority accept it. Middle names, double-barrelled surnames, accented characters, suffixes and the order of given names in some naming conventions all cause problems, and the failure surfaces at check-in when nothing can be done cheaply.",
          "Work from a photograph of the passport data page rather than from memory or from what someone tells you over the phone. Most airlines permit only a minor spelling correction after ticketing, some charge for it, and a change of passenger is generally not a correction at all — it is a cancellation and a rebooking at the current fare.",
        ],
        list: [
          "Enter the given names and surname in the fields the airline labels for them, not as one string.",
          "Include a middle name only if the airline's field asks for it; some carriers require it and others reject it.",
          "Ignore accents and hyphens only if the passport's machine-readable zone does, and check rather than assume.",
        ],
      },
      {
        heading: "Paying with your card for someone else's ticket",
        paragraphs: [
          "Airlines treat third-party payment as a fraud risk, and their responses range from accepting it without comment to requiring a signed authorisation form with a copy of the card and the cardholder's identification presented at the airport. Some carriers void such tickets without warning.",
          "Establish the rule before you pay rather than after. When you book through us, tell us at the quote stage that the cardholder is not the traveller and we will confirm the carrier's requirement in writing before anything is charged, so a ticket cannot be issued on a basis the airline will later reject.",
        ],
      },
      {
        heading: "Who gets told when the flight changes",
        paragraphs: [
          "Schedule changes, cancellations and gate information go to the contact details on the booking. If those are yours and you are asleep in another time zone, the traveller finds out at the airport. Put the traveller's own mobile number and email on the booking, and add yours as a secondary contact so that both of you are notified.",
          "This matters more than it sounds. A rebooking offer sent by an airline often expires, and the person who can accept it needs to be the person who receives it.",
        ],
      },
      {
        heading: "Consent and data",
        paragraphs: [
          "To arrange the travel we need the traveller's passport details, contact details and sometimes information about their assistance or dietary needs, and we pass those to the airlines and suppliers who need them. You should have the traveller's agreement before you give us that information. Our privacy policy sets out what we collect, why, how long we hold it and how the traveller can exercise their own rights over it — send them the link along with the itinerary.",
          "Send them the fare rules too. The person flying is the person who has to live with the change and cancellation conditions, and they should have seen them before the ticket was issued rather than after.",
        ],
      },
    ],
    related: [
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/fees-and-charges", label: "Fees and charges" },
    ],
  },
  {
    slug: "reading-a-travel-insurance-policy",
    title: "Reading a travel insurance policy",
    summary:
      "What the sections of a policy actually do, the exclusions that decide most claims, and what to check against your existing cover first.",
    category: "Money",
    updatedAt: "2026-03-04",
    readingMinutes: 8,
    intro:
      "We do not sell insurance and we are not authorised to advise you on which policy to buy. What we can do is explain how these documents are structured, because most declined claims turn on a section the traveller never read.",
    checklist: [
      "Check what cover you already have through a card, a bank account or an employer.",
      "Read the medical section first — it is the part with the large numbers.",
      "Find the pre-existing condition wording and the declaration process.",
      "Check the per-item limit, not just the total, for baggage and electronics.",
      "Confirm the policy covers a missed connection on separate tickets if that is how you are travelling.",
      "Buy at the time of booking if cancellation cover matters to you.",
    ],
    sections: [
      {
        heading: "A policy is several separate covers in one document",
        paragraphs: [
          "Travel insurance bundles distinct products under one certificate, each with its own limit, its own excess and its own exclusions. Medical and repatriation, cancellation and curtailment, delay and missed departure, baggage and personal effects, and personal liability are effectively five policies, and a claim is assessed under one of them rather than against the headline sum.",
          "That is why the price comparison that matters is section by section. A policy with a large overall figure and a small per-item baggage limit is a different product from one arranged the other way round.",
        ],
      },
      {
        heading: "The medical section is the one that justifies the purchase",
        paragraphs: [
          "The cancellation and baggage sections cover sums you could probably absorb. The medical and repatriation section covers a sum you almost certainly could not, and it is the reason to hold cover at all. Read its limit, its excess, and what it says about repatriation and about a companion staying with you.",
          "Reciprocal healthcare arrangements between some countries reduce but do not replace this. They typically cover state treatment on the same terms as a resident and do not cover repatriation, which is the expensive part.",
        ],
      },
      {
        heading: "Exclusions decide most claims",
        paragraphs: [
          "Insurers publish their exclusions and claims are declined under them rather than in spite of them. The recurring ones are worth knowing before you buy, because several are avoidable by choosing a different policy or by declaring something honestly at the outset.",
        ],
        list: [
          "Pre-existing medical conditions, undeclared, including conditions of a relative whose illness causes you to cancel.",
          "Alcohol, which is read broadly in some wordings and narrowly in others.",
          "Activities the insurer classes as hazardous, which can include ordinary things like riding a scooter or skiing without a specific extension.",
          "Travel to a country or region a government has advised against, which can void cover entirely for the trip.",
          "Unattended possessions, and items not reported to the police or the carrier within a stated period.",
          "Claims without documentation, which is why the report and the receipts matter as much as the cover.",
        ],
      },
      {
        heading: "When you buy it changes what it covers",
        paragraphs: [
          "Cancellation cover generally runs from the date the policy is purchased, so a policy bought the week before departure covers you for very little of the risk you were exposed to while you held the booking. If cancellation is a real concern, the time to buy is when the trip is booked.",
          "An annual multi-trip policy usually costs less than three single-trip policies, and it removes the temptation to skip cover on a short trip. Check its per-trip duration limit, which is often shorter than people assume.",
        ],
      },
      {
        heading: "Check what you already hold",
        paragraphs: [
          "Some credit cards, packaged bank accounts and employer schemes include travel cover, occasionally good cover. It usually comes with conditions — that the trip was paid for on the card, that you are under an age limit, that you registered before travel — and it is worth reading the certificate rather than trusting the marketing summary.",
          "Where you already hold adequate cover, buying more does not double your payout. Insurers apply contribution clauses between policies, and the second policy frequently buys you nothing but the excess on a second claim form.",
        ],
      },
      {
        heading: "Where we stand",
        paragraphs: [
          "We are a travel agency, not an insurance intermediary. We will tell you what a fare's own change and cancellation rules are, in writing, before you pay, so you know exactly what risk is left for a policy to cover. Deciding whether and what to insure is yours, and any policy you buy is a contract between you and the insurer.",
        ],
      },
    ],
    related: [
      { href: "/refund-and-cancellation-policy", label: "Refunds and cancellations" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/faq", label: "Frequently asked questions" },
    ],
  },
  {
    slug: "hotel-cancellation-deadlines-and-deposits",
    title: "Hotel cancellation deadlines and deposits",
    summary:
      "What a free-cancellation rate actually guarantees, when the deadline really falls, and why the card you booked with is not always the card that pays.",
    category: "Before you book",
    updatedAt: "2026-04-22",
    readingMinutes: 7,
    intro:
      "A hotel rate is two decisions bundled into one number: what the room costs, and what happens if your plans change. The second one is set by the property, is written into the rate you picked rather than into the hotel as a whole, and is the part most travellers do not read until they need it. This guide covers what to establish before you pay.",
    checklist: [
      "Read the cancellation deadline as a date and a time in the property's own time zone.",
      "Establish whether the rate is prepaid or pay-at-property, and what that changes.",
      "Ask what the property takes at check-in as a deposit or pre-authorisation.",
      "Check whether city or tourist tax is included in the rate or collected locally.",
      "Confirm the name on the booking matches the ID and card presented at check-in.",
      "Note the property's own check-in and check-out times before you plan the day around them.",
    ],
    sections: [
      {
        heading: "The deadline belongs to the rate, not to the hotel",
        paragraphs: [
          "The same room in the same hotel on the same night is commonly sold on several rates at once, and the cancellation terms differ between them. A property is not \"free cancellation\" or \"non-refundable\"; a rate is. Comparing two quotes for the same hotel without comparing their cancellation terms compares two different products.",
          "Deadlines are stated in the property's local time, which is the detail that catches people crossing time zones. A deadline of 18:00 the day before arrival is 18:00 where the hotel is, and a cancellation submitted at what feels like the afternoon of the previous day can land after it. When we quote a stay we write the deadline out as a date and a time in the property's own time zone for exactly this reason.",
        ],
      },
      {
        heading: "Prepaid is a different product, not a discount",
        paragraphs: [
          "A prepaid rate is charged when you book rather than when you stay, and it is usually cheaper because you have taken on the risk of not being able to travel. That is a reasonable trade for a trip that is certain and a poor one for a trip that is not. Where a rate is prepaid we label it as prepaid rather than describing the difference as a saving.",
          "Prepaid does not always mean non-refundable, and non-refundable does not always mean nothing is returned. Some prepaid rates permit a date change but not a cancellation. Some non-refundable rates still return the taxes. The only reliable source is the rate's own terms, which is why we put them in the quote rather than summarising them.",
        ],
      },
      {
        heading: "What the property takes at check-in",
        paragraphs: [
          "Most properties place a hold on a payment card at check-in against incidentals, and the amount, the currency and how long the hold takes to drop off afterwards are all the property's own policy. A hold is not a charge, but it does reduce the credit or balance available to you for the duration, which matters on a debit card more than on a credit card.",
          "Some properties require the card used to book to be presented at check-in, and some will not accept a third party's card at all. If someone else is paying for the room, settle that with the property in advance rather than at the desk. Ask us and we will put the question to them in writing before you travel.",
        ],
        list: [
          "City, tourist or occupancy taxes are frequently collected at the property rather than included in a prepaid rate. We state which applies in the quote.",
          "A mandatory resort or destination fee is charged whether or not you use what it covers. It is part of the price, and we include it in the total we quote.",
          "Deposits taken in cash are refunded on the property's own terms and timetable, which is worth knowing before you agree to one.",
        ],
      },
      {
        heading: "If the room is not what was booked",
        paragraphs: [
          "Raise it at the property, at the moment you find it, and ask for the resolution in writing before you accept an alternative room. A property that has moved you to a smaller room or a different building can usually fix it while you are standing there, and almost never once you have checked out and gone home.",
          "If it cannot be resolved on the spot, tell us while you are still on site. We can take it up with the property, and a contemporaneous record of what was booked and what was provided is what makes that conversation work. We cannot alter a property's cancellation terms after the fact, and neither can anyone else.",
        ],
      },
    ],
    related: [
      { href: "/hotels", label: "Hotels" },
      { href: "/refund-and-cancellation-policy", label: "Refunds and cancellations" },
      { href: "/customer-support", label: "Customer support" },
    ],
  },
  {
    slug: "driving-abroad-licences-and-paperwork",
    title: "Driving abroad: licences, permits and paperwork",
    summary:
      "Which licence is accepted where, when an International Driving Permit is genuinely required, and the documents a rental desk will refuse you without.",
    category: "Before you book",
    updatedAt: "2026-04-15",
    readingMinutes: 8,
    intro:
      "Car rental is the vertical where a booking most often falls apart at the counter, and it is nearly always paperwork rather than price. The requirements come from three separate places — the country you are driving in, the rental company, and the card you intend to pay with — and satisfying two of the three is not enough. Settle all of it before you book.",
    checklist: [
      "Check whether your licence is accepted in the destination country in its own right.",
      "Establish whether an International Driving Permit is required, and get it before you leave.",
      "Confirm how long you have held the licence, not just that you hold it.",
      "Check the rental company's minimum and maximum driver age and any young-driver surcharge.",
      "Confirm the payment card is a credit card in the main driver's name if the company requires one.",
      "Ask whether the car may cross a border, and what that costs.",
    ],
    sections: [
      {
        heading: "Three sets of rules, all of which apply",
        paragraphs: [
          "The country sets what licence is legally valid on its roads. The rental company sets who it is willing to rent to, which is usually stricter. The payment card sets what security it can provide, which is where an otherwise valid booking most often fails. All three have to be satisfied, and none of them will accept the others as a substitute.",
          "None of these are rules we can waive or vary, and no agency can. What we can do is ask the specific rental company the specific question before you commit, which is why our quote asks for the driver's age and where the car is being collected.",
        ],
      },
      {
        heading: "International Driving Permits",
        paragraphs: [
          "An International Driving Permit is a translation of your existing licence, not a licence in its own right, and it is only valid alongside the licence it translates. Whether one is required depends on the country you are driving in and on which country issued your licence, and the answer changes as bilateral arrangements change.",
          "The permit is issued in your country of residence before you travel and cannot be obtained at the destination. Check the requirement with the destination country's own authority or your national motoring organisation, and allow time — some are issued over the counter and some by post.",
        ],
      },
      {
        heading: "What the rental desk checks",
        paragraphs: [
          "Expect the desk to want the physical licence, a form of photo identification, the payment card in the main driver's name, and the booking reference. Several markets also check the licence against a national endorsement record, which requires a code or a check number that you generate before you travel and that expires after a short window.",
          "How long you have held the licence matters as much as holding it. Many companies require a minimum period, commonly measured in years, and apply it regardless of the driver's age. Additional drivers are checked to the same standard and usually carry their own fee.",
        ],
        list: [
          "Rental companies price by driver age and surcharge most drivers under 25. Some decline them outright on certain vehicle classes.",
          "Debit cards are accepted by some companies and refused by others, and those that accept them often require a larger deposit or proof of a return ticket.",
          "Cross-border travel is frequently restricted by vehicle class as well as by country, and taking a car across an undeclared border can void the cover entirely.",
        ],
      },
      {
        heading: "The costs that are not the daily rate",
        paragraphs: [
          "Tolls, urban access charges and road-use vignettes are the driver's responsibility and are separate from the rental. Several countries require a vignette to be displayed before you join a motorway at all, and enforcement is automated. Establish what applies on your route before you set off rather than at the barrier.",
          "The excess — the amount you remain liable for if the car is damaged — is set by the rental company and varies enormously by vehicle class. We state it in the quote, along with what the included insurance actually covers, because that figure is what decides whether a cheap rate is cheap.",
        ],
      },
    ],
    related: [
      { href: "/car-rentals", label: "Car rental" },
      { href: "/fees-and-charges", label: "Fees and charges" },
      { href: "/customer-support", label: "Customer support" },
    ],
  },
  {
    slug: "boarding-a-cruise",
    title: "Boarding a cruise",
    summary:
      "Online check-in, boarding windows, the documents every port wants, and why a cruise line's deadline is harder than an airline's.",
    category: "On the day",
    updatedAt: "2026-04-08",
    readingMinutes: 7,
    intro:
      "A ship leaves when it leaves. There is no later sailing, no rebooking onto the next one, and a passenger who misses embarkation is generally expected to reach the next port at their own expense. That makes the day you board the least forgiving day in travel, and almost all of the difficulty is avoidable with paperwork done in advance.",
    checklist: [
      "Complete the line's online check-in as soon as it opens and print or download the boarding documents.",
      "Check passport validity against the rules of every country the ship calls at, not just the first.",
      "Establish whether any port on the itinerary requires a visa for your nationality.",
      "Note your assigned boarding window and the final boarding time, which are different things.",
      "Register a card against the onboard account before you sail.",
      "Pack medication, documents and anything for the first evening in a bag you carry on yourself.",
    ],
    sections: [
      {
        heading: "Online check-in is not optional any more",
        paragraphs: [
          "Every major line now requires check-in to be completed online before arrival, typically opening some weeks before departure and closing a few days before it. It collects passport details, an emergency contact, the card for the onboard account and a security photograph, and it produces the boarding pass and luggage tags.",
          "The window matters because boarding times are usually allocated in the order check-in is completed. Completing it early tends to get you a better arrival slot at the terminal, which on a large ship is the difference between walking on and queueing for an hour.",
        ],
      },
      {
        heading: "Documents are checked against every port, not just the first",
        paragraphs: [
          "Your passport has to satisfy the entry rules of each country the itinerary visits, and those rules differ. A common pattern is a requirement for validity some months beyond the date of travel, and it is assessed against the last port rather than the first. Visa requirements likewise depend on your nationality and on each individual country.",
          "Entry requirements change, and we are not able to advise authoritatively on them. Check each country on the itinerary with its own embassy or official government source before you sail. A passenger refused boarding on documentary grounds is not owed a refund by the line.",
        ],
        list: [
          "Closed-loop itineraries that begin and end in the same country sometimes have relaxed document rules, but the relaxation is specific and it is not universal.",
          "A name on the booking that does not match the passport exactly is a problem to fix weeks out, not at the terminal.",
          "Some ports require an onward or return travel document to be shown, particularly where a cruise ends in a different country from where it began.",
        ],
      },
      {
        heading: "The boarding window and the deadline",
        paragraphs: [
          "The assigned boarding window is when the line would like you to arrive, and it manages the flow of several thousand people through one terminal. The final boarding deadline is a different time, usually an hour or more before departure, and it is the one that is enforced.",
          "If you are flying to the port, arriving the day before is the only arrangement that survives a delayed flight. A cruise line has no obligation to hold a ship for a passenger whose flight was late unless the flight was booked through the line as part of the package, and even then the remedy is usually transport to the next port rather than a refund.",
        ],
      },
      {
        heading: "What runs on the onboard account",
        paragraphs: [
          "Almost nothing on a ship is paid for in cash. A card registered at check-in backs an onboard account, and drinks outside any included package, speciality dining, shore excursions, wi-fi, the spa and gratuities where they are not prepaid all settle against it at the end of the voyage.",
          "Gratuities are the item that most often surprises people, because on many lines they are charged per passenger per day and applied automatically. Where they are not already in the fare we say so in the quote, along with the port charges and government taxes, so the figure you are comparing is the figure you will pay.",
        ],
      },
    ],
    related: [
      { href: "/cruises", label: "Cruises" },
      { href: "/faq", label: "Frequently asked questions" },
      { href: "/customer-support", label: "Customer support" },
    ],
  },
] as const;

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

/** Newest revision first, which is the order the hub lists them in. */
export function getGuidesByDate(): readonly Guide[] {
  return [...guides].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Grouped for the hub page. Categories are returned in a fixed editorial
 * order rather than in whatever order the data happens to be written in, and
 * an empty category is omitted rather than rendered as a bare heading.
 */
const categoryOrder: readonly GuideCategory[] = [
  "Before you book",
  "On the day",
  "When things go wrong",
  "Money",
];

export function getGuidesByCategory(): ReadonlyArray<{
  category: GuideCategory;
  guides: readonly Guide[];
}> {
  return categoryOrder
    .map((category) => ({
      category,
      guides: guides.filter((guide) => guide.category === category),
    }))
    .filter((group) => group.guides.length > 0);
}
