import { EnquiryPanel } from "@/features/enquiries/components/enquiry-panel";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Prose } from "@/components/content/prose";
import { aircraftCategories, jetServices } from "@/lib/content/private-jets";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Private jet services",
  description:
    "What we arrange around a charter: ground transport to the aircraft steps, catering matched to the galley, FBO and handling, passenger documents, pets, and the operator's change and cancellation terms.",
  path: "/private-jets/services",
});

/**
 * Services.
 *
 * Written as arrangements rather than amenities throughout. "Chauffeur
 * service" implies we employ drivers; "ground transport arranged to meet the
 * aircraft" is what a broker actually does, and it is the wording that
 * survives being read back by a regulator or an unhappy client.
 *
 * The accessibility entry is deliberately included and deliberately honest.
 * Business jets are not step-free, what is possible varies by type, and it is
 * the operator's decision — telling somebody that in advance is worth more
 * than a general assurance that turns into a problem at the aircraft.
 */
export default function JetServicesPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Private jets", path: "/private-jets" },
          { name: "Services", path: "/private-jets/services" },
        ]}
        eyebrow="Around the flight"
        title="What we arrange, and who is responsible"
        intro="A charter is more than the aircraft. These are the things we handle around it — each one described as what it actually is, including the parts that are the operator's decision rather than ours."
        actions={
          <ButtonLink href="/private-jets/request-a-quote">
            Request a charter quote
          </ButtonLink>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
          <div className="min-w-0">
            {/*
              Long-form entries divided by rules rather than boxed into six
              cards. Each one is a paragraph plus three specifics — that is
              prose with a list, not a tile.
            */}
            <div className="divide-y divide-border border-y border-border">
              {jetServices.map((service) => (
                <section
                  key={service.slug}
                  id={service.slug}
                  className="scroll-mt-[calc(var(--header-height)+2rem)] py-10 first:pt-0 last:pb-0"
                >
                  <h2 className="text-h2 text-text">{service.name}</h2>
                  <p className="measure mt-2 text-body-lg text-text-secondary">
                    {service.summary}
                  </p>
                  <p className="measure mt-4 text-body text-gray-700">
                    {service.detail}
                  </p>
                  <ul className="mt-5 grid gap-3 md:grid-cols-3">
                    {service.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-body-sm text-text-secondary">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <section className="mt-16">
              <h2 className="text-h2 text-text">
                What we will not tell you we do
              </h2>
              <Prose className="mt-4">
                <p>
                  We do not own aircraft, employ pilots or run an FBO. Every
                  service above is something we arrange with the operator or a
                  supplier on your behalf, and every one of them appears on your
                  quote as a cost rather than as an unexplained inclusion.
                </p>
                <p>
                  Where something is the operator&apos;s decision — whether a
                  pet travels, whether a wheelchair can be accommodated on a
                  particular type, whether a schedule change is permitted — we
                  will get you the answer before you commit, and we
                  will tell you it is their answer rather than ours.
                </p>
              </Prose>
            </section>
          </div>

          <EnquiryPanel
            vertical="jet"
            title="Request a charter quote"
            intro="Tell us what you need arranged alongside the flight and we will price it into the quote rather than settling it afterwards."
            disclaimer="We are a charter broker, not an air carrier. Every flight is operated by a licensed operator under its own air carrier certificate, and that operator's conditions of carriage govern the flight."
            aircraftCategories={aircraftCategories.map((category) => ({
              slug: category.slug,
              name: category.name,
              seats: category.seats,
            }))}
          />
        </div>
      </Section>
    </>
  );
}
