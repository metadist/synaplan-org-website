type ClassValue = string | number | null | false | undefined;

/** Minimal classnames join (no tailwind-merge dependency). */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
