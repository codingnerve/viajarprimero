import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { destinationPhotoCredits } from "@/lib/content/photo-credits";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Photo credits",
  description:
    "Who took the photographs on this site, and under which licence we publish them.",
  path: "/photo-credits",
});

/**
 * Attribution for the licensed photography.
 *
 * The destination pictures are Creative Commons work from Wikimedia Commons,
 * and CC BY and CC BY-SA both make crediting the photographer a condition of
 * use rather than a nicety. The list is generated from
 * `lib/content/photo-credits.ts`, so a picture cannot be added to the site
 * without its row appearing here.
 */
export default function PhotoCreditsPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[{ name: "Photo credits", path: "/photo-credits" }]}
        eyebrow="Credits"
        title="Photo credits"
        intro="The photographs illustrating our destination guides are the work of the photographers below, published here under the Creative Commons licence each one chose. Cropping is ours; the pictures are theirs."
      />

      <Section>
        <div className="measure">
          <h2 className="text-h4 text-text">Destination guides</h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {destinationPhotoCredits.map((credit) => (
              <li key={credit.slug} className="py-4">
                <p className="text-body text-text">{credit.subject}</p>
                <p className="mt-1 text-body-sm text-text-secondary">
                  {credit.photographer} ·{" "}
                  <a
                    href={credit.licenseUrl}
                    rel="license noopener noreferrer"
                    target="_blank"
                    className="underline underline-offset-2 focus-ring"
                  >
                    {credit.license}
                  </a>{" "}
                  ·{" "}
                  <a
                    href={credit.sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="underline underline-offset-2 focus-ring"
                  >
                    Source
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
