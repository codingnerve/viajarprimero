import Link from "next/link";

import { OpenChatButton } from "@/components/layout/chat-widget";
import { PhoneIcon, TagIcon } from "@/components/ui/icons";
import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";
import { dealGroups } from "@/lib/content/deals";

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
}: {
  variant?: "full" | "compact";
  /** Compact only — which slugs to show, in order. */
  featured?: readonly string[];
}) {
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);

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
              className="group flex h-full items-start gap-3 rounded-xs bg-surface p-4 ring-1 ring-inset ring-border transition-shadow hover:shadow-md hover:ring-primary/40 focus-ring"
            >
              <TagIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <span className="block text-h6 text-text group-hover:text-primary">
                  {item.label}
                </span>
                <span className="mt-1 block text-caption text-text-secondary">
                  {item.description}
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
                className="flex scroll-mt-[calc(var(--header-height)+1.5rem)] flex-col rounded-xs bg-surface p-5 ring-1 ring-inset ring-border target:ring-2 target:ring-primary"
              >
                <TagIcon className="size-6 text-primary" />
                <h3 className="mt-3 text-h5 text-text">{item.label}</h3>
                <p className="mt-1.5 flex-1 text-body-sm text-text-secondary">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phone && phoneDisplay && (
                    <a
                      href={`tel:${phone}`}
                      aria-label={`Call about ${item.label}: ${phoneDisplay}`}
                      className="inline-flex h-10 items-center gap-2 rounded-xs bg-primary px-4 text-body-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-ring"
                    >
                      <PhoneIcon className="size-4" />
                      Call for this deal
                    </a>
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
