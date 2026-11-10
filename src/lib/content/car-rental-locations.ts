import { vehicleClasses } from "@/lib/content/car-hire";
import type { PicklistGroup } from "@/types/picklist";

/**
 * Pick-up states and vehicle classes for the car-rental quote form.
 *
 * Hardcoded, like the cruise picklists and for the same reason: no rental
 * supplier is connected to this site, and a list of places somebody can *ask*
 * about asserts nothing about availability. What it must not do is imply we
 * hold fleet anywhere, so the form asks where you want to collect and a person
 * answers.
 */

export const NO_VEHICLE_PREFERENCE = "No preference — recommend one";

/**
 * All fifty states plus the District of Columbia, grouped by Census region.
 *
 * A state rather than a specific desk. The desk is a decision for the quote —
 * an airport counter and a downtown branch on the same day can differ by more
 * than the car does, and asking somebody to name a branch before they have
 * been told that is asking them to guess. Narrow it in the notes.
 */
export const usStates: readonly PicklistGroup[] = [
  {
    label: "Northeast",
    options: [
      "Connecticut",
      "Maine",
      "Massachusetts",
      "New Hampshire",
      "New Jersey",
      "New York",
      "Pennsylvania",
      "Rhode Island",
      "Vermont",
    ],
  },
  {
    label: "Midwest",
    options: [
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Michigan",
      "Minnesota",
      "Missouri",
      "Nebraska",
      "North Dakota",
      "Ohio",
      "South Dakota",
      "Wisconsin",
    ],
  },
  {
    label: "South",
    options: [
      "Alabama",
      "Arkansas",
      "Delaware",
      "District of Columbia",
      "Florida",
      "Georgia",
      "Kentucky",
      "Louisiana",
      "Maryland",
      "Mississippi",
      "North Carolina",
      "Oklahoma",
      "South Carolina",
      "Tennessee",
      "Texas",
      "Virginia",
      "West Virginia",
    ],
  },
  {
    label: "West",
    options: [
      "Alaska",
      "Arizona",
      "California",
      "Colorado",
      "Hawaii",
      "Idaho",
      "Montana",
      "Nevada",
      "New Mexico",
      "Oregon",
      "Utah",
      "Washington",
      "Wyoming",
    ],
  },
];

/**
 * Vehicle classes, derived from the same list the page explains in its table.
 *
 * Derived rather than retyped on purpose. A picklist offering a class the
 * table does not describe — or a table describing one the form will not let
 * you ask for — is the kind of drift that happens within a month of two lists
 * existing, and here it would mean quoting somebody a category we have
 * published nothing about.
 */
export const carTypes: readonly PicklistGroup[] = [
  {
    label: "Open to suggestions",
    options: [NO_VEHICLE_PREFERENCE],
  },
  {
    label: "Vehicle class",
    options: vehicleClasses.map((vehicle) => vehicle.name),
  },
];
