import { notFound } from "next/navigation";

import { TrainDetailPageContent } from "@/features/trains/components/train-detail-page-content";
import { findTrainOperator, trainOperators } from "@/lib/content/trains";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return trainOperators.map((operator) => ({ slug: operator.slug }));
}

export async function generateMetadata(props: PageProps<"/trains/[slug]">) {
  const { slug } = await props.params;
  const operator = findTrainOperator(slug);

  if (!operator) {
    return buildMetadata({
      title: "Train Operator Not Found",
      description: "This rail operator guide does not exist.",
      path: `/trains/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${operator.name} Train Tickets`,
    description: `${operator.summary} Send a ${operator.name} rail request and an agent confirms schedules, fares and ticket rules before anything is booked.`,
    path: `/trains/${operator.slug}`,
  });
}

export default async function TrainOperatorPage(
  props: PageProps<"/trains/[slug]">,
) {
  const { slug } = await props.params;
  const operator = findTrainOperator(slug);
  if (!operator) notFound();

  return <TrainDetailPageContent operator={operator} />;
}
