import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountButton } from "@/components/layout/account-dialog";
import { OpenChatButton } from "@/components/layout/chat-widget";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Alert } from "@/components/ui/alert";
import { TripCard } from "@/features/account/components/trip-card";
import { readSession } from "@/features/account/lib/session";
import { configured } from "@/lib/config/placeholders";
import { contactConfig } from "@/lib/config/site";
import {
  accountsConfigured,
  AuthError,
  getAccountUser,
  listTrips,
} from "@/lib/providers/supabase-auth";
import { buildMetadata } from "@/lib/seo/metadata";
import type { AccountUser, Trip } from "@/types/trip";

export const metadata = buildMetadata({
  title: "My trips",
  description: "Sign in to see the trips you booked with us.",
  path: "/my-trips",
  noIndex: true,
});

export default async function MyTripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { accessToken, refreshToken } = await readSession();
  const enabled = accountsConfigured();

  let account: { user: AccountUser; trips: Trip[] } | null = null;
  let loadFailed = false;

  if (enabled && accessToken) {
    try {
      const [user, trips] = await Promise.all([
        getAccountUser(accessToken),
        listTrips(accessToken),
      ]);
      account = { user, trips };
    } catch (error) {
      // 401 is an expired token, handled by the refresh below.
      if (!(error instanceof AuthError && error.status === 401)) loadFailed = true;
    }
  }

  if (enabled && !account && !loadFailed && refreshToken && params.refreshed !== "1") {
    redirect("/api/auth/refresh?next=/my-trips");
  }

  const phone = configured(contactConfig.phone);
  const phoneDisplay = configured(contactConfig.phoneDisplay);
  const linkClass = "font-semibold text-primary underline underline-offset-2";

  return (
    <>
      <PageIntro
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "My trips", path: "/my-trips" },
        ]}
        title="My trips"
        intro={
          account
            ? `Signed in as ${account.user.email}.`
            : "Sign in to see the trips you booked with us."
        }
      />

      <Section>
        {!enabled ? (
          <Alert tone="info" title="Online accounts are not switched on yet" className="measure">
            <p>
              To check or change a trip,{" "}
              {phone && phoneDisplay ? (
                <>
                  call{" "}
                  <a href={`tel:${phone}`} className={linkClass}>
                    {phoneDisplay}
                  </a>{" "}
                  or see{" "}
                </>
              ) : (
                "see "
              )}
              <Link href="/manage-booking" className={linkClass}>
                Manage a booking
              </Link>
              .
            </p>
          </Alert>
        ) : loadFailed ? (
          <Alert tone="error" title="We could not load your trips" className="measure">
            <p>
              Please refresh the page in a moment. If it keeps happening, call
              us or use the chat.
            </p>
          </Alert>
        ) : !account ? (
          <div className="measure rounded-xs bg-surface p-6 ring-1 ring-inset ring-border md:p-8">
            <h2 className="text-h3 text-text">Sign in to see your trips</h2>
            <p className="mt-2 text-body text-text-secondary">
              Booked with an agent? Sign in or create an account with the email
              address you gave them, and your trips appear here.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <AccountButton variant="cta">Sign in</AccountButton>
              <AccountButton variant="link" initialMode="sign-up">
                Create an account
              </AccountButton>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-h3 text-text">
                {account.user.name ? `Hi, ${account.user.name.split(" ")[0]}` : "Your trips"}
              </h2>
              <form action="/api/auth/sign-out" method="post">
                <button
                  type="submit"
                  className="h-10 rounded-xs px-4 text-body-sm font-semibold text-text ring-1 ring-inset ring-border-strong transition-colors hover:bg-gray-50 focus-ring"
                >
                  Sign out
                </button>
              </form>
            </div>

            {account.trips.length === 0 ? (
              <div className="measure mt-6 rounded-xs bg-primary-softer p-6">
                <p className="text-h5 text-text">No trips yet</p>
                <p className="mt-2 text-body text-text-secondary">
                  Trips booked with our agents show here once they are added to
                  your account. Booked with a different email? Call or chat and
                  we will link it.
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {account.trips.map((trip) => (
                  <li key={trip.id}>
                    <TripCard trip={trip} />
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-8 text-body text-text-secondary">
              Need to change or cancel?{" "}
              {phone && phoneDisplay && (
                <>
                  Call{" "}
                  <a href={`tel:${phone}`} className={linkClass}>
                    {phoneDisplay}
                  </a>
                  ,{" "}
                </>
              )}
              <OpenChatButton className={linkClass}>use the chat</OpenChatButton>, or
              see{" "}
              <Link href="/manage-booking" className={linkClass}>
                Manage a booking
              </Link>
              .
            </p>
          </>
        )}
      </Section>
    </>
  );
}
