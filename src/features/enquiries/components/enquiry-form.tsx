"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useId, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConsentFields } from "@/components/ui/consent-fields";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  hasErrors,
  validateEnquiry,
  verticalCopy,
} from "@/features/enquiries/lib/enquiry";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import {
  filterPicklist,
  picklistOptions,
} from "@/features/enquiries/lib/picklist";
import { parseEnquirySeed } from "@/features/enquiries/lib/enquiry-link";
import type {
  Enquiry,
  EnquiryErrors,
  EnquiryVertical,
} from "@/features/enquiries/types";

type Status = "idle" | "submitting" | "sent" | "failed";

/**
 * Quote request form for hotels, car rental and cruises.
 *
 * One component for all three: the fields that differ are genuinely few, and
 * the alternative — three files that start identical and drift — is how a
 * consent checkbox ends up correct on two forms and pre-checked on the third.
 * The wording that differs per vertical comes from `verticalCopy`, not from
 * branching JSX scattered through the tree.
 *
 * Two consent controls, kept separate and both unchecked by default: accepting
 * the terms is a condition of submitting, marketing is genuinely optional.
 * Bundling them into one checkbox would make the marketing consent invalid.
 */
interface EnquiryFormProps {
  vertical: EnquiryVertical;
  /** Private jets only. Ignored by the other verticals. */
  aircraftCategories?: ReadonlyArray<{
    slug: string;
    name: string;
    seats: string;
  }>;
  initial?: Partial<Enquiry>;
}

/**
 * The boundary belongs here rather than at each of the six call sites.
 *
 * Reading the query string forces the subtree below a Suspense boundary to be
 * client-rendered during prerender. Owning that boundary in this file means a
 * page cannot forget it and fail the build, and the pages themselves stay
 * static.
 */
export function EnquiryForm(props: EnquiryFormProps) {
  return (
    <Suspense
      fallback={
        <div
          className="skeleton h-96 rounded-xl"
          aria-hidden="true"
        />
      }
    >
      <EnquiryFormFields {...props} />
    </Suspense>
  );
}

