const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("curriculum.js", "utf8");
const depth = fs.readFileSync("curriculum-depth.js", "utf8");
const module02 = fs.readFileSync("module02.js", "utf8");

const context = {};
vm.runInNewContext(
  source + "\n" + depth + "\n" + module02 +
  "\n;globalThis.__LESSONS = LESSONS; globalThis.__CURRICULUM = CURRICULUM;",
  context,
  { filename: "curriculum_distribution_qa.cjs" }
);

const lessons = context.__LESSONS;
const curriculum = context.__CURRICULUM;

const expected = { m1: 30, m2: 98, m3: 98, m4: 98, m5: 98, m6: 98 };

if (curriculum.meta.targetLessons !== 520) {
  throw new Error("Curriculum target must remain 520.");
}
if (lessons.length !== 520) {
  throw new Error("Expected exactly 520 runtime lessons, got " + lessons.length);
}

const ids = new Set();
for (const lesson of lessons) {
  if (ids.has(lesson.id)) throw new Error("Duplicate lesson ID: " + lesson.id);
  ids.add(lesson.id);
}

for (const module of curriculum.modules) {
  const runtimeCount = lessons.filter((lesson) => lesson.module === module.id).length;
  const authoredStageCount = module.units.length * 6;

  if (authoredStageCount !== 30) {
    throw new Error(
      "Module " + module.id + " must have 5 units × 6 stages = 30 authored lessons; got " + authoredStageCount
    );
  }

  if (runtimeCount !== expected[module.id]) {
    throw new Error(
      "Module " + module.id + " must have " + expected[module.id] +
      " runtime lessons; got " + runtimeCount
    );
  }
}

const total = Object.values(expected).reduce((a, b) => a + b, 0);
if (total !== 520) throw new Error("Expected module totals do not reconcile to 520.");

console.log("Curriculum distribution QA PASS");
console.log(JSON.stringify({
  target: curriculum.meta.targetLessons,
  total: lessons.length,
  modules: Object.fromEntries(
    curriculum.modules.map((module) => [
      module.id,
      {
        number: module.number,
        title: module.title,
        units: module.units.length,
        stagesPerUnit: 6,
        authoredLessons: module.units.length * 6,
        runtimeLessons: lessons.filter((lesson) => lesson.module === module.id).length
      }
    ])
  )
}, null, 2));
