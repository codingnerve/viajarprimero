import Image from "next/image";

import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { ClockIcon, PhoneIcon } from "@/components/ui/icons";
import type { LandingCopy } from "@/features/booking/lib/landing-copy";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";

/**
 * The Spanish page's opening band. Where the English page opens on a navy
 * boarding pass, this one opens light: the headline and a large number card on
 * the left, and a photograph cut into an arch on the right with the number
 * repeated on a glass chip across its foot.
 */
export function LandingEsHero({
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
    <Section tone="brand-soft" size="md" containerClassName="pt-8 md:pt-10">
      <Breadcrumbs
        items={[
          { name: copy.crumbs.home, path: "/" },
          { name: copy.crumbs.page, path },
        ]}
      />

      <div className="mt-8 grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-primary-soft py-1.5 pl-3 pr-4 text-overline uppercase text-primary">
            <span className="relative grid size-2.5 place-items-center">
              <span className="absolute inset-0 animate-live-halo rounded-full bg-primary" />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
            {hero.badge(phone.hours)}
          </p>

          <h1 className="mt-6 text-display-lg text-text md:text-display-xl">
            {hero.titleTop}{" "}
            <span className="block">{hero.titleBottom}</span>
            <em className="block font-normal italic text-primary">
              {hero.titleEm}
            </em>
          </h1>

          <p className="mt-6 max-w-xl text-body-lg text-text-secondary">
            {hero.intro}
          </p>

          {/* The number card: the one thing to do on this page. */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl bg-surface p-4 pr-5 shadow-md ring-1 ring-inset ring-border sm:w-fit sm:p-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-text-inverse">
              <PhoneIcon className="size-6" />
            </span>
            <div>
              <p className="text-overline uppercase text-text-muted">
                {hero.desk}
              </p>
              <a
                href={phone.href}
                aria-label={hero.ariaCall(phone.display)}
                className="block rounded-md font-display text-h1 tabular-nums text-primary transition-colors hover:text-primary-hover focus-ring sm:text-display"
              >
                {phone.display}
              </a>
            </div>
            <ButtonLink
              href={phone.href}
              size="lg"
              className="w-full sm:w-auto"
              icon={<PhoneIcon className="size-5" />}
            >
              {hero.call(phone.display)}
            </ButtonLink>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label={hero.ready}>
            {hero.fields.map((field) => (
              <li
                key={field.label}
                className="rounded-full bg-surface px-3.5 py-1.5 text-body-sm text-text-secondary ring-1 ring-inset ring-border"
              >
                <span className="font-semibold text-text">{field.label}</span>
                {" · "}
                {field.hint}
              </li>
            ))}
          </ul>
        </div>

        {/* The arch. */}
        <div
          className="animate-rise relative mx-auto w-full max-w-md lg:max-w-none"
          style={{ animationDelay: "120ms" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-3xl bg-gray-100 shadow-xl">
            <Image
              src={image.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-[55%_center]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-photo-scrim"
            />
          </div>

          <a
            href={phone.href}
            aria-label={hero.ariaCall(phone.display)}
            className="glass-surface absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl p-4 text-text shadow-glass transition-transform hover:-translate-y-0.5 focus-ring motion-reduce:transform-none sm:inset-x-6 sm:bottom-6"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-primary">
              <ClockIcon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-caption font-semibold uppercase tracking-wide text-text-secondary">
                {hero.badge(phone.hours)}
              </span>
              <span className="block text-h4 tabular-nums">{phone.display}</span>
            </span>
          </a>
        </div>
      </div>
    </Section>
  );
}
