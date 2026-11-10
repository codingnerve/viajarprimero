import type { ComboboxOption } from "@/components/ui/combobox";
import type { PicklistGroup } from "@/types/picklist";

/**
 * Turns a grouped picklist into combobox options.
 *
 * The group becomes the option's second line rather than a heading, because
 * the combobox is a flat list with a filter over it. That turns out better
 * than the `<optgroup>` it replaced: "Florida" under "Tampa" is visible on the
 * row itself, and typing "florida" finds all six Florida ports — which an
 * optgroup label cannot do, since a native select only matches on the option
 * text.
 */
export function picklistOptions(
  groups: readonly PicklistGroup[],
): ComboboxOption[] {
  return groups.flatMap((group) =>
    group.options.map((option) => ({
      id: option,
      label: option,
      detail: group.label,
    })),
  );
}

/**
 * The options to show for what is currently typed.
 *
 * An empty box gets everything — this is a picklist, and the whole reason for
 * it is that somebody who does not know which ports run Caribbean sailings can
 * open the field and read the list. It scrolls; hiding two thirds of it behind
 * a search would defeat the point.
 *
 * Matching is on the place and its group together, so "tampa", "florida" and
 * "fl" all find the same row.
 */
export function filterPicklist(
  options: readonly ComboboxOption[],
  query: string,
): ComboboxOption[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...options];

  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(needle) ||
      (option.detail?.toLowerCase().includes(needle) ?? false),
  );
}
