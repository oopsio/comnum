# comnumbers

A tiny, zero-dependency utility to convert human-readable time strings to milliseconds and back. It provides the essential glue for time calculations in frameworks like Jen.js.

## Features

- **Zero Dependencies:** No `node_modules` bloat.
- **Hybrid Support:** Works with pure ESM and includes a compiled UMD build for browsers/CommonJS.
- **Bi-directional:** String to Milliseconds and Milliseconds to String.
- **Smart Humanizing:** Supports rounding, long-form words, and automatic pluralization.
- **Safe:** Handles negative numbers, decimals, and extra whitespace gracefully.

---

## Installation

```javascript
// Using ESM
import comnum, { humanize } from "comnumbers";

// Using UMD (Browser/CommonJS)
const comnum = require("comnumbers/dist/index.umd.js");
```

---

## API Reference

### `comnum(value)`

Parses a string containing a number and a time unit into milliseconds. If a regular number is passed, it returns the number as is.

**Parameters**
* **`value`** (`string` | `number`): The text to parse.

**Returns**
* (`number`): The time in milliseconds.
* (`null`): If the text is invalid or an unsupported type is passed.

**Examples**
```javascript
comnum("2d");       // 172800000
comnum("1.5h");     // 5400000
comnum("-3m");      // -180000
comnum(" 10  S ");  // 10000 (Ignores spaces and case)
comnum(100);        // 100
comnum(null);       // null
```

---

### `humanize(ms, [options])`

Formats a given time in milliseconds into a friendly, human-readable string. It automatically scales to the largest appropriate unit.

**Parameters**
* **`ms`** (`number`): The time in milliseconds to format.
* **`options`** (`Object`): Optional settings for formatting.
  * **`round`** (`boolean`): Whether to round to the nearest whole number. Default: `false`.
  * **`long`** (`boolean`): Whether to spell out the unit names completely. Default: `false`.

**Returns**
* (`string`): The formatted time string.
* (`null`): If the input is invalid (e.g., NaN or Infinity).

**Examples**
```javascript
// Basic Humanizing
humanize(1000);                         // "1s"
humanize(5400000);                      // "1.5h"
humanize(172800000);                    // "2d"

// Long Format & Automatic Plurals
humanize(60000, { long: true });        // "1 minute"
humanize(120000, { long: true });       // "2 minutes"
humanize(31536000000, { long: true });  // "1 year"

// Rounding
humanize(5300000, { round: true });     // "1h"
humanize(5500000, { round: true });     // "2h"
```

---

## Supported Units

| Unit | Short | Long |
| :--- | :--- | :--- |
| **Milliseconds** | `ms` | millisecond |
| **Seconds** | `s` | second |
| **Minutes** | `m` | minute |
| **Hours** | `h` | hour |
| **Days** | `d` | day |
| **Weeks** | `w` | week |
| **Years** | `y` | year |

