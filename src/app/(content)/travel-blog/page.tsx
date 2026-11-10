import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getArticlesByDate } from "@/lib/content/articles";
import { getBlogImage } from "@/lib/content/blog-images";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatLongDate } from "@/lib/utils/format-date";

export const metadata = buildMetadata({
  title: "Travel blog",
  description:
    "How airline pricing works, what to check before booking a connection, and the charges that surface at a rental desk. Explanations rather than promises.",
  path: "/travel-blog",
});

export default function TravelBlogPage() {
  const articles = getArticlesByDate();
  const [lead, ...rest] = articles;

  /*
    Placeholder imagery for now — see lib/content/blog-images. An article
    with no entry renders without a picture rather than borrowing one from
    somewhere else, so the layout has to work both ways.
  */
  const leadImage = lead ? getBlogImage(lead.slug) : null;

  return (
    <>
      <Section tone="brand-soft" size="sm" bordered>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Travel blog", path: "/travel-blog" },
          ]}
        />

        <PageHeader
          className="mt-8"
          eyebrow="Blog"
          title="Travel blog"
          intro="We write about how the systems behind a booking actually work, on the view that a traveller who understands fare buckets or a rental excess makes better decisions than one handed a rule of thumb. Nothing here promises you a saving."
        />
      </Section>

      <Section>
        {/*
          The most recent piece is given the width to make its case; the rest
          are a list. A grid of equal tiles says every article matters equally,
          which is never true of a blog and wastes the one editorial decision
          an index page gets to make.
        */}
        {lead && (
          <article className="group relative border-b border-border pb-10">
            {/*
              The picture leads, because on an index the lead article's job
              is to be the thing you look at first. A 21:9 crop rather than
              a square: it reads as a banner above the headline instead of
              competing with it for the same vertical space.

              `priority` because this is the largest element above the fold
              on this route, and the aspect box reserves its space so the
              headline does not jump when the file lands.
            */}
            {leadImage && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[21/9]">
                <Image
                  src={leadImage.url}
                  alt={leadImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1560px) 1496px, 100vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" size="sm">
                Latest
              </Badge>
              <span className="text-caption text-text-muted">
                {lead.category} · {lead.readingMinutes} min read
              </span>
            </div>

            <h2 className="measure-tight mt-4 text-balance text-display text-text">
              <Link
                href={`/travel-blog/${lead.slug}`}
                className="outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
              >
                {lead.title}
              </Link>
            </h2>

            <p className="measure mt-4 text-body-lg text-text-secondary">
              {lead.summary}
            </p>

            <p className="mt-5 flex items-center gap-3 text-caption text-text-muted">
              <time dateTime={lead.publishedAt}>
                {formatLongDate(lead.publishedAt)}
              </time>
              <span
                aria-hidden="true"
                className="flex items-center gap-1.5 font-semibold text-primary"
              >
                Read
                <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </p>
          </article>
        )}

        <ul className="mt-2 divide-y divide-border">
          {rest.map((article) => {
            const image = getBlogImage(article.slug);

            return (
            <li key={article.slug}>
              <article className="group relative grid gap-4 py-7 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,18rem)] md:items-center md:gap-8">
                {/*
                  A fixed 4:3 box whether or not a picture exists, so the
                  rows in the list stay on the same rhythm. Without one, an
                  article missing its image would pull its neighbours out of
                  alignment.
                */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 md:aspect-[4/3]">
                  {image && (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 13rem, 100vw"
                      className="object-cover transition-transform duration-[var(--duration-slow)] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  )}
                </div>

                <div>
                  <p className="text-caption text-text-muted">
                    {article.category} · {article.readingMinutes} min read
                  </p>
                  <h2 className="mt-2 text-h3 text-balance text-text">
                    <Link
                      href={`/travel-blog/${article.slug}`}
                      className="outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-caption text-text-muted">
                    <time dateTime={article.publishedAt}>
                      {formatLongDate(article.publishedAt)}
                    </time>
                  </p>
                </div>

                <p className="text-body-sm text-text-secondary">
                  {article.summary}
                </p>
              </article>
            </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
