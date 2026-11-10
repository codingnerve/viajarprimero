"use client";

import Link from "next/link";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";

import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  ClockIcon,
  CloseIcon,
  ReceiptIcon,
  StarIcon,
  TagIcon,
  UserIcon,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { accountCookies, PIN_LENGTH } from "@/lib/config/account";
import { cn } from "@/lib/utils/cn";

type Mode = "sign-in" | "sign-up" | "forgot";
type Message = { tone: "success" | "error"; text: string } | null;

const benefits = [
  {
    icon: TagIcon,
    title: "Exclusive fares & deals",
    body: "Enjoy fares and savings kept for members.",
  },
  {
    icon: StarIcon,
    title: "Members only offers",
    body: "Unlock member-only promo codes and offers.",
  },
  {
    icon: ClockIcon,
    title: "Early bird access",
    body: "Be the first to hear about sales and promotions.",
  },
  {
    icon: ReceiptIcon,
    title: "Manage your booking",
    body: "Track and manage all your trips with ease.",
  },
];

const subscribe = () => () => {};
const readSignedIn = () =>
  document.cookie.split("; ").includes(`${accountCookies.signedIn}=1`);
const signedOutOnServer = () => false;

const titles: Record<Mode, [string, string]> = {
  "sign-in": ["Sign in", "Sign in & get benefits"],
  "sign-up": ["Sign up", "Create a free account"],
  forgot: ["Forgot PIN", "We will email you a link to set a new PIN"],
};

/**
 * "Manage my trips". Signed out it opens the sign in / sign up dialog; signed
 * in it links to /my-trips. Accounts run on Supabase through /api/auth/*.
 */
