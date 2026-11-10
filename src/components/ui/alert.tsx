import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Tone = "info" | "success" | "warning" | "error";

const toneClasses: Record<Tone, string> = {
  info: "bg-primary-softer text-gray-800",
  success: "bg-success-soft text-gray-800",
  warning: "bg-warning-soft text-gray-800",
  error: "bg-error-soft text-gray-800",
};

/** The rule down the left edge, which is what makes the tone readable at a
    glance without saturating the whole panel. */
const railClasses: Record<Tone, string> = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

const iconClasses: Record<Tone, string> = {
  info: "text-primary",
  success: "text-success",
  warning: "text-accent-hover",
  error: "text-error",
};

/**
 * Every tone carries a text label as well as its colour — colour alone must
 * never be the only thing distinguishing a warning from a confirmation.
 */
const toneLabels: Record<Tone, string> = {
  info: "Note",
  success: "Confirmed",
  warning: "Important",
  error: "Problem",
};

const icons: Record<Tone, ReactNode> = {
  info: <path d="M10 9v5m0-8.5v.01M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />,
  success: <path d="m6 10.5 2.8 2.8L14.5 7.5M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />,
  warning: <path d="M10 7v4m0 3.5v.01M8.6 2.9 1.9 15a1.6 1.6 0 0 0 1.4 2.4h13.4a1.6 1.6 0 0 0 1.4-2.4L11.4 2.9a1.6 1.6 0 0 0-2.8 0Z" />,
  error: <path d="M7.5 7.5l5 5m0-5-5 5M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />,
};

export function Alert({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: Tone;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg py-4 pl-5 pr-4",
        toneClasses[tone],
        className,
      )}
      role={tone === "error" ? "alert" : undefined}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1", railClasses[tone])}
      />
      <div className="flex gap-3">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])}
        >
          {icons[tone]}
        </svg>
        <div className="min-w-0">
          <p className="text-h6 text-text">{title ?? toneLabels[tone]}</p>
          <div className="mt-1 text-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
