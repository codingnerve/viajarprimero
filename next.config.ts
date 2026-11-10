import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pin the workspace root.
   *
   * A stray `package-lock.json` in the home directory made Turbopack
   * infer a root above this repo, which warns on every boot and leaves
   * the dev cache pointing outside the project.
   */
  turbopack: { root: process.cwd() },

  images: {
    /**
     * Hosts next/image is allowed to optimise from.
     *
     * Hotel photography comes from the supplier's CDNs rather than from
     * `public/`, and next/image REFUSES any remote host not listed here — it
     * throws rather than degrading, so an unlisted CDN is a 500 on the results
     * page, not a missing picture.
     *
     * The sample dataset uses local files and so hides this entirely, which is
     * precisely why it is worth setting before a supplier key goes in rather
     * than discovering it afterwards.
     *
     * LiteAPI serves images from several supplier CDNs and the set is not
     * fixed or published, so this allows any HTTPS host. That is a deliberate
     * trade: the alternative is a results page that breaks whenever a
     * property's photographs happen to sit on a CDN nobody listed. Narrow it
     * to the hosts you actually observe in production if you prefer.
     */
    remotePatterns: [{ protocol: "https", hostname: "**" }],

    /**
     * AVIF first, WebP behind it.
     *
     * Next negotiates per request and falls back to the original for anything
     * that supports neither, so this is a pure win on payload: the four
     * photographs in `public/images/home` are 730KB of progressive JPEG
     * between them, and the same frames re-encoded to AVIF at the sizes
     * actually requested come to a fraction of that. It costs build time on
     * first request per size, which is cached thereafter.
     */
    formats: ["image/avif", "image/webp"],

    /**
     * The widths a `fill` or `sizes`-bearing image may be generated at.
     *
     * Trimmed from Next's default ladder to the breakpoints this design
     * actually uses (see `--breakpoint-*` in globals.css) plus the 2x retina
     * steps. Every extra entry is another encode of every image, and the
     * default set spends work on widths no layout here ever asks for.
     */
    deviceSizes: [576, 768, 992, 1200, 1440, 1920, 2560],

    /** For the fixed-size images: icons, logos, avatars. */
    imageSizes: [32, 64, 96, 128, 256, 384],

    /**
     * A destination photograph does not change. Thirty days beats the 60s
     * default, which re-optimises the same unchanged file constantly.
     */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
