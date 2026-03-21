/**
 * Conversion factors from a given unit to milliseconds.
 * This makes it easy to multiply or divide when changing units.
 * * @constant {Object}
 */
const factors = {
  ms: 1,
  s: 1000,
  m: 60000,
  h: 3600000,
  d: 86400000,
  w: 604800000,
  y: 31536000000,
};

/**
 * Long names for time units used for the 'long' formatting option.
 * * @constant {Object}
 */
const longNames = {
  ms: "millisecond",
  s: "second",
  m: "minute",
  h: "hour",
  d: "day",
  w: "week",
  y: "year",
};

/**
 * Parses a string containing a number and a time unit into milliseconds.
 * If a regular number is passed, it returns the number as is.
 * * @param {string|number} value - The text to parse (e.g., "1h", "1.5d", "500ms").
 * @returns {number|null} The time in milliseconds, or null if the text is invalid.
 */
export default function comnum(value) {
  // If it's already a number, make sure it's not a weird math bug like NaN or Infinity
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

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

  return num * factors[type];
}

/**
 * Formats a given time in milliseconds into a friendly, human-readable string.
 * * @param {number} ms - The time in milliseconds to format.
 * @param {Object} [options] - Optional settings for how to format the text.
 * @param {boolean} [options.round=false] - Whether to round to the nearest whole number.
 * @param {boolean} [options.long=false] - Whether to spell out the unit names completely.
 * @returns {string|null} The formatted text, or null if the input is invalid.
 */
export function humanize(ms, options) {
  // Protect against math gremlins (NaN/Infinity) and safely handle empty options
  if (!Number.isFinite(ms)) return null;
  const safeOptions = options || {};

  const abs = Math.abs(ms);
  let val, unit;

  // Figure out the best unit to use. We also check if rounding the number
  // bumps it up to the next biggest unit (like rounding 59.9 minutes up to 1 hour)!
  if (
    abs >= factors.y ||
    (safeOptions.round && Math.round(abs / factors.m) >= 525600)
  ) {
    val = ms / factors.y;
    unit = "y";
  } else if (
    abs >= factors.w ||
    (safeOptions.round && Math.round(abs / factors.d) >= 7)
  ) {
    val = ms / factors.w;
    unit = "w";
  } else if (
    abs >= factors.d ||
    (safeOptions.round && Math.round(abs / factors.h) >= 24)
  ) {
    val = ms / factors.d;
    unit = "d";
  } else if (
    abs >= factors.h ||
    (safeOptions.round && Math.round(abs / factors.m) >= 60)
  ) {
    val = ms / factors.h;
    unit = "h";
  } else if (
    abs >= factors.m ||
    (safeOptions.round && Math.round(abs / factors.s) >= 60)
  ) {
    val = ms / factors.m;
    unit = "m";
  } else if (
    abs >= factors.s ||
    (safeOptions.round && Math.round(abs / factors.ms) >= 1000)
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
