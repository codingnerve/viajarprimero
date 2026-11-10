import { WORLD_LAND_VIEWBOX, worldLandPath } from "@/lib/content/world-land";

/** The id every `JetRouteMap` points at. */
export const WORLD_LAND_ID = "world-land";

/**
 * The basemap geometry, rendered once per page.
 *
 * A results page carries up to twenty-four route panels. Inlining the
 * coastline into each of them would be a megabyte of duplicated path data, and
 * referencing it as an `<image>` — the first attempt — meant the browser
 * rasterised the whole world once and then scaled that raster up by as much as
 * thirty times, which is why the coastlines came out soft.
 *
 * A `<symbol>` in the document plus `<use>` in each panel solves both: one copy
 * of the geometry, and it stays vector at any zoom.
 *
 * This is a Server Component and the path module is imported only here, so the
 * 47KB of coastline is serialised into the HTML once and never reaches the
 * browser bundle — `JetRouteMap` is inside a client modal and only emits a
 * `<use>` reference, which resolves by document id regardless of which
 * component rendered the symbol.
 *
 * Land is drawn white with a coastline stroke, on the water colour the panel
 * itself supplies. The first version filled land with a pale grey on a pale
 * brand wash, and at that contrast the two were indistinguishable — the map
 * read as a smudge rather than as a coastline. `non-scaling-stroke` keeps the
 * coastline one device pixel whatever the zoom, instead of thickening into a
 * band on a short hop.
 */
export function WorldLandDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute size-0 overflow-hidden"
    >
      <defs>
        <symbol
          id={WORLD_LAND_ID}
          viewBox={`0 0 ${WORLD_LAND_VIEWBOX.width} ${WORLD_LAND_VIEWBOX.height}`}
        >
          <path
            d={worldLandPath}
            fill="var(--color-surface)"
            stroke="var(--color-gray-300)"
            strokeWidth="1"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </symbol>
      </defs>
    </svg>
  );
}
