import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { getArticlesByDate } from "@/lib/content/articles";
import { getBlogImage } from "@/lib/content/blog-images";
import { esBlog } from "@/lib/content/es/home";
import { formatLongDate } from "@/lib/utils/format-date";
import type { Locale } from "@/types/locale";

/** "14 de julio de 2026" — the long form, in Spanish. */
function formatLongDateEs(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  return new Intl.DateTimeFormat("es-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/**
 * The most recent pieces, as cards.
 *
 * The blog had no route into it from the home page — it lived in the footer
 * under "Traveller tools" and in the site map, which is where content goes to
 * be read by nobody. The header deliberately carries only five items (see
 * `secondaryNav`), so the home page is the right place to open the door.
 *
 * It is a component rather than markup inlined on the page for the usual
 * reason: `app/` composes, it does not lay out. It also means the count is one
 * prop rather than a slice repeated at every call site.
 *
 * A card renders without its picture rather than borrowing a generic one — see
 * lib/content/blog-images — so the aspect box is held whether or not an image
 * exists, and a row of three stays on the same baseline either way.
 */
export function LatestArticles({
  count = 3,
  locale = "en",
}: {
  count?: number;
  locale?: Locale;
}) {
  const es = locale === "es";
  const articles = getArticlesByDate().slice(0, count);
  if (articles.length === 0) return null;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => {
        const image = getBlogImage(article.slug);

        return (
          <li key={article.slug}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-xs bg-surface ring-1 ring-inset ring-border transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-primary">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {image && (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 992px) 30vw, (min-width: 576px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-caption text-text-muted">
                  {es
                    ? `${esBlog.categories[article.category] ?? article.category} · ${esBlog.minutes(article.readingMinutes)}`
                    : `${article.category} · ${article.readingMinutes} min read`}
                </p>

                <h3 className="mt-2 text-h4 text-balance text-text">
                  <Link
                    href={`/travel-blog/${article.slug}`}
                    className="outline-none after:absolute after:inset-0"
                  >
                    {es
                      ? (esBlog.articles[article.slug]?.title ?? article.title)
                      : article.title}
                  </Link>
                </h3>

                <p className="mt-2 flex-1 text-body-sm text-text-secondary">
                  {es
                    ? (esBlog.articles[article.slug]?.summary ?? article.summary)
                    : article.summary}
                </p>

                <p className="mt-4 flex items-center justify-between gap-3 text-caption text-text-muted">
                  <time dateTime={article.publishedAt}>
                    {es
                      ? formatLongDateEs(article.publishedAt)
                      : formatLongDate(article.publishedAt)}
                  </time>
                  <span
                    aria-hidden="true"
                    className="flex items-center gap-1.5 font-semibold text-primary"
                  >
                    {es ? esBlog.read : "Read"}
                    <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
