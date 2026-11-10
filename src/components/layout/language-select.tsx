"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import { CheckIcon, GlobeIcon } from "@/components/ui/icons";
import {
  TRANSLATE_COOKIE,
  defaultLanguage,
  languageFromSegment,
  languageFromTranslateCookie,
  languages,
  withLanguagePrefix,
  type LanguageCode,
} from "@/lib/config/languages";
import { cn } from "@/lib/utils/cn";

/**
 * Language picker.
 *
 * The site is written in English. Choosing another language navigates to the
 * same page under that language's prefix — `/hotels` becomes `/es/hotels` —
 * and `proxy.ts` sets Google Translate's `googtrans` cookie on the way through,
 * so the translator script runs on arrival and every later URL keeps the
 * prefix. English visitors never load Google's script at all.
 */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => unknown;
      };
    };
  }
}

const SCRIPT_ID = "google-translate-script";
const MOUNT_ID = "google_translate_element";

function readLanguage(): LanguageCode {
  // The URL is what the visitor can see, copy and share, so it wins over the
  // cookie; the cookie only answers for a page served without a prefix.
  const [, first = ""] = window.location.pathname.split("/");
  const prefixed = languageFromSegment(first);
  if (prefixed) return prefixed;

  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return languageFromTranslateCookie(match?.[1]) ?? defaultLanguage;
}

const subscribe = () => () => {};
const serverLanguage = () => defaultLanguage;

function writeLanguage(code: LanguageCode) {
  const host = window.location.hostname;
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

  // Google also writes the cookie on the parent domain, so clear every
  // variant before setting the new one.
  const domains = ["", `; domain=${host}`, `; domain=.${host.replace(/^www\./, "")}`];
  for (const domain of domains) {
    document.cookie = `${TRANSLATE_COOKIE}=; ${expired}; path=/${domain}`;
  }

  if (code !== defaultLanguage) {
    document.cookie = `${TRANSLATE_COOKIE}=/${defaultLanguage}/${code}; path=/`;
  }
}

/**
 * Google Translate swaps text nodes React owns, and React then throws when it
 * tries to remove or insert around a node that has moved. Tolerating that
 * mismatch is the standard fix; it is applied only once translation is on.
 */
function tolerateTranslatedDom() {
  const proto = Node.prototype as Node & { __vpTranslatePatched?: boolean };
  if (proto.__vpTranslatePatched) return;
  proto.__vpTranslatePatched = true;

  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };

  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(
    this: Node,
    node: T,
    reference: Node | null,
  ): T {
    if (reference && reference.parentNode !== this) return node;
    return insertBefore.call(this, node, reference) as T;
  };
}

function loadTranslator() {
  if (document.getElementById(SCRIPT_ID)) return;

  tolerateTranslatedDom();

  const mount = document.createElement("div");
  mount.id = MOUNT_ID;
  document.body.appendChild(mount);

  window.googleTranslateElementInit = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    if (!TranslateElement) return;
    new TranslateElement(
      { pageLanguage: defaultLanguage, autoDisplay: false },
      MOUNT_ID,
    );
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);
}

export function LanguageSelect({
  variant = "menu",
  className,
}: {
  /** `menu` is the header dropdown; `list` renders inline, for the mobile drawer. */
  variant?: "menu" | "list";
  className?: string;
}) {
  const current = useSyncExternalStore(subscribe, readLanguage, serverLanguage);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const active = languages.find((language) => language.code === current) ?? languages[0];

  useEffect(() => {
    if (current !== defaultLanguage) loadTranslator();
  }, [current]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (code: LanguageCode) => {
    setOpen(false);
    if (code === current) return;

    // Write the cookie before navigating rather than leaving it to `proxy.ts`:
    // switching back to English has to clear it here, or the proxy reads the
    // stale cookie and redirects straight back to the prefixed URL.
    writeLanguage(code);

    // A full document load, not a router push: the translator script has to
    // run against a fresh document, and switching back to English has to throw
    // away the DOM Google rewrote in place.
    const { pathname, search, hash, origin } = window.location;
    const target = `${withLanguagePrefix(pathname, code)}${search}${hash}`;
    window.location.assign(new URL(target, origin).toString());
  };

  const options = (
    <ul className="space-y-0.5">
      {languages.map((language) => {
        const selected = language.code === current;

        return (
          <li key={language.code}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => choose(language.code)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xs px-2.5 py-2 text-left text-body-sm",
                "transition-colors focus-ring",
                selected
                  ? "bg-primary-softer font-semibold text-primary"
                  : "text-text hover:bg-gray-100",
              )}
            >
              <span aria-hidden="true" className="text-body-lg leading-none">
                {language.flag}
              </span>
              <span className="flex-1">{language.label}</span>
              {selected && <CheckIcon className="size-4 shrink-0" />}
            </button>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "list") {
    return (
      <div translate="no" className={cn("notranslate", className)}>
        <p className="mb-2 text-overline uppercase text-text-muted">
          Select your language
        </p>
        {options}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      translate="no"
      className={cn("notranslate relative", className)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Language: ${active.label}`}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7 items-center gap-1.5 rounded-full px-2.5 text-caption font-semibold text-gray-700",
          "transition-colors hover:bg-gray-100 hover:text-text focus-ring",
          open && "bg-gray-100 text-text",
        )}
      >
        <GlobeIcon className="size-4" />
        <span aria-hidden="true" className="leading-none">
          {active.flag}
        </span>
        <span className="uppercase">{active.code.slice(0, 2)}</span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-[var(--z-dropdown)] mt-2 w-60 rounded-xs bg-surface p-2 shadow-xl ring-1 ring-inset ring-border"
      >
        <p className="px-2.5 pb-2 pt-1 text-h6 text-text">Select your language</p>
        <div className="max-h-[min(24rem,70vh)] overflow-y-auto">{options}</div>
      </div>
    </div>
  );
}
