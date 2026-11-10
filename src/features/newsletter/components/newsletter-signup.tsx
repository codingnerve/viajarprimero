"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/types/locale";

const copyByLocale = {
  en: {
    tick: "Please tick the box to confirm you want these emails.",
    failed: "Sign-up failed.",
    sent: "Thanks — you are on the list. Every email has an unsubscribe link.",
    email: "Email address",
    placeholder: "you@example.com",
    submit: "Sign up",
    consent:
      "Send me route news and fare alerts by email. You can unsubscribe from any email, and we handle your details as described in our",
    privacy: "privacy policy",
  },
  es: {
    tick: "Marque la casilla para confirmar que desea recibir estos correos.",
    failed: "No se pudo completar la suscripción.",
    sent: "Gracias: ya está en la lista. Cada correo incluye un enlace para darse de baja.",
    email: "Correo electrónico",
    placeholder: "usted@ejemplo.com",
    submit: "Suscribirse",
    consent:
      "Envíenme noticias de rutas y alertas de tarifas por correo electrónico. Puede darse de baja desde cualquier correo, y trataremos sus datos como se describe en nuestra",
    privacy: "política de privacidad",
  },
} as const;

type Status = "idle" | "submitting" | "sent" | "failed";

/**
 * Newsletter sign-up.
 *
 * Consent is a separate, unchecked box rather than an implied consequence of
 * typing an email address, and the copy says what will actually be sent. The
 * failure state is shown rather than swallowed — see the route handler, which
 * refuses instead of silently discarding an address.
 *
 * `tone="inverse"` is for the navy band it closes the home page on, where the
 * default greys are unreadable. The control itself stays white in both: an
 * input drawn as a translucent panel on a dark field is where "premium" turns
 * into "cannot tell whether I have typed anything".
 */
export function NewsletterSignup({
  tone = "default",
  className,
  locale = "en",
}: {
  tone?: "default" | "inverse";
  className?: string;
  locale?: Locale;
}) {
  const copy = copyByLocale[locale];
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const inverse = tone === "inverse";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!consent) {
      setStatus("failed");
      setMessage(copy.tick);
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      const body = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(body?.message ?? copy.failed);
      }

      setStatus("sent");
    } catch (error) {
      setStatus("failed");
      setMessage(error instanceof Error ? error.message : copy.failed);
    }
  };

  if (status === "sent") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-3 text-body-lg",
          inverse ? "text-text-inverse" : "text-text",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-text-inverse"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="m4 10.5 4 4 8-9" />
          </svg>
        </span>
        {copy.sent}
      </p>
    );
  }

  const failed = status === "failed";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("w-full lg:max-w-md", className)}
    >
      <label
        htmlFor={`${id}-email`}
        className={cn(
          "block text-h6",
          inverse ? "text-text-inverse" : "text-text",
        )}
      >
        {copy.email}
      </label>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          invalid={failed}
          aria-describedby={failed ? `${id}-error` : undefined}
        />
        <Button
          type="submit"
          loading={status === "submitting"}
          className="sm:shrink-0"
        >
          {copy.submit}
        </Button>
      </div>

      {failed && message && (
        <p
          id={`${id}-error`}
          role="alert"
          className={cn(
            "mt-2 text-caption font-medium",
            inverse ? "text-warning" : "text-error",
          )}
        >
          {message}
        </p>
      )}

      <label
        className={cn(
          "mt-4 flex items-start gap-3 text-caption",
          inverse ? "text-gray-400" : "text-text-secondary",
        )}
      >
        <Checkbox
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          {copy.consent}{" "}
          <Link
            href="/privacy-policy"
            className={cn(
              "underline underline-offset-2",
              inverse ? "text-white hover:text-gray-300" : "text-primary",
            )}
          >
            {copy.privacy}
          </Link>
          .
        </span>
      </label>
    </form>
  );
}
