/**
 * Conversion factors from a given unit to milliseconds.
 * Frozen to prevent accidental modification or prototype pollution.
 * @constant {Object}
 */
const factors = Object.freeze({
  ms: 1,
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
  w: 604800000,
  y: 31536000000,
});

/**
 * Long names for time units used for the 'long' formatting option.
 * Frozen to keep the data secure.
 * @constant {Object}
 */
const longNames = Object.freeze({
  ms: "millisecond",
  s: "second",
  m: "minute",
  h: "hour",
  d: "day",
  w: "week",
  y: "year",
});

/**
 * Parses a string containing a number and a time unit into milliseconds.
 * If a regular number is passed, it returns the number as is.
 *
 * @example
 * comnum("1h") // 3600000
 * comnum("1.5d") // 129600000
 * comnum(500) // 500
 *
 * @param {string|number} value - The text to parse (e.g., "1h", "1.5d", "500ms").
 * @returns {number|null} The time in milliseconds, or null if the text is invalid or unsafe.
 */
export default function comnum(value) {
  // If it's already a number, make sure it's not a weird math bug like NaN or Infinity
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  // Guard against non-strings or massive "memory-bomb" strings (ReDoS protection)
  if (typeof value !== "string" || value.length > 100) {
    return null;
  }

  // Clean up any accidental invisible spaces at the very beginning or end
  const cleanValue = value.trim();

  // This regular expression safely matches numbers like 5, -5, 5.5, .5, or 5.
  // followed by an optional time unit, ignoring uppercase/lowercase differences.
  const match = /^(-?(?:\d+\.?\d*|\.\d+))\s*(ms|s|m|h|d|w|y)?$/i.exec(
    cleanValue,
  );

  if (!match) return null;

  const num = parseFloat(match[1]);
  const type = (match[2] || "ms").toLowerCase();

  // Get the factor securely
  const factor = factors[type];
  if (!factor) return null;

  const result = num * factor;

  // Final safety check: ensure the result doesn't blow up JavaScript's safe integer limit
  return Math.abs(result) <= Number.MAX_SAFE_INTEGER ? result : null;
}

/**
 * Formats a given time in milliseconds into a friendly, human-readable string.
 *
 * @example
 * humanize(3600000, { long: true }) // "1 hour"
 * humanize(60000) // "1m"
 * humanize(3590000, { round: true }) // "1h"
 *
 * @param {number} ms - The time in milliseconds to format.
 * @param {Object} [options] - Optional settings for how to format the text.
 * @param {boolean} [options.round=false] - Whether to round to the nearest whole number.
 * @param {boolean} [options.long=false] - Whether to spell out the unit names completely.
 * @returns {string|null} The formatted text, or null if the input is invalid.
 */
export function humanize(ms, options) {
  // Protect against math gremlins (NaN/Infinity) and safely handle empty options
  if (!Number.isFinite(ms)) return null;

  // Strict check to ensure options is an object, otherwise default to an empty object
  const safeOptions =
    typeof options === "object" && options !== null ? options : {};

  const abs = Math.abs(ms);
  let val, unit;

  // Figure out the best unit to use. We automatically calculate the thresholds
  // so if you ever change the factors, this math will still work perfectly!
  if (
    abs >= factors.y ||
    (safeOptions.round && Math.round(abs / factors.m) >= factors.y / factors.m)
  ) {
    val = ms / factors.y;
    unit = "y";
  } else if (
    abs >= factors.w ||
    (safeOptions.round && Math.round(abs / factors.d) >= factors.w / factors.d)
  ) {
    val = ms / factors.w;
    unit = "w";
  } else if (
    abs >= factors.d ||
    (safeOptions.round && Math.round(abs / factors.h) >= factors.d / factors.h)
  ) {
    val = ms / factors.d;
    unit = "d";
  } else if (
    abs >= factors.h ||
    (safeOptions.round && Math.round(abs / factors.m) >= factors.h / factors.m)
  ) {
    val = ms / factors.h;
    unit = "h";
  } else if (
    abs >= factors.m ||
    (safeOptions.round && Math.round(abs / factors.s) >= factors.m / factors.s)
  ) {
    val = ms / factors.m;
    unit = "m";
  } else if (
    abs >= factors.s ||
    (safeOptions.round &&
      Math.round(abs / factors.ms) >= factors.s / factors.ms)
  ) {
    val = ms / factors.s;
    unit = "s";
  } else {
    val = ms;
    unit = "ms";
  }

  // Apply the rounding if the user asked for it
  if (safeOptions.round) {
    val = Math.round(val);
  }

  // Format the number smoothly. If it's not rounded, keep one decimal but hide it if it's .0
  const formattedVal = safeOptions.round
    ? val.toString()
    : val.toFixed(1).replace(/\.0$/, "");

  // Handle the 'long' option where we spell out the word completely
  if (safeOptions.long) {
    let name = longNames[unit];
    // Add an 's' to make it plural if the absolute value is anything other than exactly 1
    if (Math.abs(parseFloat(formattedVal)) !== 1) name += "s";
    return `${formattedVal} ${name}`;
  }

  // Combine the number and the short unit abbreviation
  return formattedVal + unit;
}

/**
 * Calculates the relative time from right now to a given date.
 * Returns a friendly string like "5m ago" or "in 2 days".
 * * @example
 * relative(Date.now() - 60000) // "1m ago"
 * relative(Date.now() + 172800000, { long: true }) // "in 2 days"
 * relative("1h") // "in 1h"
 * * @param {number|Date|string} time - The target time as a Unix timestamp, Date object, or time string.
 * @param {Object} [options] - Optional settings for formatting (passed directly to humanize).
 * @returns {string|null} The relative time string, or null if the input is invalid.
 */
export function relative(time, options) {
  let timestamp;

  // Check if it is a Date object, a string we need to parse, or just a normal number
  if (time instanceof Date) {
    timestamp = time.getTime();
  } else if (typeof time === "string") {
    // If it's a string like "1h", we use comnum to figure out how many milliseconds that is,
    // and then add it to the current time to see when it will happen!
    const parsed = comnum(time);
    timestamp = parsed !== null ? Date.now() + parsed : null;
  } else {
    timestamp = time;
  }

  // Safety check to make sure we actually have a valid number to work with
  // isNaN checks if the number is broken (Not-a-Number)
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    return null;
  }

  const now = Date.now();
  const diff = timestamp - now;
  const absDiff = Math.abs(diff);

  // If the time is less than one second away, just say it is happening right now
  if (absDiff < factors.s) {
    return "just now";
  }

  // Reuse the humanize function to do the heavy lifting of figuring out the time string
  const timeString = humanize(absDiff, options);

  if (!timeString) return null;

  // If the difference is a negative number, the time happened in the past
  if (diff < 0) {
    return `${timeString} ago`;
  }

  // Otherwise, the time is going to happen in the future
  return `in ${timeString}`;
}
