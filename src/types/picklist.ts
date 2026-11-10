/**
 * A grouped list of choices for a form picklist.
 *
 * Lives here rather than beside any one dataset because three now use it —
 * cruise departure ports, cruise regions, and car-rental pick-up states — and
 * the enquiry forms render all of them through the same combobox.
 *
 * Groups are not decoration. Fifty-one US states in one flat list is a wall;
 * the same fifty-one under Northeast, Midwest, South and West is a list
 * somebody can find their state in, and the group name is searchable text on
 * every row.
 */
export interface PicklistGroup {
  label: string;
  options: readonly string[];
}
