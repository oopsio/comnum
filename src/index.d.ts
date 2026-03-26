/**
 * Options for the humanize function.
 */
export interface HumanizeOptions {
  /**
   * Whether to round the value to the nearest whole number.
   * @default false
   */
  round?: boolean;

  /**
   * Whether to spell out the unit names completely (e.g., "1 hour" instead of "1h").
   * @default false
   */
  long?: boolean;
}

/**
 * Parses a string containing a number and a time unit into milliseconds.
 * If a regular number is passed, it returns the number as is.
 * * @param value - The text to parse (e.g., "1h", "1.5d", "500ms") or a number.
 * @returns The time in milliseconds, or null if the input is invalid or unsafe.
 */
export default function comnum(value: string | number): number | null;

/**
 * Formats a given time in milliseconds into a friendly, human-readable string.
 * * @param ms - The time in milliseconds to format.
 * @param options - Optional settings for rounding and unit length.
 * @returns The formatted text, or null if the input is invalid.
 */
export function humanize(ms: number, options?: HumanizeOptions): string | null;