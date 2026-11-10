import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface FieldProps {
  /** Must match the control's id — a visible label, never placeholder-only. */
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + hint/error, wired for screen readers.
 *
 * The error sits directly below the control it belongs to and is announced via
 * role="alert"; a summary at the top of the form is not a substitute.
 *
 * The optional/required convention is inverted from the usual one: a red
 * asterisk on nine of ten fields is decoration, so the marker is only drawn
 * where it distinguishes something. `required` still sets the assistive text
 * either way.
 */
export function Field({
  htmlFor,
  label,
  required = false,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-1.5 text-h6 text-text"
      >
        {label}
        {required ? (
          <>
            <span className="text-error" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="text-caption font-normal text-text-muted">
            optional
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-caption text-text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-caption font-medium text-error"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 size-3.5 shrink-0"
          >
            <path d="M8 5v3.5m0 2.5v.01M8 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
