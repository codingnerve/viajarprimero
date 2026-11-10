import { WORLD_LAND_ID } from "@/features/private-jets/components/world-land-defs";
import type { JetAirport } from "@/types/private-jet";

/**
 * The route, drawn on a world map.
 *
 * ## Why this is not Mapbox
 *
 * A tile map needs an account, a token, a runtime request per panel and a
 * JavaScript library — and this project runs on `next`, `react` and
 * `react-dom` alone. None of that buys anything here: the panel shows two
 * airports and the line between them at continental zoom, where streets and
 * labels are noise. So the basemap is a 58KB static SVG generated from Natural
 * Earth's public-domain land polygons, and the geometry is drawn on top of it.
 *
 * The basemap is a `<symbol>` rendered once per page by `WorldLandDefs`, which
 * each panel points at with `<use>`. One copy of the geometry, and it stays
 * vector at any zoom — the first version referenced an `<image>`, so the
 * browser rasterised the whole world once and then scaled that raster by as
 * much as thirty times, which is why the coastlines came out soft.
 *
 * ## The projection is ours, and that is the point
 *
 * The land path was generated with the same equirectangular formula used
 * below, so a marker lands where the coastline says it should. A borrowed map
 * would have an unknown extent — most published world SVGs are cropped at
 * about 83°N and none of them say so in the file — and a marker placed with
 * the wrong extent is worse than no map at all.
 *
 * ## Honesty
 *
 * The line is a real great circle, sampled on the sphere, not a decorative
 * bezier: at this zoom the difference between the two is visible on any
 * transatlantic leg, and a curve drawn for looks would misrepresent the
 * routing. It is still the direct track rather than the filed route — the
 * supplier does not publish one — which is why the panel says "direct track"
 * rather than implying this is the path the aircraft will fly.
 *
 * Nothing renders at all unless both airports have coordinates.
 */

/** Matches the generator: lon -180..180 → 0..1000, lat 90..-90 → 0..500. */
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

/** Samples along the great circle. Enough that the curve reads as smooth. */
const ARC_STEPS = 64;

/** Degrees of padding around the route, so the endpoints are not on the edge. */
const PADDING = 6;

/** Smallest window the map will zoom to, in projected units. */
const MIN_SPAN_X = 90;

interface Point {
  x: number;
  y: number;
}

