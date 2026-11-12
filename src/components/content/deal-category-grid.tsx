import Link from "next/link";

import { LinePhoneLink } from "@/components/layout/line-phone";
import { OpenChatButton } from "@/components/layout/chat-widget";
import { PhoneIcon, TagIcon } from "@/components/ui/icons";
import { configured } from "@/lib/config/placeholders";
import { phoneFor } from "@/lib/config/site";
import { dealGroups } from "@/lib/content/deals";
import { esDeals } from "@/lib/content/es/chrome";
import type { Locale } from "@/types/locale";

/**
 * Deal categories.
 *
 * `full` is the /deals page: every group, each card anchored by its slug so
 * the header dropdown can link straight to it. `compact` is the home page: a
 * few featured categories as link tiles.
 */
export function DealCategoryGrid({
  variant = "full",
  featured,
  locale = "en",
}: {
  variant?: "full" | "compact";
  /** Compact only — which slugs to show, in order. */
  featured?: readonly string[];
  /** Compact only — the Spanish home page shows translated cards. */
  locale?: Locale;
}) {
  const line = phoneFor(locale);
  const phone = configured(line.phone);
  const phoneDisplay = configured(line.phoneDisplay);

  if (variant === "compact") {
    const all = dealGroups.flatMap((group) => group.items);
    const items = featured
      ? featured.flatMap((slug) => all.filter((item) => item.slug === slug))
      : all;

    return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/deals#${item.slug}`}
              className="group flex h-full items-start gap-3 rounded-lg bg-surface p-4 ring-1 ring-inset ring-border transition-shadow hover:shadow-md hover:ring-primary/40 focus-ring"
            >
              <TagIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <span className="block text-h6 text-text group-hover:text-primary">
                  {locale === "es" ? (esDeals[item.slug]?.label ?? item.label) : item.label}
                </span>
                <span className="mt-1 block text-caption text-text-secondary">
                  {locale === "es"
                    ? (esDeals[item.slug]?.description ?? item.description)
                    : item.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-12">
      {dealGroups.map((group) => (
        <section key={group.title}>
          <h2 className="text-h3 text-text">{group.title}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <li
                key={item.slug}
                id={item.slug}
                className="flex scroll-mt-[calc(var(--header-height)+1.5rem)] flex-col rounded-lg bg-surface p-5 ring-1 ring-inset ring-border target:ring-2 target:ring-primary"
              >
                <TagIcon className="size-6 text-primary" />
                <h3 className="mt-3 text-h5 text-text">{item.label}</h3>
                <p className="mt-1.5 flex-1 text-body-sm text-text-secondary">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phone && phoneDisplay && (
                    <LinePhoneLink
                      ariaPrefix={`Call about ${item.label}: `}
                      className="inline-flex h-10 items-center gap-2 rounded-xs bg-primary px-4 text-body-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-ring"
                    >
                      <PhoneIcon className="size-4" />
                      Call for this deal
                    </LinePhoneLink>
                  )}
                  <OpenChatButton className="inline-flex h-10 items-center rounded-xs px-4 text-body-sm font-semibold text-text ring-1 ring-inset ring-border-strong transition-colors hover:bg-gray-50 focus-ring">
                    Ask in chat
                  </OpenChatButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
