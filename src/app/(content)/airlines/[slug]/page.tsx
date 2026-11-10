import Link from "next/link";
import { notFound } from "next/navigation";

import { AirlineLogo } from "@/components/content/airline-logo";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { airlines, getAirline } from "@/lib/content/airlines";
import { routes, resolveRoute } from "@/lib/content/routes";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Airline page.
 *
 * The target of "View details" on the check-in and baggage directories, which
 * link to `#check-in` and `#baggage`. Check-in, baggage and fare policies are
 * the airline's, so each section sends the traveller to the airline's site
 * rather than reprinting rules that change without notice.
 */

export function generateStaticParams() {
  return airlines.map((airline) => ({ slug: airline.slug }));
}

export async function generateMetadata(props: PageProps<"/airlines/[slug]">) {
  const { slug } = await props.params;
  const airline = getAirline(slug);
  if (!airline) return {};

  return buildMetadata({
    title: `${airline.name} flights, check-in and baggage`,
    description: `Book ${airline.name} flights with a travel agent, and find ${airline.name} online check-in and baggage information on the airline's own website.`,
    path: `/airlines/${airline.slug}`,
  });
}

export default async function AirlinePage(props: PageProps<"/airlines/[slug]">) {
  const { slug } = await props.params;
  const airline = getAirline(slug);
  if (!airline) notFound();

  const domain = new URL(airline.website).hostname.replace(/^www\./, "");

  const topics = [
    {
      id: "check-in",
      title: "Online check-in",
      body: `${airline.name} check-in is done on the airline's website or app. Have your airline booking reference and passport ready.`,
      cta: `Check in on ${domain}`,
    },
    {
      id: "baggage",
      title: "Baggage information",
      body: `Your carry-on and checked bag allowance depends on your ticket. ${airline.name} publishes its current baggage rules on its website.`,
      cta: `Baggage rules on ${domain}`,
    },
    {
      id: "policies",
      title: "Changes, cancellations and airline policies",
      body: `Changes, refunds, seats and special assistance follow ${airline.name}'s own rules for your ticket. Call us and we will help with your booking.`,
      cta: `Visit ${domain}`,
    },
  ];

  return (
    <Section>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Airlines", path: "/airlines" },
          { name: airline.name, path: `/airlines/${airline.slug}` },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="min-w-0">
          <header className="flex flex-wrap items-center gap-5">
            <AirlineLogo
              code={airline.code}
              name={airline.name}
              className="h-16 w-40 ring-1 ring-inset ring-border"
            />
            <div>
              <p className="text-overline uppercase text-primary">
                {airline.code} · {airline.country}
                {airline.alliance !== "None" && <> · {airline.alliance}</>}
              </p>
              <h1 className="mt-1 text-display text-text">{airline.name}</h1>
            </div>
          </header>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/flights">Search flights</ButtonLink>
          </div>

          <div className="mt-10 space-y-4">
            {topics.map((topic) => (
              <section
                key={topic.id}
                id={topic.id}
                className="scroll-mt-[calc(var(--header-height)+2rem)] rounded-xs bg-surface p-6 ring-1 ring-inset ring-border target:ring-2 target:ring-primary"
              >
                <h2 className="text-h3 text-text">{topic.title}</h2>
                <p className="mt-2 text-body text-text-secondary">{topic.body}</p>
                <ButtonLink
                  href={airline.website}
                  variant="outline"
                  className="mt-4"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {topic.cta}
                </ButtonLink>
              </section>
            ))}
          </div>

          <Alert tone="info" className="measure mt-8">
            We are an independent travel agency and book {airline.name} flights
            for our customers. We are not the airline or affiliated with it, and
            its name and logo belong to it.
          </Alert>

          <nav aria-label="Related pages" className="mt-10 border-t border-border pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                { href: "/airlines", label: "All airlines" },
                { href: "/online-check-in", label: "Online check-in" },
                { href: "/baggage-information", label: "Baggage information" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-lg text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <div className="rounded-xs bg-surface-2 p-5 ring-1 ring-inset ring-border">
            {/* Not airline-specific: we hold no carrier-route mapping. */}
            <h2 className="text-h5 text-text">Popular routes</h2>
            <ul className="mt-2 space-y-1.5">
              {routes
                .map(resolveRoute)
                .filter((route) => route !== undefined)
                .slice(0, 6)
                .map((route) => (
                  <li key={route.slug}>
                    <Link
                      href={`/flights/${route.slug}`}
                      className="text-body text-primary underline underline-offset-2 hover:text-primary-hover"
                    >
                      {route.origin.city} to {route.destination.city}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
