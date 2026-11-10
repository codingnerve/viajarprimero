"use client";

import { useEffect } from "react";

import { Section } from "@/components/layout/section";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Root error boundary.
 *
 * Says what did and did not happen. On a booking site the traveller's real
 * question after an error is "did that go through?", so the answer is stated
 * outright rather than left to be inferred from a generic apology — and it is
 * given the same weight as the heading, not tucked into small print.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error", error);
  }, [error]);

  return (
    <Section size="lg">
      <div className="measure">
        <p className="text-overline uppercase text-error">
          Something went wrong
        </p>
        <h1 className="mt-4 text-balance text-display text-text md:text-display-lg">
          We could not load that
        </h1>
        <p className="mt-5 text-body-lg text-text-secondary">
          This is a fault at our end, not something you did.
        </p>

        <div className="mt-8 rounded-2xl bg-success-soft p-6">
          <p className="text-h5 text-text">Nothing has been charged</p>
          <p className="mt-1.5 text-body-sm text-gray-700">
            No booking was made and no payment was taken. If you were part-way
            through a request, it was not submitted — you will need to send it
            again.
          </p>
        </div>

        {error.digest && (
          <p className="mt-6 text-caption text-text-muted">
            Reference:{" "}
            <code className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-text-secondary">
              {error.digest}
            </code>
            {" — quote this if you contact us."}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">
            Back to the home page
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