function EnquiryFormFields({
  vertical,
  aircraftCategories,
  initial,
}: EnquiryFormProps) {
  const id = useId();
  const copy = verticalCopy[vertical];
  // Reading the query string client-side keeps the page itself prerendered;
  // the caller supplies the Suspense boundary this requires.
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  // A traveller who started the request on the home page arrives with the trip
  // already in the URL. Seeding initial state from it means the fields are
  // filled on first paint rather than snapping into place a moment later.
  const [form, setForm] = useState<Partial<Enquiry>>(() => ({
    vertical,
    /*
      No default party size on a form that never asks for one. Sending two
      adults because that is the usual answer would put a number in the
      request that the traveller never gave us.
    */
    ...(copy.asksPartySize ? { adults: 2, children: 0 } : {}),
    ...(vertical === "stay" ? { rooms: 1 } : {}),
    marketingOptIn: false,
    termsAccepted: false,
    ...initial,
    ...parseEnquirySeed(searchParams.toString()),
  }));

  const set = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  /** Jets default to a return; only an explicit one-way drops the end date. */
  const oneWayCharter = vertical === "jet" && form.jetTripType === "one-way";

  /*
    Picklist fields, where the vertical declares them. One open-state across
    both, so opening one closes the other.
  */
  const originOptions: ComboboxOption[] = copy.origin?.options
    ? picklistOptions(copy.origin.options)
    : [];
  const vehicleOptions: ComboboxOption[] = copy.vehicle
    ? picklistOptions(copy.vehicle.options)
    : [];
  const destinationOptions: ComboboxOption[] = copy.destinationOptions
    ? picklistOptions(copy.destinationOptions)
    : [];
  const [openField, setOpenField] = useState<
    "origin" | "destination" | "vehicle" | null
  >(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(-1);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateEnquiry(form);
    setErrors(found);

    if (hasErrors(found)) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("submitting");
    setFailureMessage(null);

    try {
      const response = await fetch("/api/enquiry", {
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
          Thank you. We have your {copy.label.toLowerCase()} request and an
          agent will get back to you with {copy.outcome}.
        </p>
        <p className="mt-2">
          This is a request for a quote, not a confirmed booking. Nothing is
          reserved and nothing has been charged. Rates and availability can
          change before a booking is confirmed.
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
        <legend className="mb-4 w-full border-b border-border pb-3 text-h4 text-text">
          Your {copy.label.toLowerCase()}
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          {/*
            Charter and cruise are the two verticals with a second place in
            the request, and they need it for different reasons — see
            `origin` in verticalCopy. A hotel or a hire car has exactly one
            place in it and nothing to ask here.
          */}
          {copy.origin && (
            <Field
              htmlFor={`${id}-origin`}
              label={copy.origin.question}
              required={copy.origin.required}
              hint={copy.origin.hint}
              error={errors.origin}
            >
              {copy.origin.options ? (
                <Combobox
                  variant="field"
                  id={`${id}-origin`}
                  listboxId={`${id}-origin-list`}
                  value={form.origin ?? ""}
                  onValueChange={(value) => set("origin", value)}
                  onSelect={(option) => {
                    set("origin", option.label);
                    setOpenField(null);
                    setActiveIndex(-1);
                  }}
                  options={filterPicklist(originOptions, form.origin ?? "")}
                  open={openField === "origin"}
                  onOpenChange={(next) =>
                    setOpenField(next ? "origin" : null)
                  }
                  activeIndex={openField === "origin" ? activeIndex : -1}
                  onActiveIndexChange={setActiveIndex}
                  placeholder={copy.origin.placeholder}
                  invalid={Boolean(errors.origin)}
                  emptyState={
                    <p className="text-body-sm text-text">
                      No port matches “{(form.origin ?? "").trim()}”.
                    </p>
                  }
                />
              ) : (
                <Input
                  id={`${id}-origin`}
                  placeholder={copy.origin.placeholder}
                  value={form.origin ?? ""}
                  onChange={(event) => set("origin", event.target.value)}
                  invalid={Boolean(errors.origin)}
                />
              )}
            </Field>
          )}

          <Field
            htmlFor={`${id}-destination`}
            label={copy.destinationQuestion}
            required
            hint={copy.destinationHint}
            error={errors.destination}
            className={copy.origin ? undefined : "sm:col-span-2"}
          >
            {copy.destinationOptions ? (
              <Combobox
                variant="field"
                id={`${id}-destination`}
                listboxId={`${id}-destination-list`}
                value={form.destination ?? ""}
                onValueChange={(value) => set("destination", value)}
                onSelect={(option) => {
                  set("destination", option.label);
                  setOpenField(null);
                  setActiveIndex(-1);
                }}
                options={filterPicklist(
                  destinationOptions,
                  form.destination ?? "",
                )}
                open={openField === "destination"}
                onOpenChange={(next) =>
                  setOpenField(next ? "destination" : null)
                }
                activeIndex={openField === "destination" ? activeIndex : -1}
                onActiveIndexChange={setActiveIndex}
                placeholder={copy.destinationPlaceholder}
                invalid={Boolean(errors.destination)}
                emptyState={
                  <p className="text-body-sm text-text">
                    No region matches “{(form.destination ?? "").trim()}”.
                  </p>
                }
              />
            ) : (
              <Input
                id={`${id}-destination`}
                placeholder={copy.destinationPlaceholder}
                value={form.destination ?? ""}
                onChange={(event) => set("destination", event.target.value)}
                invalid={Boolean(errors.destination)}
              />
            )}
          </Field>

          {vertical === "jet" && (
            <>
              <Field
                htmlFor={`${id}-jetTripType`}
                label="Trip"
                hint="A one-way charter is not half a return — the aircraft still has to get on to its next job."
                className="sm:col-span-2"
              >
                <Select
                  id={`${id}-jetTripType`}
                  value={form.jetTripType ?? "return"}
                  onChange={(event) =>
                    set(
                      "jetTripType",
                      event.target.value as "one-way" | "return",
                    )
                  }
                >
                  <option value="return">Return</option>
                  <option value="one-way">One way</option>
                </Select>
              </Field>

              {aircraftCategories && aircraftCategories.length > 0 && (
                <Field
                  htmlFor={`${id}-aircraftCategorySlug`}
                  label="Cabin size"
                  hint="Optional. Tell us the baggage and we will size it — bags force the category more often than seats do."
                  className="sm:col-span-2"
                >
                  <Select
                    id={`${id}-aircraftCategorySlug`}
                    value={form.aircraftCategorySlug ?? ""}
                    onChange={(event) =>
                      set("aircraftCategorySlug", event.target.value)
                    }
                  >
                    <option value="">Recommend one for me</option>
                    {aircraftCategories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name} — {category.seats} seats
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
            </>
          )}

          {vertical === "car" && (
            <Field
              htmlFor={`${id}-dropOffLocation`}
              label="Drop-off location"
              hint="Leave blank to return the car where you collected it."
              className="sm:col-span-2"
            >
              <Input
                id={`${id}-dropOffLocation`}
                value={form.dropOffLocation ?? ""}
                onChange={(event) => set("dropOffLocation", event.target.value)}
              />
            </Field>
          )}


          <Field
            htmlFor={`${id}-startDate`}
            label={copy.startQuestion}
            required
            error={errors.startDate}
          >
            <Input
              id={`${id}-startDate`}
              type="date"
              value={form.startDate ?? ""}
              onChange={(event) => set("startDate", event.target.value)}
              invalid={Boolean(errors.startDate)}
            />
          </Field>

          {/*
            Verticals with no second date omit the field entirely; a one-way
            charter disables it instead.

            The difference is that a charter can gain a return date by
            toggling the trip type above, and a field that appears and
            disappears as you do that reflows the grid under the cursor. A
            cruise can never gain one, so leaving a disabled box there would
            just be a dead control. `validateEnquiry` drops the requirement
            in both cases on the server.
          */}
          {copy.end && (
            <Field
              htmlFor={`${id}-endDate`}
              label={copy.end.label}
              required={!oneWayCharter}
              hint={
                oneWayCharter ? "Not needed for a one-way charter." : undefined
              }
              error={errors.endDate}
            >
              <Input
                id={`${id}-endDate`}
                type="date"
                min={form.startDate}
                value={oneWayCharter ? "" : (form.endDate ?? "")}
                onChange={(event) => set("endDate", event.target.value)}
                disabled={oneWayCharter}
                invalid={Boolean(errors.endDate)}
              />
            </Field>
          )}

          {/*
            The vehicle class. Sits before the party size because it is the
            answer that shapes the quote — a rental company guarantees the
            class and nothing else about the car.
          */}
          {copy.vehicle && (
            <Field
              htmlFor={`${id}-carType`}
              label={copy.vehicle.question}
              required
              hint={copy.vehicle.hint}
              error={errors.carType}
              className="sm:col-span-2"
            >
              <Combobox
                variant="field"
                id={`${id}-carType`}
                listboxId={`${id}-carType-list`}
                value={form.carType ?? ""}
                onValueChange={(value) => set("carType", value)}
                onSelect={(option) => {
                  set("carType", option.label);
                  setOpenField(null);
                  setActiveIndex(-1);
                }}
                options={filterPicklist(vehicleOptions, form.carType ?? "")}
                open={openField === "vehicle"}
                onOpenChange={(next) => setOpenField(next ? "vehicle" : null)}
                activeIndex={openField === "vehicle" ? activeIndex : -1}
                onActiveIndexChange={setActiveIndex}
                placeholder={copy.vehicle.placeholder}
                invalid={Boolean(errors.carType)}
                emptyState={
                  <p className="text-body-sm text-text">
                    No class matches “{(form.carType ?? "").trim()}”.
                  </p>
                }
              />
            </Field>
          )}

          {copy.asksPartySize && (
            <>
              <Field
                htmlFor={`${id}-adults`}
                label={vertical === "jet" ? "Passengers" : "Adults"}
                required
                error={errors.adults}
              >
                <Select
                  id={`${id}-adults`}
                  value={form.adults ?? 2}
                  onChange={(event) => set("adults", Number(event.target.value))}
                  invalid={Boolean(errors.adults)}
                >
                  {/*
                    Charter goes to nineteen; the other verticals stop at nine.
                    A twelve-seat jet is an ordinary request here and a
                    twelve-adult hotel room is not.
                  */}
                  {Array.from(
                    { length: vertical === "jet" ? 19 : 9 },
                    (_, index) => index + 1,
                  ).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field htmlFor={`${id}-children`} label="Children">
                <Select
                  id={`${id}-children`}
                  value={form.children ?? 0}
                  onChange={(event) =>
                    set("children", Number(event.target.value))
                  }
                >
                  {Array.from({ length: 9 }, (_, index) => index).map(
                    (count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ),
                  )}
                </Select>
              </Field>
            </>
          )}

          {vertical === "stay" && (
            <Field
              htmlFor={`${id}-rooms`}
              label="Rooms"
              required
              error={errors.rooms}
            >
              <Select
                id={`${id}-rooms`}
                value={form.rooms ?? 1}
                onChange={(event) => set("rooms", Number(event.target.value))}
                invalid={Boolean(errors.rooms)}
              >
                {Array.from({ length: 6 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          {vertical === "car" && (
            <Field
              htmlFor={`${id}-driverAge`}
              label="Driver's age"
              required
              hint="Rental companies price by age, and most surcharge drivers under 25."
              error={errors.driverAge}
            >
              <Input
                id={`${id}-driverAge`}
                type="number"
                inputMode="numeric"
                min={18}
                max={99}
                value={form.driverAge ?? ""}
                onChange={(event) =>
                  set("driverAge", Number(event.target.value))
                }
                invalid={Boolean(errors.driverAge)}
              />
            </Field>
          )}
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
            hint="Budget, accessibility needs, must-haves, flexibility on dates."
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

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={status === "submitting"}
        >
          Request a quote
        </Button>
        <p className="text-center text-caption text-text-muted">
          Sending this does not book or hold anything, and nothing is charged.
        </p>
      </div>
    </form>
  );
}
