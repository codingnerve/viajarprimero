import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/content/prose";
import { getGuide, getGuidesByDate, guides } from "@/lib/content/guides";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatLongDate } from "@/lib/utils/format-date";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return buildMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const more = getGuidesByDate()
    .filter((entry) => entry.slug !== guide.slug)
    .slice(0, 3);

  return (
    <Section as="article" size="lg">
      {/*
        Publisher is the site, with no byline. An author we cannot point at is
        a fabricated credential — the same rule the blog markup follows.
      */}
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          datePublished: guide.updatedAt,
          dateModified: guide.updatedAt,
          publisher: { "@type": "Organization", name: siteConfig.name },
          mainEntityOfPage: new URL(
            `/guides/${guide.slug}`,
            siteConfig.url,
          ).toString(),
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
      />

      <PageHeader
        className="mt-8"
        eyebrow={guide.category}
        title={guide.title}
        intro={guide.intro}
      >
        {/*
          The two facts that decide whether someone starts reading — how long
          it takes and how current it is — set together under the intro rather
          than as a badge row above the title competing with it.
        */}
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
          <span>{guide.readingMinutes} min read</span>
          <span aria-hidden="true" className="text-text-disabled">
            ·
          </span>
          <span>
            Last reviewed{" "}
            <time dateTime={guide.updatedAt}>
              {formatLongDate(guide.updatedAt)}
            </time>
          </span>
        </p>
      </PageHeader>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {guide.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="mb-3 text-h3 text-text">{section.heading}</h2>
              <Prose>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </Prose>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <div className="rounded-xl bg-surface ring-1 ring-inset ring-border p-5">
            <h2 className="text-h4 text-text">The short version</h2>
            <ul className="mt-3 space-y-2 text-body text-gray-700">
              {guide.checklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-h4 text-text">Related</h2>
            <ul className="space-y-2">
              {guide.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-primary underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-primary-softer p-5">
            <h2 className="text-h4 text-text">Not sure how this applies?</h2>
            <p className="mt-2 text-body text-gray-700">
              Send us the trip and the constraint. We will tell you what the
              carriers on that route actually require, in writing, before you
              pay anything.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-block text-body font-semibold text-primary underline-offset-2 hover:underline"
            >
              Contact us
            </Link>
          </div>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="border-t border-border pt-8">
          <h2 className="text-h3 text-text">More guides</h2>
          <ul className="mt-4 space-y-2">
            {more.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/guides/${entry.slug}`}
                  className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Section>
  );
}