function project(lon: number, lat: number): Point {
  return {
    x: ((lon + 180) / 360) * MAP_WIDTH,
    y: ((90 - lat) / 180) * MAP_HEIGHT,
  };
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Points along the great circle between two coordinates.
 *
 * Spherical linear interpolation on the unit vectors, which is the actual
 * shortest path over the earth. The degenerate case — the two airports being
 * the same place — falls back to the single point rather than dividing by a
 * zero sine.
 */
function greatCircle(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Array<{ lat: number; lng: number }> {
  const φ1 = toRadians(from.lat);
  const λ1 = toRadians(from.lng);
  const φ2 = toRadians(to.lat);
  const λ2 = toRadians(to.lng);

  const d =
    2 *
    Math.asin(
      Math.min(
        1,
        Math.sqrt(
          Math.sin((φ2 - φ1) / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
        ),
      ),
    );

  if (d === 0) return [from];

  const points: Array<{ lat: number; lng: number }> = [];

  for (let step = 0; step <= ARC_STEPS; step += 1) {
    const f = step / ARC_STEPS;
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);

    const x = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
    const y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
    const z = a * Math.sin(φ1) + b * Math.sin(φ2);

    points.push({
      lat: toDegrees(Math.atan2(z, Math.sqrt(x * x + y * y))),
      lng: toDegrees(Math.atan2(y, x)),
    });
  }

  return points;
}

export function JetRouteMap({
  origin,
  destination,
  distanceNm,
  className,
}: {
  origin: JetAirport;
  destination: JetAirport;
  distanceNm: number | null;
  className?: string;
}) {
  if (
    origin.lat === null ||
    origin.lng === null ||
    destination.lat === null ||
    destination.lng === null
  ) {
    return null;
  }

  const from = { lat: origin.lat, lng: origin.lng };
  const to = { lat: destination.lat, lng: destination.lng };

  const start = project(from.lng, from.lat);
  const end = project(to.lng, to.lat);

  /*
    The arc is broken wherever consecutive samples land on opposite edges of
    the map. That happens on any route crossing the antimeridian, where an
    unbroken polyline would draw a horizontal streak straight across the
    Pacific instead of leaving one edge and arriving at the other.
  */
  const segments: Point[][] = [[]];
  let previous: Point | null = null;

  for (const point of greatCircle(from, to)) {
    const projected = project(point.lng, point.lat);
    if (previous && Math.abs(projected.x - previous.x) > MAP_WIDTH / 2) {
      segments.push([]);
    }
    segments[segments.length - 1].push(projected);
    previous = projected;
  }

  const drawn = segments.filter((segment) => segment.length > 1);

  /* The window: the whole route plus padding, clamped to the map. */
  const points = drawn.flat().concat([start, end]);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  const padX = (PADDING / 360) * MAP_WIDTH;
  const padY = (PADDING / 180) * MAP_HEIGHT;

  let minX = Math.min(...xs) - padX;
  let maxX = Math.max(...xs) + padX;
  let minY = Math.min(...ys) - padY;
  let maxY = Math.max(...ys) + padY;

  // A short domestic hop would otherwise zoom until the coastline is a
  // meaningless blob, so the window has a floor. The height follows from the
  // panel's 2:1 aspect, which keeps the land the right shape.
  if (maxX - minX < MIN_SPAN_X) {
    const centre = (minX + maxX) / 2;
    minX = centre - MIN_SPAN_X / 2;
    maxX = centre + MIN_SPAN_X / 2;
  }

  const width = maxX - minX;
  const height = width / 2;
  const centreY = (minY + maxY) / 2;
  minY = centreY - height / 2;
  maxY = centreY + height / 2;

  // Keep the window on the map rather than showing empty space past the poles
  // or the antimeridian.
  if (minX < 0) {
    maxX -= minX;
    minX = 0;
  }
  if (maxX > MAP_WIDTH) {
    minX -= maxX - MAP_WIDTH;
    maxX = MAP_WIDTH;
    if (minX < 0) minX = 0;
  }
  if (minY < 0) {
    maxY -= minY;
    minY = 0;
  }
  if (maxY > MAP_HEIGHT) {
    minY -= maxY - MAP_HEIGHT;
    maxY = MAP_HEIGHT;
    if (minY < 0) minY = 0;
  }

  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  // Strokes and radii are in projected units, so they have to scale with the
  // window or a short hop gets fat markers and a long one hairline ones.
  const unit = (maxX - minX) / MAP_WIDTH;
  const stroke = 2.4 * unit;
  const radius = 4.6 * unit;

  return (
    <figure className={className}>
      {/*
        Water. Light enough to sit inside the panel, dark enough that the white
        land reads as land — the previous pair, pale grey on a pale brand wash,
        were near enough the same value that the map looked like a smudge.
      */}
      <div className="overflow-hidden rounded-xl bg-gray-100 ring-1 ring-inset ring-border">
        <svg
          viewBox={viewBox}
          role="img"
          aria-label={`Direct track from ${origin.name || origin.icao} to ${destination.name || destination.icao}`}
          className="block h-auto w-full"
        >
          {/*
            The basemap, defined once per page — see the note at the top of
            this file. `WorldLandDefs` has to be on the page or this resolves
            to nothing and the panel renders water only.
          */}
          <use
            href={`#${WORLD_LAND_ID}`}
            x="0"
            y="0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
          />

          {/*
            Two passes: a pale wide stroke under the dashes so the track stays
            followable where it crosses a white landmass, then the dashes
            themselves. A single dashed line vanished over land.
          */}
          {drawn.map((segment) => {
            const points = segment.map((p) => `${p.x},${p.y}`).join(" ");
            const key = `${segment[0].x},${segment[0].y}`;

            return (
              <g key={key}>
                <polyline
                  points={points}
                  fill="none"
                  strokeWidth={stroke * 2.2}
                  strokeLinecap="round"
                  className="stroke-primary opacity-15"
                />
                <polyline
                  points={points}
                  fill="none"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${stroke * 0.1} ${stroke * 2}`}
                  className="stroke-primary"
                />
              </g>
            );
          })}

          <circle
            cx={start.x}
            cy={start.y}
            r={radius}
            className="fill-primary stroke-white"
            strokeWidth={stroke * 0.8}
          />
          <circle
            cx={end.x}
            cy={end.y}
            r={radius}
            className="fill-secondary stroke-white"
            strokeWidth={stroke * 0.8}
          />
        </svg>
      </div>

      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-caption text-text-muted">
        <span>
          {origin.code || origin.icao} &rarr;{" "}
          {destination.code || destination.icao}
        </span>
        {distanceNm !== null && (
          <span className="tabular-nums">
            {distanceNm.toLocaleString("en-US")} nm direct track
          </span>
        )}
      </figcaption>
    </figure>
  );
}
