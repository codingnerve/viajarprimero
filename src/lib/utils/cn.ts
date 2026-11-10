type ClassValue = string | number | null | false | undefined | ClassValue[];

/**
 * Joins conditional class names. Deliberately not `clsx`: the project runs on
 * next/react/react-dom alone, and this is the entire surface we use.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}
