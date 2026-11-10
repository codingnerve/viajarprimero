import type { JsonLd as JsonLdObject } from "@/lib/seo/schema";

/**
 * Renders a schema.org block.
 *
 * `JSON.stringify` drops undefined values, which is what lets the schema
 * builders omit unverified fields rather than emitting empty strings. The
 * closing-tag escape guards against a `</script>` sequence inside any content
 * value breaking out of the element.
 */
export function JsonLd({ schema }: { schema: JsonLdObject | JsonLdObject[] }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
