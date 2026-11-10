import { parseSearchParams } from "@/features/search/lib/search-params";
import { searchFlights } from "@/lib/providers/flight-search";

/**
 * JSON fare search.
 *
 * The results page renders on the server and does not need this, but a machine
 * -readable endpoint is useful for a future client-side refine-in-place UI.
 * The `configured: false` shape is passed through unchanged so a caller can
 * tell "no supplier connected" from "no flights match".
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams.entries());

  const { query, errors } = parseSearchParams(raw);

  if (!query) {
    return Response.json(
      { message: "That search is incomplete.", errors },
      { status: 400 },
    );
  }

  try {
    const result = await searchFlights(query);
    return Response.json(result, {
      // Fares are volatile; a cached fare is a wrong fare.
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Fare search failed", error);

    return Response.json(
      {
        message:
          "We could not reach the fare service. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
