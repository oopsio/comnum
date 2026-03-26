# comnumber

[![CodeQL Advanced](https://github.com/oopsio/comnum/actions/workflows/codeql.yml/badge.svg)](https://github.com/oopsio/comnum/actions/workflows/codeql.yml)

**A tiny, zero-dependency utility to convert human-readable time strings to milliseconds and back.**

comnumber is a high-performance, 1kb utility designed to solve the "small things" in the JavaScript ecosystem. It provides the essential glue for time calculations in frameworks like Jen.js.

---

## Features

- **Zero Dependencies:** No node_modules bloat.
- **Hybrid Support:** Works with pure ESM and includes a compiled UMD build for browsers/CommonJS.
- **Bi-directional:** String to Milliseconds and Milliseconds to String.
- **Smart Humanizing:** Supports rounding, long-form words, and automatic pluralization.
- **Safe:** Handles negative numbers, decimals, and extra whitespace gracefully.

---

## Installation

Since comnum is a micro-utility, you can drop the script directly into your project:

```javascript
// Using ESM
import comnumber from "comnumber";

// Using UMD (Browser/CommonJS)
const comnumber = require("./node_modules/comnumber/dist/index.js");
```

---

## Usage

### Parse Strings to Milliseconds

Pass a string with a unit suffix to get the raw millisecond value.

```javascript
import comnumber from "comnumber";

comnumber("2d"); // 172800000
comnumber("1.5h"); // 5400000
comnumber("100ms"); // 100
comnumber("-3m"); // -180000
comnumber(" 10 s "); // 10000 (Ignores spaces)
```

### Humanize Milliseconds to Strings

Turn big numbers back into something humans can read.

```javascript
import { humanize } from "comnumber";

// Default (Short)
humanize(5400000); // "1.5h"

// Long Format (with automatic plurals)
humanize(60000, { long: true }); // "1 minute"
humanize(120000, { long: true }); // "2 minutes"

// Rounding
humanize(5300000, { round: true }); // "1h"
humanize(5500000, { round: true }); // "2h"
```

---

## Supported Units

| Unit             | Short | Long        |
| :--------------- | :---- | :---------- |
| **Milliseconds** | ms    | millisecond |
| **Seconds**      | s     | second      |
| **Minutes**      | m     | minute      |
| **Hours**        | h     | hour        |
| **Days**         | d     | day         |
| **Weeks**        | w     | week        |
| **Years**        | y     | year        |

---

## Development

**Build UMD version:**
Uses SWC to transform src/index.js into a universal bundle.

```powershell
npm run build
```

**Run Tests:**
Zero-dependency test suite using console.assert.

```powershell
node test.js
```
