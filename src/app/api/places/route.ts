import { NextResponse } from "next/server";

import { isHotelSearchConfigured, searchPlaces } from "@/lib/providers/liteapi";

/**
 * City and area autocomplete for the hotel search form.
 *
 * The form is a Client Component — it has to be, it responds to typing — so it
 * cannot call the supplier directly. It goes through here instead, which keeps
 * the API key on the server where it belongs and keeps the vendor's payload
 * shape from reaching the browser: this returns our `PlaceSuggestion`, mapped
 * in `lib/providers/liteapi`.
 *
 * Disallowed in robots.txt along with the rest of `/api/`.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  // Matches the floor in `searchPlaces`. Answering here avoids a round trip
  // for the first two keystrokes of every search.
  if (query.length < 3) {
    return NextResponse.json({ places: [] });
  }

  if (!isHotelSearchConfigured()) {
    return NextResponse.json(
      {
        places: [],
        message: "Hotel search is not connected in this environment.",
      },
      { status: 503 },
    );
  }

  const places = await searchPlaces(query);

  return NextResponse.json(
    { places },
    {
      headers: {
        // Suggestions for a given string are stable; letting the browser and
        // any CDN hold them keeps repeat keystrokes off a billed endpoint.
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
