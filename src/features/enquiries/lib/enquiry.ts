import {
  carTypes,
  usStates,
} from "@/lib/content/car-rental-locations";
import {
  cruiseDestinations,
  usCruisePorts,
} from "@/lib/content/cruise-ports";
import type { PicklistGroup } from "@/types/picklist";
import type { Enquiry, EnquiryErrors, EnquiryVertical } from "@/features/enquiries/types";

/**
 * Validation for hotel, car rental, cruise, vacation and charter requests.
 *
 * Shared by the form and the route handler on purpose — client-side validation
 * is a convenience for the traveller, not a control, and the same rules have
 * to hold on the server where they cannot be bypassed.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Youngest age any major rental company will rent to, subject to surcharges. */
const MIN_DRIVER_AGE = 18;
const MAX_DRIVER_AGE = 99;

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

/**
 * Per-vertical wording for the shared date and place fields.
 *
 * The form and the validation messages both read from here, so a hotel
 * enquiry says "check-in" and a car enquiry says "pick-up" without either
 * needing its own component or its own copy of the rules.
 */
export const verticalCopy: Record<
  EnquiryVertical,
  {
    label: string;

    /*
      Short labels, for the compact panel on the home page. Its label is an
      overline inside a narrow cell, so anything past two words wraps to three
      lines — which is why the long form below gets its own wording rather
      than sharing these.
    */
    destinationLabel: string;
    destinationPlaceholder: string;
    startLabel: string;

    /*
      Long labels, for the full quote form, which has room to ask a question
      rather than head a box. Most verticals reuse the short label because it
      already reads as an instruction. Cruises do not: "Sailing region" tells
      somebody who has never booked a cruise nothing about what to type.
    */
    destinationQuestion: string;
    startQuestion: string;

    destinationHint: string;
    /**
     * The validation messages, written out per vertical rather than
     * interpolated from the label. Interpolating gave "Tell us the arriving
     * at." on the jet form — a label that reads well above an input does not
     * always survive being dropped into a sentence.
     */
    destinationMissing: string;
    startMissing: string;

    /**
     * Turns the destination into a picklist rather than a free-text box.
     *
     * Only cruises have one. A cruise is sold by region — nobody books "a
     * cruise to Cozumel", they book a Western Caribbean sailing that calls
     * there — so the set of sensible answers is short and known. A hotel
     * destination is not: it is any city, district or property on earth, and
     * a picklist of those would be a worse input than a text field.
     */
    destinationOptions?: readonly PicklistGroup[];

    /**
     * Whether to ask how many people are travelling.
     *
     * False for cruises, at the client's request: that form is three fields.
     * Nothing invents a party size to fill the gap — the request goes out
     * saying nothing about it rather than saying two, and our reply asks.
     */
    asksPartySize: boolean;

    /**
     * The second date, or null where the vertical has none to ask for.
     *
     * Cruises are null. A sailing has a fixed length set by the itinerary, so
     * the return date is an output of the booking rather than an input to it.
     * Asking for a "latest return date" made the traveller invent a constraint
     * they did not have, and then quoted around it.
     *
     * Label and message are paired so a vertical cannot end up with a second
     * date field and no way to complain about it.
     */
    end: { label: string; missing: string } | null;

    /**
     * The second *place*, or null where the vertical has only one.
     *
     * Required for charter, because positioning the aircraft to the departure
     * field is often the largest single variable in the quote. Optional for a
     * cruise, where the itinerary usually decides the port — insisting on one
     * would turn an open question into a guess.
     */
    origin: {
      question: string;
      hint: string;
      placeholder: string;
      required: boolean;
      missing: string;
      /** Present for cruises: US homeports are a closed, known list. */
      options?: readonly PicklistGroup[];
    } | null;

    /**
     * A vehicle class, where the vertical has one to ask about.
     *
     * Car rental only. It is not folded into the destination or origin slots
     * because it is not a place, and a quote genuinely cannot be produced
     * without it — the class is the one thing a rental company actually
     * guarantees, and it moves the price more than the dates do.
     */
    vehicle: {
      label: string;
      question: string;
      placeholder: string;
      hint: string;
      missing: string;
      options: readonly PicklistGroup[];
    } | null;

    /** What the traveller receives back. Never promises a held rate. */
    outcome: string;
  }
