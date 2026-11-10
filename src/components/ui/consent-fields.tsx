import Link from "next/link";

import { Checkbox } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

/**
 * The two consent controls every quote request carries.
 *
 * It sat duplicated byte-for-byte in `features/booking` and
 * `features/enquiries`. The enquiry form's own header comment already names
 * the risk — "three files that start identical and drift" is how a consent
 * checkbox ends up correct on two forms and pre-checked on the third — and
 * that argument applies with more force across two features than within one.
 * A second consumer appeared, so it moved out, per the project guide.
 *
 * Two controls, kept separate and both unchecked by default: accepting the
 * terms is a condition of submitting, marketing is genuinely optional.
 * Bundling them into one checkbox would make the marketing consent invalid.
 * Neither may ever be given a `defaultChecked`.
 */
export function ConsentFields({
  idPrefix,
  termsAccepted,
  onTermsChange,
  marketingOptIn,
  onMarketingChange,
  error,
  className,
}: {
  /** The form's `useId`, so the ids are unique when two forms share a page. */
  idPrefix: string;
  termsAccepted: boolean;
  onTermsChange: (value: boolean) => void;
  marketingOptIn: boolean;
  onMarketingChange: (value: boolean) => void;
  /** Validation message for the terms checkbox. */
  error?: string;
  className?: string;
}) {
  const termsId = `${idPrefix}-termsAccepted`;

  return (
    <div
      className={cn(
        "space-y-4 rounded-xl bg-surface-2 p-5 ring-1 ring-inset ring-border",
        error && "ring-error",
        className,
      )}
    >
      <div>
        <label
          htmlFor={termsId}
          className="flex cursor-pointer items-start gap-3 text-body-sm text-gray-700"
        >
          <Checkbox
            id={termsId}
            checked={termsAccepted}
            onChange={(event) => onTermsChange(event.target.checked)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${termsId}-error` : undefined}
          />
          <span>
            I have read the{" "}
            <Link
              href="/terms-and-conditions"
              className="font-medium text-primary underline underline-offset-2"
            >
              terms and conditions
            </Link>{" "}
            and the{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-primary underline underline-offset-2"
            >
              privacy policy
            </Link>
            . <span className="text-error">*</span>
          </span>
        </label>

        {error && (
          <p
            id={`${termsId}-error`}
            role="alert"
            className="mt-2 pl-8 text-caption font-medium text-error"
          >
            {error}
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4 text-body-sm text-gray-700">
        <Checkbox
          checked={marketingOptIn}
          onChange={(event) => onMarketingChange(event.target.checked)}
        />
        <span>
          Email me occasional travel deals. Optional, and you can unsubscribe
          from any email.
        </span>
      </label>
    </div>
  );
}
