import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { AccountButton } from "@/components/layout/account-dialog";
import { Section } from "@/components/layout/section";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon, HeadsetIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

type IconComponent = ComponentType<{ className?: string }>;

/**
 * The home page's sections, shared by `/` and `/es`.
 *
 * The two pages differ only in language and in which forms sit in the search
 * tabs, so the layout lives here once and each page passes its own copy. A
 * section redesigned here is redesigned in both languages.
 */

/* ── Hero ─────────────────────────────────────────────────────────────── */

export function HomeHero({
  title,
  accent,
  intro,
  proof,
  tabsLabel,
  tabs,
}: {
  title: string;
  accent: string;
  intro: string;
  proof: ReadonlyArray<{ icon: IconComponent; label: string }>;
  tabsLabel: string;
  tabs: readonly TabItem[];
}) {
  return (
    <Section
      tone="brand"
      size="sm"
      /*
        z-20 and no overflow clipping: the destination and airport lists hang
        out of the search card, and every Section is its own stacking context,
        so without this the band below paints over an open list.
      */
      className="z-20 flex min-h-[min(34rem,calc(100svh-var(--header-height)))] flex-col justify-center"
      containerClassName="pb-0 md:pb-0"
      lightBackdrop
      backdrop={
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-sunset.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
          {/* A pale veil on the text side keeps the dark copy legible over the
              sky, and the bottom fades into the page under the search card. */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
        </div>
      }
    >
      <div className="mx-auto grid max-w-6xl items-center gap-6 pt-0 md:pt-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
        <div className="text-center lg:text-left">
        <h1 className="animate-rise text-balance text-display-lg text-text [animation-delay:80ms] motion-reduce:animate-none">
          {title}
          <br className="hidden sm:block" />{" "}
          <span className="text-accent">{accent}</span>
        </h1>
        <p className="animate-rise mx-auto mt-5 max-w-2xl text-body-lg text-text-secondary lg:mx-0 [animation-delay:160ms] motion-reduce:animate-none">
          {intro}
        </p>

        <ul className="animate-rise mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start [animation-delay:240ms] motion-reduce:animate-none">
          {proof.map(({ icon: ProofIcon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 ring-1 ring-inset ring-border backdrop-blur-[var(--blur-md)]"
            >
              <ProofIcon className="size-4.5 shrink-0 text-accent" />
              <span className="text-body-sm font-semibold text-text">
                {label}
              </span>
            </li>
          ))}
        </ul>
        </div>

        <div className="animate-fade relative order-first mx-auto aspect-square w-40 sm:w-52 lg:order-none lg:w-full lg:max-w-[17rem] motion-reduce:animate-none">
          <div aria-hidden="true" className="absolute inset-6 rounded-full bg-white/35 blur-3xl" />
          <Image
            src="/images/hero/hero-logo.png"
            alt="Viajar Primero — new places, first."
            fill
            priority
            sizes="(min-width: 1024px) 24rem, 18rem"
            className="object-contain"
          />
        </div>
      </div>

      {/*
        The search card overhangs the bottom edge of the hero by about half its
        height, so the hero reads as a backdrop and the card as the object in
        front of it. The negative bottom margin is what pulls the band's own
        bottom edge up; the section after the hero opens with matching room.
      */}
      <div className="animate-rise relative mt-8 -mb-20 rounded-xl bg-surface p-2 shadow-panel [animation-delay:320ms] motion-reduce:animate-none md:mt-8 md:-mb-24 md:p-3">
        <Tabs
          tone="light"
          shape="panel"
          label={tabsLabel}
          panelClassName="pt-3 md:pt-4"
          items={tabs}
        />
      </div>
    </Section>
  );
}

/* ── Trust bar ────────────────────────────────────────────────────────── */

/**
 * Four plain statements about how we work, in one row directly under the
 * search card. They are the same claims the "why book with us" copy makes,
 * kept short enough to read at a glance.
 */
export function TrustBar({
  points,
}: {
  points: ReadonlyArray<{ icon: IconComponent; title: string; body: string }>;
}) {
  return (
    <Section size="xs">
      {/* Room for the search card's overhang above. */}
      <ul className="grid gap-6 pt-28 sm:grid-cols-2 md:pt-32 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
        {points.map(({ icon: PointIcon, title, body }) => (
          <li key={title} className="flex items-start gap-3.5 lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
              <PointIcon className="size-5" />
            </span>
            <span>
              <span className="block text-h5 text-text">{title}</span>
              <span className="mt-0.5 block text-body-sm text-text-secondary">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── How it works ─────────────────────────────────────────────────────── */

export function HowItWorks({
  eyebrow,
  title,
  steps,
  linkHref,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  steps: ReadonlyArray<{ title: string; body: string }>;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <Section tone="brand">
      <SectionHeading eyebrow={eyebrow} title={title} tone="inverse" />
      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-white/20 pt-6">
            <span
              aria-hidden="true"
              className="font-display text-display tabular-nums text-accent"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-h3 text-text-inverse">{step.title}</h3>
            <p className="mt-2 text-body text-text-on-dark">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-12 text-center">
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1.5 rounded-sm text-body font-semibold text-text-inverse underline-offset-4 hover:underline focus-ring-inverse"
        >
          {linkLabel}
          <ArrowRightIcon className="size-4" />
        </Link>
      </p>
    </Section>
  );
}

/* ── What we book ─────────────────────────────────────────────────────── */

export interface ServiceCard {
  href: string;
  label: string;
  blurb: string;
  art: string;
  /** Spans two columns on desktop and carries a larger picture. */
  featured?: boolean;
}

export function ServicesBento({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly ServiceCard[];
}) {
  return (
    <Section tone="muted">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ href, label, blurb, art, featured }) => (
          <li key={href} className={cn(featured && "lg:col-span-2")}>
            <Link
              href={href}
              className={cn(
                "group flex h-full flex-col justify-between gap-8 rounded-xl bg-surface p-6 shadow-xs ring-1 ring-inset ring-border",
                "transition-[box-shadow,transform] duration-[var(--duration-normal)] ease-out",
                "hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30 focus-ring motion-reduce:transform-none",
              )}
            >
              <span className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid shrink-0 place-items-center rounded-lg bg-primary-softer",
                    featured ? "size-20" : "size-16",
                  )}
                >
                  <Image
                    src={art}
                    alt=""
                    width={160}
                    height={160}
                    className={cn("object-contain", featured ? "size-14" : "size-11")}
                  />
                </span>
                <ArrowRightIcon className="size-5 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none" />
              </span>
              <span>
                <span className="block text-h3 text-text group-hover:text-primary">
                  {label}
                </span>
                <span className="mt-1.5 block text-body-sm text-text-secondary">
                  {blurb}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── About ────────────────────────────────────────────────────────────── */

/**
 * Photo on one side, the case for booking with us on the other. The four
 * claims that used to be cards here live in the trust bar under the hero, so
 * this section can be about the agency rather than a list.
 */
export function AboutBlock({
  eyebrow,
  title,
  description,
  linkLabel,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
  /** The line on the picture's floating card. */
  badge: string;
}) {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            <Image
              src="/images/home/why-us-road.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-lg ring-1 ring-inset ring-border md:left-8">
            <span className="grid size-10 place-items-center rounded-lg bg-accent text-text-inverse">
              <HeadsetIcon className="size-5" />
            </span>
            <span className="text-h5 text-text">{badge}</span>
          </div>
        </div>

        <div>
          <SectionHeading
            align="start"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <ButtonLink href="/about" variant="outline" className="mt-8">
            {linkLabel}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

/* ── Sign up ──────────────────────────────────────────────────────────── */

export function SignUpBand({
  title,
  body,
  benefits,
  button,
}: {
  title: string;
  body: string;
  benefits: ReadonlyArray<{ icon: IconComponent; title: string }>;
  button: string;
}) {
  return (
    <Section>
      <div className="grid items-center gap-8 rounded-2xl bg-brand-wash p-8 md:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <div>
          <h2 className="text-h2 text-text-inverse">{title}</h2>
          <p className="mt-3 text-body-lg text-text-on-dark">{body}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {benefits.map(({ icon: BenefitIcon, title: benefitTitle }) => (
              <li
                key={benefitTitle}
                className="flex items-center gap-2.5 text-body-sm font-semibold text-text-inverse"
              >
                <BenefitIcon className="size-5 shrink-0 text-accent" />
                {benefitTitle}
              </li>
            ))}
          </ul>
        </div>
        <AccountButton variant="cta" initialMode="sign-up">
          {button}
        </AccountButton>
      </div>
    </Section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export function FaqSplit({
  eyebrow,
  title,
  description,
  items,
  name,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: readonly AccordionItem[];
  name: string;
}) {
  return (
    <Section tone="muted">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading
          align="start"
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <Accordion
          items={items}
          name={name}
          className="border-t border-border"
        />
      </div>
    </Section>
  );
}

/** A heading-and-content band with the page's default rhythm. */
export function ContentBand({
  tone = "default",
  eyebrow,
  title,
  description,
  children,
}: {
  tone?: "default" | "muted";
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10">{children}</div>
    </Section>
  );
}