> = {
  stay: {
    label: "Hotel",
    destinationLabel: "City or area",
    destinationPlaceholder: "City, area or hotel",
    startLabel: "Check-in",
    destinationQuestion: "City or area",
    startQuestion: "Check-in",
    destinationHint:
      "A city, a neighbourhood, or the name of a hotel you have in mind.",
    destinationMissing: "Tell us which city or area you need a room in.",
    startMissing: "Add a check-in date.",
    asksPartySize: true,
    end: { label: "Check-out", missing: "Add a check-out date." },
    vehicle: null,
    origin: null,
    outcome:
      "options showing the nightly rate, the taxes and resort fees the property charges, and our service fee shown separately",
  },
  car: {
    label: "Car rental",
    destinationLabel: "Pick-up location",
    destinationPlaceholder: "Choose a state",
    startLabel: "Pick-up date",
    destinationQuestion: "Where are you picking the car up?",
    startQuestion: "Pick-up date",
    destinationHint:
      "The state you are collecting in. Name the airport or the branch further down if you already know it — an airport counter and a downtown branch on the same day can differ by more than the car does.",
    destinationMissing: "Tell us which state you are collecting in.",
    startMissing: "Add a pick-up date.",
    destinationOptions: usStates,
    asksPartySize: true,
    end: { label: "Drop-off date", missing: "Add a drop-off date." },
    vehicle: {
      label: "Car type",
      question: "What kind of car?",
      placeholder: "Choose a class",
      hint:
        "A class, not a model. The rental company guarantees the category and picks the car within it on the day.",
      missing: "Tell us roughly what size of car you need.",
      options: carTypes,
    },
    origin: null,
    outcome:
      "options showing the rental rate, what the mandatory charges and insurance actually come to, and our service fee shown separately",
  },
  cruise: {
    label: "Cruise",
    destinationLabel: "Where do you want to go?",
    destinationPlaceholder: "Caribbean, Mediterranean, Alaska…",
    startLabel: "Sailing date",
    destinationQuestion: "Where do you want to go?",
    startQuestion: "Sailing date",
    destinationHint:
      "The region you want to sail. Name a specific ship or itinerary further down if you already have one in mind.",
    destinationMissing: "Tell us where you would like to sail.",
    startMissing: "Tell us roughly when you want to sail.",
    destinationOptions: cruiseDestinations,
    asksPartySize: false,
    end: null,
    vehicle: null,
    origin: {
      question: "Where are you sailing from?",
      hint: "US homeports — the places a voyage actually begins. Pick no preference and we will tell you which ports serve the itinerary.",
      placeholder: "Choose a departure port",
      required: true,
      missing: "Tell us which port you would like to sail from.",
      options: usCruisePorts,
    },
    outcome:
      "options showing the cabin fare, port charges and government taxes, gratuities, and our service fee shown separately",
  },
  vacation: {
    label: "Vacation package",
    destinationLabel: "Where to",
    destinationPlaceholder: "City, island or region",
    startLabel: "Depart",
    destinationQuestion: "Where do you want to go?",
    startQuestion: "Depart",
    destinationHint:
      "A city, an island or a region — you do not have to have chosen the property. If you are deciding between two places, name both and we will price them side by side.",
    destinationMissing: "Tell us where you want to go.",
    startMissing: "Add a departure date.",
    asksPartySize: true,
    end: { label: "Return", missing: "Add a return date." },
    vehicle: null,
    origin: {
      question: "Where are you flying from?",
      hint: "The airport or city you would start from. It moves the flight half of a package more than any other answer, so a nearby second airport is worth mentioning.",
      placeholder: "City or airport",
      required: true,
      missing: "Tell us which airport you would be flying from.",
    },
    outcome:
      "options showing the flights, the accommodation, the board basis and any transfers priced as separate lines, plus our service fee — so you can see what each part of the package costs rather than one number",
  },
  jet: {
    label: "Private jet",
    destinationLabel: "Arriving at",
    destinationPlaceholder: "Airport or city",
    startLabel: "Departure date",
    destinationQuestion: "Arriving at",
    startQuestion: "Departure date",
    destinationHint:
      "An airport if you know it, otherwise the city — we will find the closest field that suits the aircraft.",
    destinationMissing: "Tell us where the flight is going.",
    startMissing: "Add a departure date.",
    asksPartySize: true,
    end: { label: "Return date", missing: "Add a return date." },
    vehicle: null,
    origin: {
      question: "Departing from",
      hint: "An airport if you know it, otherwise the city.",
      placeholder: "Airport or city",
      required: true,
      missing: "Tell us where the flight departs from.",
    },
    outcome:
      "options naming the operator, the aircraft type and the all-in charter price, with positioning, crew, landing and handling already in it and our service fee shown separately",
  },
};

