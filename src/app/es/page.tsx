import { SpanishHomePage } from "@/features/spanish-home/components/spanish-home-page";
import { esMeta } from "@/lib/content/es/home";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: esMeta.title,
  description: esMeta.description,
  path: "/es",
  locale: "es_US",
  languages: { en: "/", es: "/es", "x-default": "/" },
});

export default function EsHomePage() {
  return <SpanishHomePage />;
}
