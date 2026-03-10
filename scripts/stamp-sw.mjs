import { readFileSync, writeFileSync } from "fs";

const path = new URL("../public/sw.js", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const ts = new Date().toISOString();
const content = readFileSync(path, "utf8").replace(
  /const CACHE = "trade-tracker-[^"]*";/,
  `const CACHE = "trade-tracker-${ts}";`
);
writeFileSync(path, content, "utf8");
console.log(`[stamp-sw] Cache key → trade-tracker-${ts}`);
