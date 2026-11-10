/**
 * Home page copy.
 *
 * Kept out of the page file so `app/` stays composition, and kept deliberately
 * vertical-neutral: the same three steps and the same three commitments apply
 * whether the request is a flight, a room, a car or a cabin. Where a sentence
 * has to name a supplier it says "airline, hotel, rental company or cruise
 * line" rather than defaulting to the airline, because defaulting to the
 * airline is how a four-vertical agency ends up reading as a flight site.
 *
 * Every claim here has to be one the business can stand behind. No savings
 * percentages, no invented customer counts, no accreditations we do not hold.
 */

export const commitments = [
  {
    title: "The price you hear is the price you pay",
    body: "Before you pay, the agent tells you the supplier's charge, the taxes and mandatory fees, and our service fee, adding up to the total. We do not add a fee at the payment step.",
    href: "/fees-and-charges",
    linkLabel: "See our fee schedule",
  },
  {
    title: "The rules before payment, not after",
    body: "Whether something can be changed or refunded is set by the supplier — the airline's fare rules, the hotel's cancellation deadline, the rental company's terms. We tell you which apply while you can still choose differently.",
    href: "/refund-and-cancellation-policy",
    linkLabel: "Read the refund policy",
  },
  {
    title: "We say what we are",
    body: "We are a travel agency. We arrange travel as an agent for the airlines, hotels, rental companies and cruise lines that supply it. We are none of those things ourselves, and we do not claim accreditations we do not hold.",
    href: "/about",
    linkLabel: "About us",
  },
] as const;

/**
 * Home page photography.
 *
 * Files sit in `public/images/home` and are served from `/images/home/`.
 * Source: Unsplash, under the Unsplash License.
 *
 * Every `alt` describes what is in the frame and nothing more. These are stock
 * photographs of cars on roads — not our fleet, because we do not have one,
 * and not the car anybody will be given. A caption that implied either would
 * be the same misrepresentation the rest of this file exists to avoid.
 */
export const carHirePhotos = [
  {
    src: "/images/home/car-hire-road-trip.jpg",
    alt: "A camper van on an empty desert highway between red rock cliffs.",
  },
  {
    src: "/images/home/car-hire-compact.jpg",
    alt: "A small blue five-door hatchback parked on a quiet suburban street.",
  },
  {
    src: "/images/home/car-hire-suv.jpg",
    alt: "A full-size white SUV parked on a gravel track in a red rock desert.",
  },
] as const;

export const whyUsPhoto = {
  src: "/images/home/why-us-road.jpg",
  alt: "A white SUV parked on a wet gravel road below a snow-covered mountain.",
} as const;
