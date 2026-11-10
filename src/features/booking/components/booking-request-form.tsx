"use client";

import { useId, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConsentFields } from "@/components/ui/consent-fields";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  hasErrors,
  validateBookingRequest,
  type BookingRequest,
  type BookingRequestErrors,
} from "@/features/booking/lib/booking-request";
import { CABIN_LABELS } from "@/types/flight";
import type { Airport, CabinClass, TripType } from "@/types/flight";

type Status = "idle" | "submitting" | "sent" | "failed";

/**
 * Quote request form.
 *
 * Two consent controls, kept separate and both unchecked by default: accepting
 * the terms is a condition of submitting, marketing is genuinely optional.
 * Bundling them into one checkbox would make the marketing consent invalid.
 */
export function BookingRequestForm({
  airports,
  initial,
}: {
  airports: readonly Airport[];
  initial?: Partial<BookingRequest>;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<BookingRequestErrors>({});
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<BookingRequest>>({
    tripType: "round-trip",
    adults: 1,
    children: 0,
    cabin: "economy",
    marketingOptIn: false,
    termsAccepted: false,
    ...initial,
  });

  const set = <K extends keyof BookingRequest>(
    key: K,
    value: BookingRequest[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateBookingRequest(form);
    setErrors(found);

    if (hasErrors(found)) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("submitting");
    setFailureMessage(null);

    try {
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(body?.message ?? "The request could not be sent.");
      }

      setStatus("sent");
    } catch (error) {
      // Surface the failure rather than leaving the traveller believing a
      // request was submitted that never arrived.
      setStatus("failed");
      setFailureMessage(
        error instanceof Error ? error.message : "The request could not be sent.",
      );
    }
  };

  if (status === "sent") {
    return (
      <Alert tone="success" title="Request received">
        <p>
          Thank you. We have your request and will email a quote to{" "}
          <strong>{form.email}</strong>.
        </p>
        <p className="mt-2">
          This is a request for a quote, not a confirmed booking. No seat is
          held and nothing has been charged. Fares and availability can change
          before a ticket is issued.
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {status === "failed" && failureMessage && (
        <Alert tone="error" title="We could not send that">
          <p>{failureMessage}</p>
          <p className="mt-2">
            Please try again, or contact us directly and we will pick it up
            from there.
          </p>
        </Alert>
      )}

      <fieldset className="space-y-4">
        <legend className="mb-4 w-full border-b border-border pb-3 text-h4 text-text">Your trip</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor={`${id}-tripType`} label="Trip type">
            <Select
              id={`${id}-tripType`}
              value={form.tripType}
              onChange={(event) =>
                set("tripType", event.target.value as TripType)
              }
            >
              <option value="round-trip">Round trip</option>
              <option value="one-way">One way</option>
            </Select>
          </Field>

          <Field htmlFor={`${id}-cabin`} label="Cabin">
            <Select
              id={`${id}-cabin`}
              value={form.cabin}
              onChange={(event) =>
                set("cabin", event.target.value as CabinClass)
              }
            >
              {(Object.keys(CABIN_LABELS) as CabinClass[]).map((value) => (
                <option key={value} value={value}>
                  {CABIN_LABELS[value]}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            htmlFor={`${id}-origin`}
            label="From"
            required
            error={errors.origin}
          >
            <Select
              id={`${id}-origin`}
              value={form.origin ?? ""}
              onChange={(event) => set("origin", event.target.value)}
              invalid={Boolean(errors.origin)}
            >
              <option value="">Select an airport</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </Select>
          </Field>

          <Field
            htmlFor={`${id}-destination`}
            label="To"
            required
            error={errors.destination}
          >
            <Select
              id={`${id}-destination`}
              value={form.destination ?? ""}
              onChange={(event) => set("destination", event.target.value)}
              invalid={Boolean(errors.destination)}
            >
              <option value="">Select an airport</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </Select>
          </Field>

          <Field
            htmlFor={`${id}-departDate`}
            label="Departure date"
            required
            error={errors.departDate}
          >
            <Input
              id={`${id}-departDate`}
              type="date"
              value={form.departDate ?? ""}
              onChange={(event) => set("departDate", event.target.value)}
              invalid={Boolean(errors.departDate)}
            />
          </Field>

          <Field
            htmlFor={`${id}-returnDate`}
            label="Return date"
            required={form.tripType === "round-trip"}
            error={errors.returnDate}
          >
            <Input
              id={`${id}-returnDate`}
              type="date"
              min={form.departDate}
              value={form.returnDate ?? ""}
              onChange={(event) => set("returnDate", event.target.value)}
              disabled={form.tripType !== "round-trip"}
              invalid={Boolean(errors.returnDate)}
            />
          </Field>

          <Field
            htmlFor={`${id}-adults`}
            label="Adults"
            required
            error={errors.adults}
          >
            <Select
              id={`${id}-adults`}
              value={form.adults ?? 1}
              onChange={(event) => set("adults", Number(event.target.value))}
              invalid={Boolean(errors.adults)}
            >
              {Array.from({ length: 9 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor={`${id}-children`} label="Children (2–11)">
            <Select
              id={`${id}-children`}
              value={form.children ?? 0}
              onChange={(event) => set("children", Number(event.target.value))}
            >
              {Array.from({ length: 9 }, (_, index) => index).map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 w-full border-b border-border pb-3 text-h4 text-text">How to reach you</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            htmlFor={`${id}-fullName`}
            label="Full name"
            required
            error={errors.fullName}
            hint="As printed on the passport or ID you will travel with."
          >
            <Input
              id={`${id}-fullName`}
              value={form.fullName ?? ""}
              onChange={(event) => set("fullName", event.target.value)}
              autoComplete="name"
              invalid={Boolean(errors.fullName)}
            />
          </Field>

          <Field
            htmlFor={`${id}-email`}
            label="Email"
            required
            error={errors.email}
          >
            <Input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              value={form.email ?? ""}
              onChange={(event) => set("email", event.target.value)}
              autoComplete="email"
              invalid={Boolean(errors.email)}
            />
          </Field>

          <Field
            htmlFor={`${id}-phone`}
            label="Phone"
            hint="Optional. Only used if we need to clarify the request."
            className="sm:col-span-2"
          >
            <Input
              id={`${id}-phone`}
              type="tel"
              inputMode="tel"
              value={form.phone ?? ""}
              onChange={(event) => set("phone", event.target.value)}
              autoComplete="tel"
            />
          </Field>

          <Field
            htmlFor={`${id}-notes`}
            label="Anything else we should know?"
            hint="Flexible dates, preferred airlines, accessibility needs, baggage."
            className="sm:col-span-2"
          >
            <Textarea
              id={`${id}-notes`}
              value={form.notes ?? ""}
              onChange={(event) => set("notes", event.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <ConsentFields
        idPrefix={id}
        termsAccepted={form.termsAccepted ?? false}
        onTermsChange={(value) => set("termsAccepted", value)}
        marketingOptIn={form.marketingOptIn ?? false}
        onMarketingChange={(value) => set("marketingOptIn", value)}
        error={errors.termsAccepted}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request a quote"}
        </Button>
        <p className="text-caption text-text-secondary">
          Sending this does not book or hold anything, and nothing is charged.
        </p>
      </div>
    </form>
  );
}
