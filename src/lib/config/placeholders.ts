/**
 * Placeholder detection for configuration values.
 *
 * Every unset field in the site and legal config is a `TODO_` string. The UI
 * and the structured data both branch on this rather than rendering the raw
 * token: a footer reading "Call TODO_PHONE_DISPLAY" is embarrassing, but
 * schema.org markup asserting it as a real telephone number is a false
 * statement about the business.
 */
export function isPlaceholder(value: string): boolean {
  return !value || value.startsWith("TODO_");
}

/** Returns the value only when it has been filled in, otherwise undefined. */
export function configured(value: string): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}
