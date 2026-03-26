import fs from "node:fs";
import zlib from "node:zlib";

const files = ["./dist/index.js", "./src/index.d.ts"];

let totalBytes = 0;

files.forEach((file) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    const gzipped = zlib.gzipSync(content);
    const bytes = gzipped.length;
    const kb = (bytes / 1024).toFixed(2);

    totalBytes += bytes;
    console.log(`${file}: ${bytes} bytes (${kb} KB)`);
  } else {
    console.log(`${file}: Not found!`);
  }
});

const totalKb = (totalBytes / 1024).toFixed(2);

console.log(`TOTAL BUNDLE SIZE: ${totalBytes} bytes (${totalKb} KB)`);
