const fs = require("fs");

const js = fs.readFileSync("ui-experience.js", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const html = fs.readFileSync("index.html", "utf8");

const requiredJs = [
  "enhanceHome",
  "enhanceLearn",
  "enhanceTools",
  "enhanceLesson",
  "MutationObserver",
  "experienceRoute"
];
for (const token of requiredJs) {
  if (!js.includes(token)) throw new Error("Experience layer missing: " + token);
}

const requiredCss = [
  ".command-hero",
  ".home-signal-grid",
  ".knowledge-map",
  ".knowledge-node",
  ".tool-workbench",
  ".lesson-progress-rail",
  "@media(max-width:600px)"
];
for (const token of requiredCss) {
  if (!css.includes(token)) throw new Error("Experience CSS missing: " + token);
}

if (!html.includes("ui-experience.js?v=20260920-1")) {
  throw new Error("Experience layer is not loaded.");
}

if (js.includes("window.CURRICULUM") || js.includes("window.LESSONS")) {
  throw new Error("Experience layer must use lexical curriculum globals, not window-only access.");
}

console.log("UI experience QA passed: command center, knowledge graph, AI workbench, lesson mode, responsive surfaces and transition observer are present.");
