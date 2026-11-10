export type TripKind =
  | "flight"
  | "hotel"
  | "car"
  | "cruise"
  | "private-jet"
  | "vacation"
  | "other";

/** A booking shown on /my-trips. */
export interface Trip {
  id: string;
  reference: string;
  kind: TripKind;
  title: string;
  /** ISO dates. */
  startDate: string | null;
  endDate: string | null;
  status: string;
  /** Major units, e.g. 1249.5. */
  total: number | null;
  currency: string;
  notes: string | null;
}

export interface AccountUser {
  id: string;
  email: string;
  name: string | null;
}
