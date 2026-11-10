import { configured } from "@/lib/config/placeholders";
import { contactConfig, siteConfig } from "@/lib/config/site";

/**
 * schema.org builders.
 *
 * Structured data is a machine-readable set of assertions about the business,
 * so the same rule applies here as to visible copy: nothing goes in that is
 * not true. Placeholder contact values are filtered out rather than published
 * as fact — marking up "TODO_PHONE" as a telephone number is worse than
 * publishing no phone markup at all.
 */

type JsonLdValue = string | number | boolean | null | JsonLd | JsonLdValue[];
export interface JsonLd {
  [key: string]: JsonLdValue | undefined;
}

export function organizationSchema(): JsonLd {
  const address: JsonLd = {
    "@type": "PostalAddress",
    streetAddress: configured(contactConfig.address.street),
    addressLocality: configured(contactConfig.address.city),
    addressRegion: configured(contactConfig.address.region),
    postalCode: configured(contactConfig.address.postalCode),
    addressCountry: configured(contactConfig.address.country),
  };

  const hasAddress = Object.values(address).some(
    (value, index) => index > 0 && value !== undefined,
  );

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    legalName: configured(siteConfig.legalName),
    description: siteConfig.description,
    url: siteConfig.url,
    // Absolute, because a consumer of this markup is not resolving it against
    // the page it was found on. This is the file Google may show beside the
    // site in a knowledge panel, so it is the full lockup rather than the
    // square mark.
    logo: `${siteConfig.url}/images/brand/logo.png`,
    email: configured(contactConfig.email),
    telephone: configured(contactConfig.phone),
    address: hasAddress ? address : undefined,
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
