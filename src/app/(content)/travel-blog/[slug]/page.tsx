import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/content/prose";
import { ButtonLink } from "@/components/ui/button";
import { articles, getArticle, getArticlesByDate } from "@/lib/content/articles";
import { getBlogImage } from "@/lib/content/blog-images";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatLongDate } from "@/lib/utils/format-date";
import { slugify } from "@/lib/utils/slugify";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/travel-blog/[slug]">,
) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/travel-blog/${article.slug}`,
  });
}

export default async function ArticlePage(
  props: PageProps<"/travel-blog/[slug]">,
) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  /* Placeholder imagery for now — see lib/content/blog-images. */
  const image = getBlogImage(article.slug);

  /* Labels the contents nav for assistive technology. */
  const headingId = `contents-${article.slug}`;

  const more = getArticlesByDate()
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3);

  return (
    /*
      Full width, with the reading column capped inside it rather than the
      band itself set to `narrow`.

      `narrow` centred an 860px column in a 1560px container and left 300px
      of nothing down each side. The prose still wants a short line — that
      part was right — so it keeps its cap and the recovered width goes to a
      rail instead of to the margins.
    */
    <Section as="article" size="lg">
      {/*
        Article markup names the site as publisher rather than inventing a
        byline. An author we cannot point at is a fabricated credential.
      */}
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.summary,
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          publisher: { "@type": "Organization", name: siteConfig.name },
          mainEntityOfPage: new URL(
            `/travel-blog/${article.slug}`,
            siteConfig.url,
          ).toString(),
        }}
      />

      <div className="mx-auto grid max-w-5xl gap-x-16 gap-y-12 lg:max-w-none lg:grid-cols-[minmax(0,46rem)_minmax(0,19rem)] lg:justify-center">
        <div className="min-w-0">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Travel blog", path: "/travel-blog" },
          { name: article.title, path: `/travel-blog/${article.slug}` },
        ]}
      />

      <PageHeader
        className="mt-8"
        eyebrow={article.category}
        title={article.title}
        intro={article.intro}
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
          <span>{article.readingMinutes} min read</span>
          <span aria-hidden="true" className="text-text-disabled">
            ·
          </span>
          <span>
            Published{" "}
            <time dateTime={article.publishedAt}>
              {formatLongDate(article.publishedAt)}
            </time>
          </span>
        </p>
      </PageHeader>

      {/*
        The picture sits under the intro rather than above the headline. On a
        piece this narrow a banner over the title pushes the thing somebody
        clicked for below the fold, and the intro is what tells them they are
        in the right place.

        Renders nothing when the article has no entry — see
        lib/content/blog-images for why there is no generic fallback.
      */}
      {image && (
        <figure className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 992px) 46rem, 100vw"
            className="object-cover"
          />
        </figure>
      )}

      <div className="mt-10">
        {article.blocks.map((block) => (
          <section key={block.heading} className="mb-10">
            {/* `scroll-mt` keeps the heading clear of the fixed header when
                the contents list jumps to it. */}
            <h2
              id={slugify(block.heading)}
              className="mb-3 scroll-mt-[calc(var(--header-height)+1.5rem)] text-h3 text-text"
            >
              {block.heading}
            </h2>
            <Prose>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {block.list && (
                <ul>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </Prose>
          </section>
        ))}
      </div>

      {/*
        The foot of the piece, for viewports with no rail. Above `lg` the
        same links live in the sidebar, where they are reachable without
        finishing the article first — showing both would be the same list
        twice on one screen.
      */}
      {more.length > 0 && (
        <section className="border-t border-border pt-8 lg:hidden">
          <h2 className="text-h3 text-text">More from the blog</h2>
          <ul className="mt-4 space-y-2">
            {more.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/travel-blog/${entry.slug}`}
                  className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
        </div>

        {/*
          The rail. Sticky, because its whole value is being reachable from
          the middle of a six-minute read — pinned to the top of the article
          it would be a list you scroll away from and never see again.

          Hidden below `lg`, where there is no spare width to put it in and
          a table of contents above the article is just a second thing to
          scroll past before reaching the piece.
        */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-height)+2rem)] space-y-8">
            <nav aria-labelledby={`${headingId}`}>
              <h2
                id={headingId}
                className="text-overline uppercase text-text-muted"
              >
                On this page
              </h2>
              <ul className="mt-4 space-y-1 border-l border-border">
                {article.blocks.map((block) => (
                  <li key={block.heading}>
                    <a
                      href={`#${slugify(block.heading)}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-body-sm text-text-secondary transition-colors hover:border-primary hover:text-primary focus-ring"
                    >
                      {block.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
              A way out of the piece and into the thing it is about. The
              article explains how something works; this is where somebody
              who now wants to act on it goes.
            */}
            <div className="rounded-2xl bg-surface-2 p-5 ring-1 ring-inset ring-border">
              <h2 className="text-h6 text-text">Planning this trip?</h2>
              <p className="mt-2 text-body-sm text-text-secondary">
                Call us or tell us the trip, and we will come back with it
                priced in full.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink href="/flights" size="sm" fullWidth>
                  Flights
                </ButtonLink>
                <ButtonLink href="/contact" size="sm" variant="outline" fullWidth>
                  Talk to us
                </ButtonLink>
              </div>
            </div>

            {more.length > 0 && (
              <div>
                <h2 className="text-overline uppercase text-text-muted">
                  Read next
                </h2>
                <ul className="mt-4 space-y-3">
                  {more.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/travel-blog/${entry.slug}`}
                        className="block rounded text-body-sm font-medium text-text transition-colors hover:text-primary focus-ring"
                      >
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </Section>
  );
}
