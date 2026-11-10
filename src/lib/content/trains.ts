/**
 * Rail booking guide.
 *
 * One generic page, deliberately naming no train operator: fares, timetables,
 * allowances and fare rules belong to whichever operator runs the service, and
 * none are hard-coded here. Anything that depends on the ticket is deferred to
 * the team, who confirm it with the traveller before a booking is made.
 *
 * Copy here must not name the brand, the phone number or the email address —
 * those come from `lib/config/site.ts` at render time.
 */

export type SeatClass = { name: string; description: string };

export const railGuide = {
  intro:
    "Tell us where and when you want to travel by train and our team will check the options with you: schedules, fares, seat types and ticket rules, all confirmed before anything is booked.",
  guideIntro:
    "Rail travel ranges from frequent city-to-city trains to long journeys with sleeping accommodation. Which services, seat types and fares apply depends on the route, the date and the train, so this guide explains how booking works and what to ask before you commit.",
  highlights: [
    "Schedules and fares checked for you",
    "Seat and ticket rules explained up front",
    "Handled by a real travel agent",
  ],
  whyBook:
    "Rail is often one part of a bigger trip: a flight in, a few nights in a hotel, a car at the other end. Sending us the whole picture means one person checks that the connections make sense, explains the fare rules attached to your ticket in plain language, and tells you the full price before anything is booked.",
  howToBook:
    "Send us your route, travel dates and how many passengers are travelling, using the search above or by phone. We check live schedules and fares, come back with the options that fit, and explain the rules on each one. Nothing is booked until you have agreed, and no payment is taken on this website.",
  manageBooking:
    "If you booked through us, contact us with your name and travel date and we will help with changes, questions about your ticket or a disrupted journey. For live train status on the day, the operator's own app and station boards are the authority.",
  seatClassesIntro:
    "Which classes are offered depends on the train. Many services sell the options below; we confirm exactly what is on your service before you decide.",
  seatClasses: [
    {
      name: "Standard seat",
      description:
        "The everyday seat on most services, reserved or unreserved depending on the train. A sensible choice for shorter daytime journeys.",
    },
    {
      name: "Business or first class",
      description:
        "A step up in space and comfort on selected trains, usually with extra legroom and a quieter seating area. Availability varies by service and date.",
    },
    {
      name: "Sleeper",
      description:
        "Private rooms or berths on some overnight trains. Room types differ in size and facilities, and the fare structure differs from a seat fare, so we walk you through what is included.",
    },
  ] as SeatClass[],
  changePolicy:
    "Whether a ticket can be changed, and what that costs, depends on the fare you buy and on the operator's rules at the time. We check the conditions attached to your specific ticket and tell you before you book, so there are no surprises later. If your plans change after booking, contact us as early as you can.",
  cancellationPolicy:
    "Refund rules differ between fare types and can change with how close to departure you cancel. We read out the cancellation conditions for your fare before booking, and any fee the operator charges is passed on to you at cost. Our own service fee is covered on our fees and charges page.",
  baggageIntro:
    "Allowances depend on the ticket and the service, so treat the points below as the questions to ask rather than a promise of what is included.",
  baggage: [
    {
      title: "Carry-on luggage",
      detail:
        "Trains generally let you keep a limited amount of luggage with you in the carriage. We confirm the carry-on rules for your service and ticket.",
    },
    {
      title: "Larger bags",
      detail:
        "Checked baggage is only offered on some services, and bulky items such as bicycles or sports equipment often need advance arrangements. Ask us before you book.",
    },
  ],
  stationCheckIn:
    "Stations can be busy and some sit outside the town centre, so allow time for the transfer and arrive with time to spare. Bring the photo ID and the booking details we send you. We tell you which station each of your journeys uses so there is no confusion between stops with similar names.",
  faqs: [
    {
      question: "Can you book train tickets for me?",
      answer:
        "Yes. Send us the route, dates and number of passengers and our team will check availability and fares, explain the ticket conditions and confirm the full price with you before anything is booked.",
    },
    {
      question: "Do you show train prices on this page?",
      answer:
        "No. Fares change with date, demand and ticket type, so we do not publish figures we cannot guarantee. We give you a firm price in writing before you agree to book.",
    },
    {
      question: "Can I combine a train journey with flights or a hotel?",
      answer:
        "Yes. Many travellers pair a rail leg with flights, hotels or a rental car. Tell us the whole trip and we will check that the timings connect.",
    },
    {
      question: "Is payment taken on this website?",
      answer:
        "No. This website only sends us your request. Payment is discussed with you directly after we have confirmed the details.",
    },
  ],
};
