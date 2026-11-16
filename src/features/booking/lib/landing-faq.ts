import type { AccordionItem } from "@/components/ui/accordion";
import type { LandingPhone } from "@/features/booking/lib/landing-phone";
import { siteConfig } from "@/lib/config/site";

/**
 * Questions for the flight landing page. Every answer restates something the
 * site already commits to elsewhere (fees page, refund policy, site
 * description) — nothing here promises a fare, a saving or a response time.
 */
export function landingFaqs(phone: LandingPhone): AccordionItem[] {
  return [
    {
      question: "Do I pay before I know the full price?",
      answer:
        "No. An agent gives you the airfare, the taxes and carrier-imposed charges and our service fee, and explains the fare rules for that ticket, before you pay.",
    },
    {
      question: "Who answers the phone?",
      answer: `A travel agent at ${siteConfig.name}, ${phone.hours}. Call ${phone.display}.`,
    },
    {
      question: "Are you an airline?",
      answer: `No. ${siteConfig.name} is a travel agency that books flights on the airlines' behalf. The carrier sets the fare and its rules; we explain them to you.`,
    },
    {
      question: "What should I have ready when I call?",
      answer:
        "Where you are flying from and to, your travel dates, and how many people are travelling. Each traveller's name as it appears on their passport or ID is needed to book, not to get a price.",
    },
    {
      question: "Can I change or cancel a ticket afterwards?",
      answer:
        "That depends on the fare rules of the ticket, which is why we go through them with you first. Our refund and cancellation policy page sets out how we handle requests.",
    },
  ];
}
