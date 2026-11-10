import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { VerifySession } from "@/features/account/components/verify-session";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Your account",
  description: "Finishing sign-in to your account.",
  path: "/account/verify",
  noIndex: true,
});

export default function AccountVerifyPage() {
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "My trips", path: "/my-trips" },
        ]}
        title="Your account"
        intro="One moment while we finish signing you in."
      />
      <Section>
        <VerifySession />
      </Section>
    </>
  );
}
