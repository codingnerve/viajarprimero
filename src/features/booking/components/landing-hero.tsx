import Image from "next/image";

import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * The landing page's opening band: the promise on the left, and on the right a
 * boarding pass that is really a phone card. The pass is the idea of the page —
 * a flight is booked by saying four things aloud, so the "fields" are the four
 * things an agent will ask, and the stub is the number.
 */
export function LandingHero({
  phone,
  copy,
  path,
  image,
}: {
  phone: LandingPhone;
  copy: LandingCopy;
  path: string;
  image: { src: string };
}) {
  const { hero } = copy;

  return (
    <Section
      tone="brand"
      size="lg"
      containerClassName="pb-24 md:pb-32"
      backdrop={
        <>
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-30 mix-blend-luminosity"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/80 via-secondary/30 to-transparent"
          />
        </>
      }
    >
      <Breadcrumbs
        tone="inverse"
        items={[
          { name: copy.crumbs.home, path: "/" },
          { name: copy.crumbs.page, path },
        ]}
      />

      <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-white/12 py-1.5 pl-3 pr-4 text-overline uppercase text-text-inverse ring-1 ring-inset ring-white/25">
            <span className="relative grid size-2.5 place-items-center">
              <span className="absolute inset-0 animate-live-halo rounded-full bg-white" />
              <span className="relative size-2 rounded-full bg-white" />
            </span>
            {hero.badge(phone.hours)}
          </p>

          <h1 className="mt-6 text-display-lg text-text-inverse md:text-display-xl">
            {hero.titleTop}
            <br />
            {hero.titleBottom}{" "}
            <em className="font-normal italic text-text-on-dark">
              {hero.titleEm}
            </em>
          </h1>

          <p className="mt-6 max-w-xl text-body-lg text-text-on-dark">
            {hero.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink
              href={phone.href}
              variant="inverse"
              size="lg"
              className="!bg-white !text-primary hover:!bg-primary-softer"
              icon={<PhoneIcon className="size-5" />}
            >
              {hero.call(phone.display)}
            </ButtonLink>
            <a
              href="#how-it-works"
              className="rounded-sm text-body font-semibold text-text-inverse underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white focus-ring-inverse"
            >
              {hero.how}
            </a>
          </div>
        </div>

        {/* The boarding pass. */}
        <div
          className="animate-rise lg:justify-self-end"
          style={{ animationDelay: "120ms" }}
        >
          <div className="relative w-full max-w-md rounded-3xl bg-surface text-text shadow-panel lg:rotate-[1.5deg] motion-reduce:rotate-0">
            <div className="p-6 md:p-7">
              <div className="flex items-center justify-between text-overline uppercase text-text-muted">
                <span>{hero.passLabel}</span>
                <span>{hero.seat}</span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
                {hero.fields.map((item) => (
                  <div key={item.label}>
                    <dt className="text-overline uppercase text-primary">
                      {item.label}
                    </dt>
                    <dd className="mt-1 border-b border-dashed border-border-strong pb-1.5 font-display text-h4 font-normal italic text-text-muted">
                      {item.hint}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-body-sm text-text-secondary">{hero.ready}</p>
            </div>

            {/* Perforation: two bites out of the card and a dashed tear line. */}
            <div className="relative" aria-hidden="true">
              <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-secondary" />
              <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-secondary" />
              <div className="mx-6 border-t-2 border-dashed border-border-strong" />
            </div>

            <div className="p-6 md:p-7">
              <p className="text-overline uppercase text-text-muted">
                {hero.desk}
              </p>
              <a
                href={phone.href}
                aria-label={hero.ariaCall(phone.display)}
                className="mt-1 block rounded-md font-display text-h1 tabular-nums text-primary transition-colors hover:text-primary-hover focus-ring sm:text-display"
              >
                {phone.display}
              </a>
              <div
                aria-hidden="true"
                className="mt-4 h-9 w-full text-secondary/70 [background:repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_5px,currentColor_5px_6px,transparent_6px_11px)]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
