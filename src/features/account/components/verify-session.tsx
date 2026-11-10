"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PIN_LENGTH } from "@/lib/config/account";

type State =
  | { step: "working" }
  | { step: "reset" }
  | { step: "error"; message: string };

/**
 * Supabase returns here with the session in the URL fragment — after an email
 * confirmation, a PIN reset link, or Google/Facebook. The tokens are handed to
 * /api/auth/session (which stores them in httpOnly cookies) and wiped from the
 * address bar. A reset link then asks for the new PIN.
 */
async function establish(): Promise<State | "done"> {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);
  window.history.replaceState(null, "", window.location.pathname);

  const failure = hash.get("error_description") ?? query.get("error_description");
  if (failure) return { step: "error", message: failure };

  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  if (!accessToken || !refreshToken) {
    return { step: "error", message: "This link is incomplete or has already been used." };
  }

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken,
      refreshToken,
      expiresIn: Number(hash.get("expires_in")) || 3600,
    }),
  });
  if (!response.ok) {
    return { step: "error", message: "This link has expired. Please try again." };
  }

  return hash.get("type") === "recovery" ? { step: "reset" } : "done";
}

export function VerifySession() {
  const [state, setState] = useState<State>({ step: "working" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);
  const fieldId = useId();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    establish().then(
      (outcome) => {
        if (outcome === "done") window.location.replace("/my-trips");
        else setState(outcome);
      },
      () => setState({ step: "error", message: "Something went wrong. Please try again." }),
    );
  }, []);

  const savePin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pin = String(data.get("pin") ?? "");

    if (pin !== String(data.get("confirm") ?? "")) {
      setError("The two PINs do not match.");
      return;
    }

    setBusy(true);
    setError("");

    const response = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    }).catch(() => null);

    if (response?.ok) {
      window.location.replace("/my-trips");
      return;
    }

    const body = (await response?.json().catch(() => null)) as { message?: string } | null;
    setBusy(false);
    setError(body?.message ?? "Your PIN could not be saved. Please try again.");
  };

  if (state.step === "working") {
    return <p className="text-body-lg text-text-secondary">Signing you in…</p>;
  }

  if (state.step === "error") {
    return (
      <div className="measure">
        <Alert tone="error" title="We could not sign you in">
          <p>{state.message}</p>
        </Alert>
        <Link
          href="/my-trips"
          className="mt-6 inline-block rounded-xs text-body font-semibold text-primary underline-offset-4 hover:underline focus-ring"
        >
          Back to My trips
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={savePin}
      className="measure space-y-5 rounded-xs bg-surface p-6 ring-1 ring-inset ring-border md:p-8"
    >
      <h2 className="text-h3 text-text">Set a new PIN</h2>
      <Field htmlFor={`${fieldId}-pin`} label="New PIN" hint={`${PIN_LENGTH} digits.`} required>
        <Input
          id={`${fieldId}-pin`}
          name="pin"
          type="password"
          inputMode="numeric"
          pattern={`[0-9]{${PIN_LENGTH}}`}
          maxLength={PIN_LENGTH}
          autoComplete="new-password"
          required
        />
      </Field>
      <Field htmlFor={`${fieldId}-confirm`} label="Confirm new PIN" required>
        <Input
          id={`${fieldId}-confirm`}
          name="confirm"
          type="password"
          inputMode="numeric"
          pattern={`[0-9]{${PIN_LENGTH}}`}
          maxLength={PIN_LENGTH}
          autoComplete="new-password"
          required
        />
      </Field>
      {error && (
        <p role="alert" className="text-body-sm font-medium text-error">
          {error}
        </p>
      )}
      <Button type="submit" variant="accent" loading={busy}>
        Save PIN
      </Button>
    </form>
  );
}