export function validateEnquiry(input: Partial<Enquiry>): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const vertical = input.vertical;

  if (!vertical || !(vertical in verticalCopy)) {
    errors.vertical = "Unknown enquiry type.";
    return errors;
  }

  const copy = verticalCopy[vertical];

  if (!input.destination?.trim()) {
    errors.destination = copy.destinationMissing;
  }

  if (copy.origin?.required && !input.origin?.trim()) {
    errors.origin = copy.origin.missing;
  }

  if (!input.startDate || !isIsoDate(input.startDate)) {
    errors.startDate = copy.startMissing;
  }

  /*
    A one-way charter has no return date to give, and demanding one is how a
    traveller ends up inventing a date that then gets quoted. A cruise has no
    second date at all — see `end` in verticalCopy.
  */
  const needsEndDate =
    copy.end !== null &&
    !(vertical === "jet" && input.jetTripType === "one-way");

  if (copy.end && needsEndDate) {
    if (!input.endDate || !isIsoDate(input.endDate)) {
      errors.endDate = copy.end.missing;
    } else if (input.startDate && input.endDate < input.startDate) {
      errors.endDate = `The ${copy.end.label.toLowerCase()} cannot be before the ${copy.startLabel.toLowerCase()}.`;
    }
  }

  // Verticals that do not ask cannot fail on it — see `asksPartySize`.
  if (copy.asksPartySize && (!input.adults || input.adults < 1)) {
    errors.adults = "At least one adult must travel.";
  }

  if (copy.vehicle && !input.carType?.trim()) {
    errors.carType = copy.vehicle.missing;
  }

  if (vertical === "stay" && (!input.rooms || input.rooms < 1)) {
    errors.rooms = "At least one room is needed.";
  }

  if (vertical === "car") {
    const age = input.driverAge;
    if (age === undefined || Number.isNaN(age)) {
      errors.driverAge = "Rental rates depend on the driver's age.";
    } else if (age < MIN_DRIVER_AGE || age > MAX_DRIVER_AGE) {
      errors.driverAge = `Enter an age between ${MIN_DRIVER_AGE} and ${MAX_DRIVER_AGE}.`;
    }
  }

  if (!input.fullName?.trim()) {
    errors.fullName = "Tell us who the booking is for.";
  }

  if (!input.email?.trim()) {
    errors.email = "We need an email address to send the quote to.";
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "That email address does not look right.";
  }

  if (!input.termsAccepted) {
    errors.termsAccepted =
      "Please confirm you have read the terms and privacy policy.";
  }

  return errors;
}

export function hasErrors(errors: EnquiryErrors): boolean {
  return Object.keys(errors).length > 0;
}
