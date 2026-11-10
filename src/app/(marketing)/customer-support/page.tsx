import Link from "next/link";

import { OpenChatButton } from "@/components/layout/chat-widget";
import { PageIntro } from "@/components/layout/page-intro";
import { AgencyNotice } from "@/components/layout/agency-notice";
import { Section } from "@/components/layout/section";
import { Accordion } from "@/components/ui/accordion";
import {
  CalendarIcon,
  ChatIcon,
  CloseIcon,
  MailIcon,
  PhoneIcon,
  PlaneIcon,
  ReceiptIcon,
  ShieldIcon,
  SuitcaseIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";
import { faqs } from "@/lib/content/faqs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Customer support",
  description:
    "Chat, call or email us. Help with booking status, itineraries, check-in, refunds, changes, cancellations and special assistance.",
  path: "/customer-support",
});

/** "Need assistance?" — the common jobs, each linked to where it is handled. */
const assistance = [
  {
    icon: ReceiptIcon,
    title: "Check booking status",
    body: "Sign in to see your trips.",
    href: "/my-trips",
  },
  {
    icon: MailIcon,
    title: "View, email or print itinerary",
    body: "See your trips or ask for your e-ticket again.",
    href: "/my-trips",
  },
  {
    icon: PlaneIcon,
    title: "Check-in & boarding pass",
    body: "Online check-in links for every airline.",
    href: "/online-check-in",
  },
  {
    icon: ShieldIcon,
    title: "Refund status",
    body: "How refunds work and how long they take.",
    href: "/refund-and-cancellation-policy",
  },
  {
    icon: CalendarIcon,
    title: "Change your trip",
    body: "New dates, names or flights.",
    href: "/manage-booking",
  },
  {
    icon: CloseIcon,
    title: "Cancel your trip",
    body: "Cancellation rules, including the 24-hour rule.",
    href: "/refund-and-cancellation-policy",
  },
  {
    icon: UsersIcon,
    title: "Special assistance",
    body: "Wheelchairs, medical needs and meal requests.",
    href: "/guides/special-assistance-and-medical-needs",
  },
  {
    icon: SuitcaseIcon,
    title: "Baggage",
    body: "Allowances, extra bags and lost luggage.",
    href: "/baggage-information",
  },
];

const topics = [
  { label: "Baggage", href: "/baggage-information" },
  { label: "Online check-in", href: "/online-check-in" },
  { label: "Delayed or cancelled flights", href: "/guides/delayed-or-cancelled-flights" },
  { label: "Special assistance", href: "/guides/special-assistance-and-medical-needs" },
  { label: "Flying with children", href: "/guides/flying-with-children-and-infants" },
  { label: "Booking for someone else", href: "/guides/booking-a-flight-for-someone-else" },
  { label: "Hotel cancellations", href: "/guides/hotel-cancellation-deadlines-and-deposits" },
  { label: "Boarding a cruise", href: "/guides/boarding-a-cruise" },
  { label: "Driving abroad", href: "/guides/driving-abroad-licences-and-paperwork" },
];

const contactCard =
  "flex h-full flex-col items-start rounded-xs bg-surface p-5 text-left ring-1 ring-inset ring-border transition-shadow hover:shadow-md focus-ring";

export default function CustomerSupportPage() {
  const email = configured(contactConfig.email);
  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const supportHours = configured(contactConfig.supportHours);

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Customer support", path: "/customer-support" },
        ]}
        title="Customer support"
        intro={`Help with a new trip or one you have already booked. Real agents${supportHours ? `, ${supportHours}` : ""}.`}
      />

      <Section>
        <SectionHeading align="start" title="Contact us" />
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          <li>
            <OpenChatButton className={contactCard}>
              <ChatIcon className="size-7 text-primary" />
              <span className="mt-3 text-h5 text-text">Chat now</span>
              <span className="mt-1 text-body-sm text-text-secondary">
                Message a travel agent.
              </span>
            </OpenChatButton>
          </li>
          {phone && phoneDisplay && (
            <li>
              <a href={`tel:${phone}`} className={contactCard}>
                <PhoneIcon className="size-7 text-primary" />
                <span className="mt-3 text-h5 text-text">
                  {supportHours ? `${supportHours} helpline` : "Call us"}
                </span>
                <span className="mt-1 text-body-sm font-semibold tabular-nums text-text-secondary">
                  {phoneDisplay}
                </span>
              </a>
            </li>
          )}
          {email && (
            <li>
              <a href={`mailto:${email}`} className={contactCard}>
                <MailIcon className="size-7 text-primary" />
                <span className="mt-3 text-h5 text-text">Email</span>
                <span className="mt-1 text-body-sm text-text-secondary">{email}</span>
              </a>
            </li>
          )}
        </ul>

        <SectionHeading className="mt-14" align="start" title="Need assistance?" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {assistance.map(({ icon: ItemIcon, title, body, href }) => (
            <li key={title}>
              <Link href={href} className={contactCard}>
                <ItemIcon className="size-6 text-primary" />
                <span className="mt-3 text-h6 text-text">{title}</span>
                <span className="mt-1 text-body-sm text-text-secondary">{body}</span>
              </Link>
            </li>
          ))}
        </ul>

        <SectionHeading className="mt-14" align="start" title="Popular topics" />
        <ul className="mt-6 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li key={topic.href}>
              <Link
                href={topic.href}
                className="inline-flex h-10 items-center rounded-xs bg-surface px-4 text-body-sm font-medium text-text ring-1 ring-inset ring-border-strong transition-colors hover:bg-primary-softer hover:text-primary focus-ring"
              >
                {topic.label}
              </Link>
            </li>
          ))}
        </ul>

        <SectionHeading className="mt-14" align="start" title="Common questions" />
        <Accordion items={faqs.slice(0, 8)} className="mt-6" />
        <p className="mt-6 text-body text-text-secondary">
          More in the{" "}
          <Link href="/faq" className="text-primary underline underline-offset-2">
            full FAQ
          </Link>
          .
        </p>

        <AgencyNotice className="mt-12 measure" />
      </Section>
    </>
  );
}
