const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("curriculum.js", "utf8");
const depth = fs.readFileSync("curriculum-depth.js", "utf8");
const context = {};
vm.runInNewContext(
  source + "\n" + depth + "\n;globalThis.__LESSONS = LESSONS; globalThis.__CURRICULUM = CURRICULUM;",
  context,
  { filename: "curriculum.js" }
);

const lessons = context.__LESSONS;
const curriculum = context.__CURRICULUM;

if (!Array.isArray(lessons)) throw new Error("LESSONS was not generated");
if (lessons.length !== 520) throw new Error(`Expected 520 lessons, got ${lessons.length}`);

const expectedCounts = { m1: 30, m2: 98, m3: 98, m4: 98, m5: 98, m6: 98 };
for (const module of curriculum.modules) {
  const count = lessons.filter((lesson) => lesson.module === module.id).length;
  if (count !== expectedCounts[module.id]) {
    throw new Error(`Module ${module.id} expected ${expectedCounts[module.id]} lessons, got ${count}`);
  }
  if (module.id === "m1" && count !== 30) {
    throw new Error(`Module 01 expected 30 lessons, got ${count}`);
  }
  if (module.id === "m1" && !module.masteryGate) {
    throw new Error("Module 01 mastery gate is missing");
  }
  if (module.id === "m1" && module.masteryGate.criteria.length < 5) {
    throw new Error("Module 01 mastery gate criteria are incomplete");
  }
}

for (const lesson of lessons) {
  if (!Array.isArray(lesson.checkpoint) || lesson.checkpoint.length !== 3) {
    throw new Error(`${lesson.id}: checkpoint missing or incomplete`);
  }
  if (lesson.module === "m1" && lesson.code.includes("run_experiment")) {
    throw new Error(`${lesson.id}: placeholder code scaffold remains`);
  }
  for (const field of ["checkpointAnswers", "highlights", "keyNotes"]) {
    if (!Array.isArray(lesson[field]) || lesson[field].length === 0) {
      throw new Error(`${lesson.id}: ${field} missing`);
    }
  }
}

console.log("Curriculum runtime QA PASS");
console.log(`Lessons: ${lessons.length}; Module 01: ${lessons.filter((l) => l.module === "m1").length}`);
