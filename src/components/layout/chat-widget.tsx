"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";

import { ChatIcon, CloseIcon, HeadsetIcon, PhoneIcon } from "@/components/ui/icons";
import { configured } from "@/lib/config/placeholders";
import { openTawkChat } from "@/lib/providers/tawk";
import { useLocale } from "@/hooks/use-locale";
import { contactConfig, phoneFor } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

const OPEN_CHAT_EVENT = "vp:open-chat";

/** Opens the chat panel from anywhere on the page. */
export function OpenChatButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
    >
      {children}
    </button>
  );
}

const topics = [
  "Book a new trip",
  "Change or cancel a booking",
  "Deals & offers",
  "Something else",
];

const fieldClasses = cn(
  "w-full rounded-xs bg-surface px-3 text-body text-text",
  "ring-1 ring-inset ring-border-strong placeholder:text-text-muted",
  "focus:outline-none focus:ring-2 focus:ring-primary",
);

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * Floating chat, bottom-right on every page.
 *
 * With Tawk.to set up (see lib/providers/tawk) the button opens live chat.
 * Otherwise a message goes to the team's inbox through /api/chat and an agent follows
 * up by phone or email; the call button is there for anyone who wants a
 * person straight away.
 *
 * `yieldBottomGutter` is set by `FloatingHelp` while `TravelHelpBubble` holds
 * the bottom of a phone screen: the launcher and its panel move up a card's
 * height so the two stack instead of overlapping, and drop straight back
 * into the corner when the bubble is dismissed. Phone-only — the bubble is
 * `sm:hidden`, so from `sm` up the launcher sits where it always did.
 */
export function ChatWidget({
  yieldBottomGutter = false,
}: {
  yieldBottomGutter?: boolean;
} = {}) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const panelId = useId();
  const fieldId = useId();

  const line = phoneFor(useLocale());
  const phone = configured(line.phone);
  const phoneDisplay = configured(line.phoneDisplay);

  useEffect(() => {
    const onOpen = () => {
      if (!openTawkChat()) setOpen(true);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFailure("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          topic,
          page: window.location.pathname,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(body?.message ?? "Your message could not be sent.");
      }

      setStatus("sent");
    } catch (error) {
      setStatus("failed");
      setFailure(
        error instanceof Error ? error.message : "Your message could not be sent.",
      );
    }
  };

  const update =
    (key: keyof typeof form) =>
    (event: { target: { value: string } }) =>
      setForm((previous) => ({ ...previous, [key]: event.target.value }));

  return (
    <>
      <div
        id={panelId}
        role="dialog"
        aria-label="Chat with a travel agent"
        hidden={!open}
        className={cn(
          "fixed right-4 z-[var(--z-overlay)] flex w-[min(23rem,calc(100vw-2rem))] flex-col",
          "overflow-hidden rounded-xs bg-surface shadow-xl ring-1 ring-inset ring-border",
          "sm:right-6 sm:bottom-24 sm:max-h-[calc(100dvh-7rem)]",
          yieldBottomGutter
            ? "bottom-42 max-h-[calc(100dvh-11.5rem)]"
            : "bottom-22 max-h-[calc(100dvh-7rem)]",
          "animate-rise motion-reduce:animate-none",
        )}
      >
        <div className="flex items-center gap-3 bg-brand-wash px-4 py-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 text-text-inverse ring-2 ring-white/30">
            <HeadsetIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-h6 text-text-inverse">Chat with a travel agent</p>
            <p className="text-caption text-text-on-dark">
              Real people, {contactConfig.supportHours}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid size-9 place-items-center rounded-full text-text-inverse transition-colors hover:bg-white/15 focus-ring-inverse"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-background-alt p-4">
          <Bubble>Hi! How can we help with your trip today?</Bubble>

          {topic === null ? (
            <div className="flex flex-wrap gap-2">
              {topics.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTopic(item)}
                  className="rounded-xs bg-surface px-3 py-2 text-body-sm font-medium text-primary ring-1 ring-inset ring-primary/40 transition-colors hover:bg-primary-softer focus-ring"
                >
                  {item}
                </button>
              ))}
            </div>
          ) : (
            <>
              <Bubble mine>{topic}</Bubble>
              {status === "sent" ? (
                <Bubble>
                  Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We have
                  your message and an agent will contact you at {form.contact}.
                </Bubble>
              ) : (
                <Bubble>
                  Leave your details and a message and an agent will get in
                  touch — or call us now.
                </Bubble>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border p-4">
          {topic !== null && status !== "sent" && (
            <form onSubmit={send} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor={`${fieldId}-name`} className="text-caption font-medium text-text">
                    Name
                  </label>
                  <input
                    id={`${fieldId}-name`}
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    className={cn(fieldClasses, "mt-1 h-10")}
                  />
                </div>
                <div>
                  <label htmlFor={`${fieldId}-contact`} className="text-caption font-medium text-text">
                    Phone or email
                  </label>
                  <input
                    id={`${fieldId}-contact`}
                    required
                    value={form.contact}
                    onChange={update("contact")}
                    className={cn(fieldClasses, "mt-1 h-10")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`${fieldId}-message`} className="text-caption font-medium text-text">
                  Message
                </label>
                <textarea
                  id={`${fieldId}-message`}
                  required
                  rows={2}
                  maxLength={2000}
                  value={form.message}
                  onChange={update("message")}
                  className={cn(fieldClasses, "mt-1 resize-none py-2")}
                />
              </div>

              {status === "failed" && (
                <p role="alert" className="text-caption font-medium text-error">
                  {failure}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex h-10 w-full items-center justify-center rounded-xs bg-primary text-body-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-ring disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}

          {phone && phoneDisplay && (
            <a
              href={`tel:${phone}`}
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-xs text-body-sm font-semibold",
                "text-text ring-1 ring-inset ring-border-strong transition-colors hover:bg-gray-50 focus-ring",
                topic !== null && status !== "sent" && "mt-2.5",
              )}
            >
              <PhoneIcon className="size-4 text-primary" />
              <span className="tabular-nums">Call {phoneDisplay}</span>
            </a>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close chat" : "Chat with us"}
        onClick={() => {
          if (!openTawkChat()) setOpen(!open);
        }}
        className={cn(
          "fixed right-4 z-[var(--z-overlay)] grid size-14 place-items-center rounded-full sm:bottom-6 sm:right-6",
          "bg-primary text-text-inverse shadow-lg transition-colors hover:bg-primary-hover focus-ring",
          yieldBottomGutter ? "bottom-24" : "bottom-4",
        )}
      >
        {open ? <CloseIcon className="size-6" /> : <ChatIcon className="size-7" />}
      </button>
    </>
  );
}

function Bubble({ mine = false, children }: { mine?: boolean; children: ReactNode }) {
  return (
    <p
      className={cn(
        "max-w-[85%] rounded-xs px-3 py-2 text-body-sm",
        mine
          ? "ml-auto bg-primary text-text-inverse"
          : "bg-surface text-text ring-1 ring-inset ring-border",
      )}
    >
      {children}
    </p>
  );
}
