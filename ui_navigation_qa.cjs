const fs = require("fs");

const index = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

if (/\$\$\$/.test(app)) throw new Error("Invalid $$ selector token found in app.js");

const navViews = [...index.matchAll(/class="nav-item"[^>]*data-view="([^"]+)"/g)].map((m) => m[1]);
const routeBlock = app.match(/const routes = \{([\s\S]*?)\n  \};/);
if (!routeBlock) throw new Error("Route map not found");

for (const view of navViews) {
  if (!new RegExp("\\b" + view + "\\s*(?::|,)").test(routeBlock[1])) {
    throw new Error("Navigation view has no route: " + view);
  }
}

if (!app.includes('$$(".nav-item").forEach')) throw new Error("Navigation binding is not using the multi-selector helper");
if (!app.includes('$$(".nav-item").find')) throw new Error("Navigation active-state lookup is not using the multi-selector helper");
if (!app.includes('$$("[data-tool-id]").forEach')) throw new Error("AI Tools mission binding is not using the multi-selector helper");
if (/(?<!\$)\$\("[^"]+"\)\.(?:forEach|find)\(/.test(app)) {
  throw new Error("Single-element selector incorrectly used as collection: $().forEach/find()");
}

for (const view of navViews) {
  const marker = 'data-view="' + view + '"';
  if (!index.includes(marker)) throw new Error("Missing navigation marker: " + view);
}

if (!css.includes(".sidebar nav::before")) throw new Error("Liquid navigation indicator is missing");
if (!css.includes("--liquid-x")) throw new Error("Liquid navigation position variables are missing");
if (!css.includes("prefers-reduced-motion")) throw new Error("Reduced-motion support is missing");

console.log("UI navigation QA passed");
console.log("Views:", navViews.join(", "));
