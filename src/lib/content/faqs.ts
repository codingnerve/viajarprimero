import type { AccordionItem } from "@/components/ui/accordion";

/**
 * Site-wide FAQ.
 *
 * One source for the home page, the FAQ page and the FAQPage structured data,
 * so an answer can never say one thing on the home page and another on /faq —
 * which, for questions about fees and refunds, is a compliance problem rather
 * than a content inconsistency.
 *
 * Answers here must stay consistent with the policy pages. If a fee changes,
 * `serviceFees` in lib/config/legal.ts is the source of truth and these
 * answers must not contradict it.
 *
 * Order is load-bearing in one respect: the home page shows the first five, so
 * those five have to cover all four verticals rather than reading as a flight
 * FAQ with hotels mentioned further down.
 */
export const faqs: readonly AccordionItem[] = [
  {
    question: "What can you book for me?",
    answer:
      "Flights, hotels, car rental and cruises. Call us, or tell us what you need through the site, and an agent comes back with options priced in full — the same process and the same price breakdown in each case.",
  },
  {
    question: "Are you an airline, a hotel or a cruise line?",
    answer:
      "None of them. We are a travel agency, and we arrange travel as an agent for the airlines, hotels, rental companies and cruise lines that actually supply it. Their own terms — conditions of carriage, fare rules, booking conditions, rental agreements — govern what you buy.",
  },
  {
    question: "Do you charge a service fee?",
    answer:
      "Yes, and it is shown as a separate line in every quote before you pay, whichever vertical the quote is for. Our full fee schedule is published on the fees and charges page — nothing is added at the payment step.",
  },
  {
    question: "Is the price I see the final price?",
    answer:
      "The total we quote includes what the supplier charges, the taxes and mandatory fees that come with it, and our service fee. That means carrier-imposed charges on a flight, city and resort fees on a hotel, mandatory rental charges on a car, and port charges, taxes and gratuities on a cruise. Optional extras bought directly from the supplier are not included unless the quote says so.",
  },
  {
    question: "Can I change or cancel after booking?",
    answer:
      "That depends on the supplier's rules for what you booked, and they differ: an airline's fare rules, a hotel's cancellation deadline, a rental company's terms, a cruise line's cancellation schedule. We tell you which apply before you pay. We charge no fee of our own to process a change or cancellation — you pay only what the supplier charges under its own rules.",
  },
  {
    question: "When is my booking confirmed?",
    answer:
      "When the supplier confirms it and you have the reference — a ticket number for a flight, a confirmation number for a room, car or cabin. Not when you submit a request, and not when you make a payment. Prices and availability can change until then.",
  },
  {
    question: "What happens if the airline, hotel or cruise line cancels?",
    answer:
      "The supplier is responsible for the travel itself, and your rights come from them and from the regulations that apply to your booking. We will help you deal with them, but we cannot grant compensation or a refund on a supplier's behalf.",
  },
  {
    question: "Why do hotel quotes cost more than the rate I saw elsewhere?",
    answer:
      "Usually because ours has the taxes and the mandatory resort or destination fee already in it. Those are charged either way; the difference is whether you see them before you book or at check-out. We quote the total.",
  },
  {
    question: "What is not included in a car rental rate?",
    answer:
      "We tell you the excess you would be liable for, what the insurance actually covers, and the fuel policy, because those are what turn a cheap rate into an expensive rental. Rental companies also price by driver age and surcharge most drivers under 25, which is why we ask for it up front.",
  },
  {
    question: "Does a cruise fare cover everything on board?",
    answer:
      "No cruise fare does. We itemise the cabin fare, the port charges and government taxes, and the gratuities, and we say what is included on board rather than sold again once you are aboard. Drinks packages, speciality dining, shore excursions and wi-fi are almost always extra.",
  },
  {
    question: "Do I need a passport, visa or vaccination for my trip?",
    answer:
      "Entry requirements depend on your nationality, your route and current rules, and they change. You are responsible for holding the correct travel documents. We are not able to advise authoritatively on immigration requirements — check with the relevant embassy or official government source before you travel.",
  },
  {
    question: "Who do I contact about a booking I already have?",
    answer:
      "Use the channels on our contact page and quote your booking reference. For anything happening within 24 hours of departure — at the airport, at the rental desk, at the port — contact the supplier directly. They control the service and can act faster than we can.",
  },
  {
    question: "How do you handle my personal data?",
    answer:
      "We use your details to price and arrange your travel, and we share them with the airlines, hotels, rental companies and cruise lines needed to do that. We do not sell personal data. The privacy policy explains what we collect, why, how long we keep it, and how to exercise your rights.",
  },
] as const;