export function AccountButton({
  variant = "pill",
  initialMode = "sign-in",
  children,
  className,
}: {
  variant?: "pill" | "icon" | "block" | "cta" | "link";
  initialMode?: Exclude<Mode, "forgot">;
  children?: ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [message, setMessage] = useState<Message>(null);
  const [busy, setBusy] = useState(false);
  const titleId = useId();
  const fieldId = useId();

  const signedIn = useSyncExternalStore(subscribe, readSignedIn, signedOutOnServer);
  const label = children ?? "Manage my trips";

  const pillClasses = cn(
    "flex h-7 items-center gap-1.5 rounded-full bg-primary px-3 text-caption font-semibold text-text-inverse",
    "transition-colors hover:bg-primary-hover focus-ring",
    className,
  );
  const iconClasses = cn(
    "inline-flex size-11 items-center justify-center rounded-full text-text",
    "transition-colors hover:bg-gray-100 focus-ring",
    className,
  );
  const blockClasses = cn(
    "flex min-h-12 w-full items-center justify-center gap-2 rounded-xs",
    "ring-1 ring-inset ring-border-strong text-body font-semibold text-text",
    "transition-colors hover:bg-gray-50 focus-ring",
    className,
  );
  const linkClasses = cn(
    "rounded-xs text-body font-semibold text-primary underline-offset-4 hover:underline focus-ring",
    className,
  );

  if (signedIn) {
    if (variant === "cta") {
      return (
        <ButtonLink href="/my-trips" variant="accent" size="lg" className={className}>
          View my trips
        </ButtonLink>
      );
    }
    if (variant === "icon") {
      return (
        <Link href="/my-trips" aria-label="My trips" className={iconClasses}>
          <UserIcon className="size-6" />
        </Link>
      );
    }
    return (
      <Link
        href="/my-trips"
        className={
          variant === "pill" ? pillClasses : variant === "block" ? blockClasses : linkClasses
        }
      >
        {variant !== "link" && <UserIcon className={variant === "pill" ? "size-4" : "size-5"} />}
        My trips
      </Link>
    );
  }

  const switchMode = (next: Mode) => {
    setMode(next);
    setMessage(null);
  };

  const openDialog = () => {
    switchMode(initialMode);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  };
  const closeDialog = () => dialogRef.current?.close();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const endpoint = {
      "sign-in": "/api/auth/sign-in",
      "sign-up": "/api/auth/sign-up",
      forgot: "/api/auth/forgot",
    }[mode];

    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
        signedIn?: boolean;
      };

      if (!response.ok) {
        setMessage({
          tone: "error",
          text: body.message ?? "Something went wrong. Please try again.",
        });
      } else if (mode === "forgot") {
        setMessage({
          tone: "success",
          text: "If an account exists for that email, we have sent a link to set a new PIN.",
        });
      } else if (mode === "sign-up" && !body.signedIn) {
        setMessage({
          tone: "success",
          text: "Account created. Check your email and click the link to confirm it.",
        });
      } else {
        window.location.replace("/my-trips");
        return;
      }
    } catch {
      setMessage({ tone: "error", text: "Could not connect. Please check your internet and try again." });
    }

    setBusy(false);
  };

  const verb = mode === "sign-up" ? "Sign up" : "Sign in";

  return (
    <>
      {variant === "pill" && (
        <button type="button" onClick={openDialog} className={pillClasses}>
          <UserIcon className="size-4" />
          {label}
        </button>
      )}

      {variant === "icon" && (
        <button
          type="button"
          onClick={openDialog}
          aria-label="Manage my trips"
          className={iconClasses}
        >
          <UserIcon className="size-6" />
        </button>
      )}

      {variant === "block" && (
        <button type="button" onClick={openDialog} className={blockClasses}>
          <UserIcon className="size-5" />
          {label}
        </button>
      )}

      {variant === "cta" && (
        <Button variant="accent" size="lg" onClick={openDialog} className={className}>
          {label}
        </Button>
      )}

      {variant === "link" && (
        <button type="button" onClick={openDialog} className={linkClasses}>
          {label}
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="modal-dialog m-auto"
        aria-labelledby={titleId}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDialog();
        }}
      >
        <div className="grid max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xs bg-surface text-left shadow-xl sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          {/* Benefits — hidden on phones to keep the form in view. */}
          <div className="hidden bg-brand-wash p-7 sm:block">
            <p className="text-h4 text-text-inverse">
              Sign in / Sign up to earn rewards
            </p>
            <ul className="mt-6 divide-y divide-white/15">
              {benefits.map(({ icon: BenefitIcon, title, body }) => (
                <li key={title} className="flex gap-3 py-4 first:pt-0">
                  <BenefitIcon className="mt-0.5 size-5 shrink-0 text-text-inverse" />
                  <div>
                    <p className="text-body-sm font-semibold text-text-inverse">
                      {title}
                    </p>
                    <p className="mt-0.5 text-caption text-text-on-dark">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative p-6 sm:p-7">
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full text-text-muted transition-colors hover:bg-gray-100 hover:text-text focus-ring"
            >
              <CloseIcon className="size-5" />
            </button>

            <h2 id={titleId} className="text-h3 text-text">
              {titles[mode][0]}
            </h2>
            <p className="mt-0.5 pr-8 text-body-sm text-text-secondary">
              {titles[mode][1]}
            </p>

            {message && (
              <Alert tone={message.tone} className="mt-5">
                <p>{message.text}</p>
              </Alert>
            )}

            {mode !== "forgot" && (
              <>
                <div className="mt-5 space-y-2.5">
                  <SocialButton href="/api/auth/oauth?provider=google" icon={<GoogleMark />}>
                    {verb} with Google
                  </SocialButton>
                  <SocialButton href="/api/auth/oauth?provider=facebook" icon={<FacebookMark />}>
                    {verb} with Facebook
                  </SocialButton>
                </div>

                <div className="my-5 flex items-center gap-3 text-caption text-text-muted">
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                  Or {verb.toLowerCase()} with email
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form key={mode} onSubmit={submit} className={cn("space-y-4", mode === "forgot" && "mt-5")}>
              {mode === "sign-up" && (
                <Field htmlFor={`${fieldId}-name`} label="Full name" required>
                  <Input id={`${fieldId}-name`} name="name" autoComplete="name" required />
                </Field>
              )}

              <Field htmlFor={`${fieldId}-email`} label="Email" required>
                <Input
                  id={`${fieldId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                />
              </Field>

              {mode !== "forgot" && (
                <Field
                  htmlFor={`${fieldId}-pin`}
                  label={mode === "sign-in" ? "PIN" : "Create a PIN"}
                  hint={mode === "sign-up" ? `${PIN_LENGTH} digits.` : undefined}
                  required
                >
                  <Input
                    id={`${fieldId}-pin`}
                    name="pin"
                    type="password"
                    inputMode="numeric"
                    pattern={`[0-9]{${PIN_LENGTH}}`}
                    maxLength={PIN_LENGTH}
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    placeholder={`Enter your ${PIN_LENGTH}-digit PIN`}
                    required
                  />
                </Field>
              )}

              {mode === "sign-in" && (
                <div className="-mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="rounded-xs text-caption font-semibold text-primary hover:underline focus-ring"
                  >
                    Forgot PIN?
                  </button>
                </div>
              )}

              <Button type="submit" variant="accent" fullWidth loading={busy}>
                {mode === "sign-in"
                  ? "Sign in"
                  : mode === "sign-up"
                    ? "Create account"
                    : "Send reset link"}
              </Button>
            </form>

            <p className="mt-5 text-center text-body-sm text-text-secondary">
              {mode === "sign-up" ? "Already have an account?" : mode === "sign-in" ? "Don't have an account?" : "Remembered it?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                className="rounded-xs font-semibold text-primary hover:underline focus-ring"
              >
                {mode === "sign-in" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}

function SocialButton({
  icon,
  href,
  children,
}: {
  icon: ReactNode;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xs text-body-sm font-semibold text-text ring-1 ring-inset ring-border-strong transition-colors hover:bg-gray-50 focus-ring"
    >
      {icon}
      {children}
    </a>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5" fill="currentColor">
      <path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.61-.07-1.07-.15-1.53Z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5 text-primary" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46a21 21 0 0 0-2.3-.16c-2.3 0-3.8 1.4-3.8 3.96v2.24H8v3h2.5V21h3Z" />
    </svg>
  );
}
