const fs = require("fs");

const shell = fs.readFileSync("ui-shell.js", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const html = fs.readFileSync("index.html", "utf8");

const required = [
  "liquidBottomNav",
  "liquidMoreSheet",
  "data-liquid-view",
  "window.route",
  "setActive",
  "installScrollBehavior",
  "safe-area-inset-bottom"
];

for (const token of required) {
  if (!shell.includes(token) && !css.includes(token) && !html.includes(token)) {
    throw new Error("Liquid UI shell missing required token: " + token);
  }
}

const expectedViews = ["home", "learn", "tools", "labs", "more"];
for (const view of expectedViews) {
  if (!shell.includes("view: '" + view + "'")) {
    throw new Error("Missing bottom navigation view: " + view);
  }
}

for (const view of ["projects", "progress"]) {
  if (!shell.includes("view: '" + view + "'")) {
    throw new Error("Missing More destination: " + view);
  }
}

if (!css.includes("@media (max-width:760px)") || !css.includes(".liquid-bottom-nav{display:flex}")) {
  throw new Error("Mobile bottom navigation breakpoint is missing.");
}

if (!css.includes("backdrop-filter:blur(28px)") || !css.includes("backdrop-filter:blur(30px)")) {
  throw new Error("Liquid glass blur treatment is missing.");
}

if (!css.includes("env(safe-area-inset-bottom)")) {
  throw new Error("Safe-area handling is missing.");
}

if (!html.includes('ui-shell.js?v=20260920-1')) {
  throw new Error("ui-shell.js is not loaded by index.html.");
}

console.log("UI shell QA passed: liquid bottom navigation, More sheet, route bridge, responsive glass treatment and safe-area handling are present.");
