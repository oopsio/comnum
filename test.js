import comnum, { humanize } from "./dist/index.js";

console.log("--- Running comnum tests ---");

// 1. Basic Parsing
console.assert(comnum("2d") === 172800000, "Failed 2d");
console.assert(comnum("1.5h") === 5400000, "Failed 1.5h");
console.assert(comnum("100") === 100, "Failed string number");
console.assert(comnum("-3m") === -180000, "Failed negative minutes");

// 2. Handling spaces and case sensitivity
console.assert(comnum(" 10  S ") === 10000, "Failed spaces/uppercase");

// 3. Basic Humanizing (Short)
console.assert(humanize(1000) === "1s", "Failed humanize 1s");
console.assert(humanize(5400000) === "1.5h", "Failed humanize 1.5h");
console.assert(humanize(172800000) === "2d", "Failed humanize 2d");

// 4. Humanizing (Long + Plurals)
console.assert(
  humanize(60000, { long: true }) === "1 minute",
  "Failed long singular",
);
console.assert(
  humanize(120000, { long: true }) === "2 minutes",
  "Failed long plural",
);
console.assert(
  humanize(31536000000, { long: true }) === "1 year",
  "Failed long year",
);

// 5. Humanizing (Rounding)
console.assert(
  humanize(5300000, { round: true }) === "1h",
  "Failed round down",
);
console.assert(humanize(5500000, { round: true }) === "2h", "Failed round up");

// 6. Safety Checks
console.assert(comnum(null) === null, "Failed null safety");
console.assert(comnum({ msg: "hi" }) === null, "Failed object safety");

console.log("All tests passed");
